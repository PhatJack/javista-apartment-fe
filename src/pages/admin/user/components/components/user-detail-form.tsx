import AlertDelete from '@/components/alert/AlertDelete'
import { useForm } from 'react-hook-form'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'
import { DateTimePicker } from '@/components/ui/datetime-picker'
import { Button } from '@/components/ui/button'
import { Loader, X } from 'lucide-react'
import GridWallpaper from '@/assets/grid-wallpaper.jpg'
import { Separator } from '@/components/ui/separator'
import { z } from 'zod'
import { User, UserSchema } from '@/schema/user.validate'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDeleteUserMutation, useUpdateUserMutation } from '@/features/user/userSlice'
import { toast } from 'sonner'
import { Checkbox } from '@/components/ui/checkbox'

interface UserDetailFormProps {
  user?: User
  setShowDetail: (value: string | number | null) => void
  isLoading?: boolean
}

const UserDetailForm = ({ user, setShowDetail }: UserDetailFormProps) => {
  const [updateUser, { isLoading }] = useUpdateUserMutation()
  const [deleteUser, { isLoading: isLoadingDelete }] = useDeleteUserMutation()
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined)

  const form = useForm<z.infer<typeof UserSchema>>({
    mode: 'onSubmit',
    defaultValues: {
      id: user?.id,
      username: user?.username,
      avatar: user?.avatar,
      isFirstLogin: user?.isFirstLogin,
      email: user?.email,
      phone: user?.phone,
      dateOfBirth: user?.dateOfBirth,
      fullName: user?.fullName,
      userType: user?.userType,
      nationId: user?.nationId,
      gender: user?.gender,
      isStaying: user?.isStaying,
    },
    resolver: zodResolver(UserSchema),
  })

  const onSubmit = async (data: z.infer<typeof UserSchema>) => {
    const newData = {
      email: data.email,
      fullName: data.fullName,
      phone: data.phone,
      gender: data.gender,
      nationId: data.nationId,
      dateOfBirth: data.dateOfBirth,
      isStaying: data.isStaying,
    }
    try {
      const result = await updateUser({ id: data.id, body: newData })
      if (result.error) {
        throw new Error('Something went wrong')
      } else {
        toast.success('User updated successfully')
        setShowDetail('')
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const handleDelete = async () => {
    try {
      const result = await deleteUser(user?.id).unwrap()
      console.log(result)
      if (result === undefined) {
        throw new Error('Something went wrong')
      } else {
        toast.success('User deleted successfully')
        setShowDetail('')
      }
    } catch (error: any) {
      if (error.status === 405) {
        toast.error('Method not allowed')
      }
    }
  }

  const onError = (error: any) => {
    console.log(error)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="z-[99] min-[500px]:max-w-lg lg:max-w-2xl border-4 border-white/80 w-full animate-in fade-in slide-in-from-bottom-2 duration-300 relative bg-white rounded-lg overflow-hidden shadow-lg">
        {isLoading && (
          <div className="absolute inset-0 size-full rounded-md flex justify-center items-center bg-white/50 backdrop-blur-md">
            <Loader className="animate-spin text-primary" size={52} />
          </div>
        )}

        <img
          src={GridWallpaper}
          alt="grid wallpaper"
          className="w-full h-[140px] object-cover absolute inset-0 border-b-4 border-white"
        />
        <Button
          className="absolute top-3 right-3"
          size={'icon'}
          onClick={() => setShowDetail(null)}
          variant={'ghost'}>
          <X />
        </Button>
        <div className="size-full flex flex-col space-y-4 px-4 pb-4 pt-10">
          <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Avatar</FormLabel>
                <FormControl>
                  <div className="relative size-32 overflow-hidden rounded-full shadow-lg group/selectedImage">
                    {/* Display current image */}
                    <img
                      src={field.value ?? selectedImage}
                      alt="Avatar preview"
                      className="size-full object-cover border-4 rounded-full border-zinc-100"
                    />
                    {selectedImage && (
                      <div className="absolute size-full inset-0 flex justify-center items-center transition-all opacity-0 group-hover/selectedImage:opacity-100 group-hover/selectedImage:z-10 bg-gray-200">
                        <Button
                          onClick={() => {
                            form.setValue('avatar', undefined)
                            setSelectedImage(undefined)
                          }}
                          type="button"
                          size={'icon'}
                          variant={'ghost'}>
                          <X />
                        </Button>
                      </div>
                    )}
                    {/* File upload option */}
                    <Input
                      type="file"
                      accept="image/*"
                      className="size-full absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onload = () => {
                            if (typeof reader.result === 'string') {
                              form.setValue('avatar', reader.result) // Set image URL as base64 string
                              setSelectedImage(reader.result) // Set image URL as base64 string
                            }
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Type your full name"
                    {...field}
                    className="focus-visible:ring-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex flex-wrap gap-2">
            <FormField
              control={form.control}
              name="nationId"
              render={({ field }) => (
                <FormItem className="w-full flex-[1_1_150px]">
                  <FormLabel>National ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Type your national ID"
                      {...field}
                      type="number"
                      minLength={12}
                      maxLength={12}
                      className="focus-visible:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="w-full flex-[1_1_150px]">
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="w-full flex-[1_1_150px]">
                  <FormLabel>Date Of Birth</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      granularity="day"
                      displayFormat={{ hour24: 'MMM, dd, yyyy' }}
                      placeholder="Pick a date"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <p className="text-gray-500 font-medium text-sm">Account Information</p>
          <div className="w-full flex gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter email..."
                      type="email"
                      className="read-only:bg-gray-100 cursor-not-allowed"
                      readOnly
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone..." type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter username..."
                      className="read-only:bg-gray-100 cursor-not-allowed"
                      {...field}
                      readOnly
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="isStaying"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked)
                    }}
                  />
                </FormControl>
                <FormLabel className={`uppercase ${field.value ? 'font-medium' : 'font-normal'}`}>
                  Is staying
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userType"
            render={() => (
              <FormItem>
                <div className="">
                  <FormLabel className="text-base">Role</FormLabel>
                </div>
                <div className="flex space-x-4">
                  {['ADMIN', 'RESIDENT'].map((role, index) => (
                    <FormField
                      key={index}
                      control={form.control}
                      name="userType"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={index}
                            className="flex flex-row items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value === role}
                                disabled
                                onCheckedChange={() => {
                                  field.onChange(role)
                                }}
                              />
                            </FormControl>
                            <FormLabel
                              className={`text-sm ${
                                field.value === role ? 'font-medium' : 'font-normal'
                              }`}>
                              {role}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Separator />
        <div className="w-full h-full flex justify-between items-center p-4">
          <AlertDelete
            description="user"
            setAction={() => handleDelete()}
            isLoading={isLoadingDelete}
          />
          <div className="flex gap-2">
            <Button onClick={() => setShowDetail(null)} type="button" variant={'ghost'}>
              Cancel
            </Button>
            <Button type="submit" variant={'info'}>
              Submit
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default UserDetailForm
