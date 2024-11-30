import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useLoginMutation, userLoggedIn } from '@/features/auth/authSlice'
import { useDocumentTitle } from 'usehooks-ts'
import Logo from '@/assets/logo.svg'
import { UserLoginSchema } from '@/schema/user.validate'
import Cookies from 'universal-cookie'
import { useAppDispatch } from '@/store'
import { getUserInformation, useLazyGetCurrentUserQuery } from '@/features/user/userSlice'
import { useLazyGetRelationshipsQuery } from '@/features/relationships/relationshipsSlice'

export default function Index() {
  useDocumentTitle('Login')
  const navigate = useNavigate()
  const cookie = new Cookies(null, { path: '/' })
  const [isShowing, setIsShowing] = useState<boolean>(false)

  const dispatch = useAppDispatch()
  const [Login, { isLoading }] = useLoginMutation()

  const handleShowPassword = () => {
    setIsShowing(!isShowing)
  }
  const [getCurrentUser, { isLoading: isLoadingCurrentUser }] = useLazyGetCurrentUserQuery()
  const [getRelationships] = useLazyGetRelationshipsQuery()
  const form = useForm<z.infer<typeof UserLoginSchema>>({
    resolver: zodResolver(UserLoginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof UserLoginSchema>) => {
    await Login({ body: data })
      .unwrap()
      .then(async (res) => {
        console.log(res)
        dispatch(userLoggedIn({ token: res.result.token }))
        await getCurrentUser()
          .unwrap()
          .then(async (payloadUser) => {
            console.log(payloadUser)
						await getRelationships({ userId: payloadUser.id, page: 1 }).unwrap().then((payload) => {
							dispatch(getUserInformation({ ...payloadUser, relationships: payload.data }))
							if (payloadUser.userType === 'ADMIN') {
								navigate('/admin')
							} else {
								navigate('/')
							}
							toast.success('Login successful')
							cookie.set('accessToken', res.result.token, {
								path: '/',
								expires: new Date(new Date().setDate(new Date().getDate() + 7)),
							})
						})
          })
          .catch((error) => {
            console.log(error)
            throw new Error("Username or password doesn't match")
          })
      })
      .catch((error) => {
        toast.error(error.data.message)
      })
  }

  return (
    <>
      <img src={Logo} alt="logo" className="size-24 absolute top-10 left-10" />
      <div className="mx-auto grid min-[400px]:w-[350px] gap-6 animate-in zoom-in-90 opacity-90">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter username..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="relative">
                  <div className="flex items-center">
                    <FormLabel>Password</FormLabel>
                    <Link to="/forgot-password" className="ml-auto inline-block text-sm underline">
                      Forgot your password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      placeholder="Enter password..."
                      type={!isShowing ? 'password' : 'text'}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />

                  <span onClick={handleShowPassword} className="absolute top-7 right-2">
                    {!isShowing ? <Eye size={20} /> : <EyeOff size={20} />}
                  </span>
                </FormItem>
              )}
            />
            <Button disabled={isLoading} type="submit" className="w-full">
              {isLoading || isLoadingCurrentUser ? 'Loading...' : 'Login'}
            </Button>
          </form>
        </Form>
      </div>
    </>
  )
}
