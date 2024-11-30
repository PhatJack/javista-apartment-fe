import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useForm } from 'react-hook-form'
import { DateTimePicker } from '@/components/ui/datetime-picker'
import { z } from 'zod'
import { UserSchema } from '@/schema/user.validate'
import { UserRole } from '@/enums'
import { Checkbox } from '@/components/ui/checkbox'
import QrCodeScanner from '@/components/qrcode/QrCodeScanner'
import { parseDateFromString } from '@/utils/ExtractTime'
import { useCreateUserMutation } from '@/features/user/userSlice'
import { toast } from 'sonner'
import { Loader } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import Overlay from '@/components/overlay/Overlay'

interface UserFormProps {
  open: boolean
  onClose: (value: boolean) => void
}

const UserForm = ({ open, onClose }: UserFormProps) => {
  const [createUser, { isLoading }] = useCreateUserMutation()
  const form = useForm<Omit<z.infer<typeof UserSchema>, 'id'>>({
    mode: 'onSubmit',
    defaultValues: {
      fullName: '',
      nationId: '',
      gender: undefined,
      dateOfBirth: undefined,
      username: '',
      email: '',
      phone: '',
      userType: 'RESIDENT',
    },
    resolver: zodResolver(UserSchema.omit({ id: true })),
  })

  const onSubmit = async (data: Omit<z.infer<typeof UserSchema>, 'id'>) => {
    try {
      await createUser(data)
        .unwrap()
        .then(() => {
          toast.success('User created successfully')
          form.reset()
          onClose(false)
        })
        .catch((error) => {
          throw new Error(error)
        })
    } catch (error) {
      console.error(error)
      toast.error('Failed to create user')
      onClose(false)
    } finally {
    }
  }

  const handleQrScanSuccess = (data: any) => {
    // Assuming the scanned data is an object with keys: name, nationId, gender, and dob
    form.setValue('fullName', data.name)
    form.setValue('nationId', data.nationID)
    form.setValue('gender', data.gender == 'Nam' ? 'MALE' : 'FEMALE')
    console.log(form.getValues('gender'))
    form.setValue('dateOfBirth', (data.dob && parseDateFromString(data.dob)) ?? undefined) // Adjust as necessary
  }

  const onError = (error: any) => {
    console.log(error)
  }

  return (
    <Overlay>
      <div className="lg:min-w-[600px] lg:max-w-5xl rounded-md bg-white flex flex-col space-y-2 p-4">
        {isLoading && (
          <div className="absolute inset-0 size-full rounded-md flex justify-center items-center bg-white/50 backdrop-blur-md">
            <Loader className="animate-spin text-primary" size={52} />
          </div>
        )}
        <p className="text-2xl font-medium">New User</p>
        <Separator />
        <div className="flex items-center gap-4">
          <h2 className="font-medium">Personal Information</h2>
          <QrCodeScanner handleQrScanSuccess={handleQrScanSuccess} />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-2 lg:space-y-4">
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
            <div className="w-full flex flex-wrap md:flex-nowrap gap-2">
              <FormField
                control={form.control}
                name="nationId"
                render={({ field }) => (
                  <FormItem className="w-full flex-[1_1_140px]">
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
                  <FormItem className="w-full flex-[1_1_140px]">
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ''} // Add this line
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={'MALE'}>Male</SelectItem>
                          <SelectItem value={'FEMALE'}>Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="w-full flex-[1_1_140px]">
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
            <div className="w-full flex gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Type your email"
                        {...field}
                        type="email"
                        className="focus-visible:ring-primary"
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
                      <Input
                        placeholder="Enter your phone number"
                        {...field}
                        type="tel"
                        className="focus-visible:ring-primary read-only:bg-muted"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full flex gap-2">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Type your username"
                        {...field}
                        type="text"
                        className="focus-visible:ring-primary"
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
                    <Checkbox checked={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="font-medium uppercase">Is staying</FormLabel>
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
                                  {...field}
                                  checked={field.value === (role as UserRole)}
                                  onCheckedChange={() => {
                                    field.onChange(role)
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">{role}</FormLabel>
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
            <div className="w-full flex justify-end gap-4">
              <Button onClick={() => onClose(false)} type="button" size={'lg'} variant={'ghost'}>
                Cancel
              </Button>
              <Button type="submit" size={'lg'} variant={'default'}>
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Overlay>
  )
}

export default UserForm
