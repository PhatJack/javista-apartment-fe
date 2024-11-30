import Overlay from '@/components/overlay/Overlay'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  getUserInformation,
  useGetCurrentUserQuery,
  useUpdatePassordMutation,
} from '@/features/user/userSlice'
import { FirstLoginSchema } from '@/schema/user.validate'
import { useAppDispatch } from '@/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const Index = () => {
  const [updatePassword, { isLoading }] = useUpdatePassordMutation()
  const dispatch = useAppDispatch()
  const { refetch: refetchCurrentUser } = useGetCurrentUserQuery()
  const form = useForm<z.infer<typeof FirstLoginSchema>>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(FirstLoginSchema),
  })

  const onSubmit = async (data: z.infer<typeof FirstLoginSchema>) => {
    try {
      await updatePassword({ body: data })
        .unwrap()
        .then(async () => {
          await refetchCurrentUser()
            .unwrap()
            .then((payload) => {
              dispatch(getUserInformation(payload))
            })

          toast.success('Update password successfully')
        })
        .catch((error) => {
          throw new Error(error)
        })
      // If you want to force a manual refetch in addition to the automatic one:
    } catch (error) {
      // Handle error
      console.error('Failed to update password:', error)
    }
  }

  return (
    <Overlay className="backdrop-blur-md">
      <div className="w-[500px] p-4 bg-white rounded-md flex flex-col space-y-2 relative overflow-hidden">
        <p className="text-3xl text-primary font-bold">Welcome to Zity</p>
        <p className="text-zinc-500 font-medium">
          This is your first time login, please add a new password to secure
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter new password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Confirm new password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {isLoading ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
        </Form>
      </div>
    </Overlay>
  )
}

export default Index
