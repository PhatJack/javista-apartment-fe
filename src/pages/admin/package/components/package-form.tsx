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
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { IPackage, PackageSchema } from '@/schema/package.validate'
import { PlusCircle, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
  useCreatePackageMutation,
  useUpdateImagePackageMutation,
  useUpdatePackageMutation,
} from '@/features/package/packageSlice'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import PackageSendSMS from './components/package-send-sms'
import { Label } from '@/components/ui/label'
import { useGetApartmentsQuery } from '@/features/apartment/apartmentSlice'
import { RelationshipsTypeSchema } from '@/schema/relationship.validate'
import { useLazyGetRelationshipsQuery } from '@/features/relationships/relationshipsSlice'
import { useLazyGetUserByIdQuery } from '@/features/user/userSlice'

interface PackageFormProps {
  packagee?: IPackage
  setOpen: (value: number | undefined) => void
}

const PackageForm = ({ packagee, setOpen }: PackageFormProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(
    typeof packagee?.image === 'string' ? packagee.image : null,
  )
  const [createPackage, { isLoading }] = useCreatePackageMutation()
  const [updatePackage, { isLoading: isUpdating }] = useUpdatePackageMutation()
  const [updateImagePackage, { isLoading: isUpdatingImage }] = useUpdateImagePackageMutation()
  const {
    data: apartments,
    isLoading: isLoadingApartment,
    isFetching: isFetchingApartment,
  } = useGetApartmentsQuery({ page: 1, pageSize: 60, status:'IN_USE' })
  const [getUser, { data: user }] = useLazyGetUserByIdQuery()
  const [getRelationships] = useLazyGetRelationshipsQuery()
  const [apartmentSelected, setApartmentSelected] = useState<string | undefined>(undefined)
  const [relationships, setRelationships] = useState<RelationshipsTypeSchema[]>([])
  const form = useForm<z.infer<typeof PackageSchema>>({
    mode: 'onSubmit',
    defaultValues: packagee || {
      description: '',
      image: undefined,
      isReceive: false,
    },
    resolver: zodResolver(PackageSchema),
  })

  const onSubmit = async (data: z.infer<typeof PackageSchema>) => {
    try {
      const newData = {
        description: data.description,
        isReceive: data.isReceive,
        userId: data.userId,
      }
      console.log(data.image)
      if (packagee) {
        // Update existing package
        const updatePromises = []

        // Add package data update promise
        updatePromises.push(updatePackage({ id: packagee.id, body: newData }).unwrap())
        // Add image update promise if there's a new image
        if (typeof data.image !== 'string') {
          const formData = new FormData()
          formData.append('file', data.image)
          updatePromises.push(updateImagePackage({ id: packagee.id, image: formData }).unwrap())
        }

        // Wait for all updates to complete
        await Promise.all(updatePromises)
        toast.success('Package updated successfully')
        setOpen(undefined)
      } else {
        const certainData = {
          description: data.description,
          userId: data.userId,
        }
        const newPackage = await createPackage(certainData).unwrap()
        const formData = new FormData()
        formData.append('file', data.image)
        await updateImagePackage({ id: newPackage.id, image: formData })
          .unwrap()
          .then(() => {
            toast.success('Package created successfully')
            setOpen(undefined)
          })
          .catch(() => {
            toast.error('Failed to update image')
          })
      }
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong')
    }
  }

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const file = files[0]

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, GIF, or WebP)')
      return
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB')
      return
    }

    if (file) {
      setSelectedImage(URL.createObjectURL(file))
    }
  }

  // Handle image removal
  const removeImage = () => {
    setSelectedImage(null)
  }

  const handleGetRelationships = async (apartmentId: string) => {
    await getRelationships({ page: 1, apartmentId: apartmentId })
      .unwrap()
      .then((payload) => {
        const uniqueUsers = Array.from(
          new Map(payload.data.map((user) => [user.userId, user])).values(),
        )
        setRelationships(uniqueUsers)
      })
      .catch(() => {})
  }

  useEffect(() => {
    if (packagee) {
      form.reset(packagee)
      const handleGetUser = async () => {
        await getUser(packagee.userId).unwrap()
      }
      handleGetUser()
    }
  }, [])

  useEffect(() => {
    if (apartmentSelected) {
      handleGetRelationships(apartmentSelected)
    }
  }, [apartmentSelected])

  return (
    <Form {...form}>
      <form
        encType="multipart/form-data"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4">
        <div className="w-full flex justify-center gap-4">
          <div className="w-full space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="max-h-40"
                      placeholder="Type something"></Textarea>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isReceive"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Status</FormLabel>
                  <Select
                    disabled={String(field.value) === 'true' || !packagee ? true : false}
                    onValueChange={(value) => {
                      // Convert string value to boolean
                      field.onChange(value === 'true')
                    }}
                    value={String(field.value)} // Convert boolean to string for Select
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select package status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="true">Collected</SelectItem>
                      <SelectItem value="false">Not Collected</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {packagee ? (
              <div className="flex flex-col space-y-3">
                <Label>Receiver</Label>
                <Input
                  value={user?.fullName || 'N/A'}
                  readOnly
                  className="read-only:bg-gray-50 cursor-not-allowed"
                />
              </div>
            ) : (
              <>
                <div className="flex flex-col space-y-2">
                  <Label>Choose Apartment</Label>
                  {isLoadingApartment || isFetchingApartment ? (
                    <div className="w-full h-9 rounded-md animate-pulse bg-gray-100"></div>
                  ) : (
                    <Select
                      value={apartmentSelected}
                      onValueChange={(e) => setApartmentSelected(e)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select apartment" />
                      </SelectTrigger>
                      <SelectContent>
                        {apartments?.data && apartments.data.length > 0 ? (
                          apartments.data.map((apartment, index) => (
                            <SelectItem key={index} value={String(apartment.id)}>
                              {apartment.id}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>
                            No apartments found
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Choose receiver</FormLabel>
                      <Select
                        disabled={packagee !== undefined}
                        onValueChange={field.onChange}
                        value={String(field.value)}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select user" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {relationships && relationships.length > 0 ? (
                            relationships.map((relationship, index) => (
                              <SelectItem key={index} value={String(relationship.user?.id)}>
                                {relationship.user?.fullName}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>
                              No users found
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <div className="w-full h-full">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="w-full h-full">
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <div className="w-full h-[300px] border-2 rounded-md relative flex flex-col justify-center items-center gap-2">
                      {selectedImage ? (
                        <>
                          <img
                            src={selectedImage}
                            loading="lazy"
                            alt="Preview"
                            className="w-full h-full object-center object-contain rounded-md relative z-10"
                          />
                          <Button
                            size={'icon'}
                            type="button"
                            onClick={removeImage}
                            variant={'destructive'}
                            className="absolute top-2 right-2 z-10">
                            <X />
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="text-zinc-400 font-medium">Add image </span>
                          <PlusCircle size={35} className="text-zinc-400" />
                        </>
                      )}
                      <Input
                        type="file"
                        accept="image/*"
                        className="absolute size-full opacity-0 cursor-pointer object-center"
                        placeholder="Type something"
                        onChange={(e) => {
                          if (e.target.files) {
                            field.onChange(e.target.files[0])
                          }
                          handleImageChange(e)
                        }}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="w-full flex justify-between items-center">
          {packagee && <PackageSendSMS packageId={packagee.userId} />}
          <div className="w-full flex justify-end gap-4">
            <Button type="button" size={'lg'} variant={'ghost'} onClick={() => setOpen(undefined)}>
              Cancel
            </Button>
            <Button type="submit" size={'lg'} variant={'default'}>
              {isLoading || isUpdating || isUpdatingImage ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default PackageForm
