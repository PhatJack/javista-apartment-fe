import React from 'react'
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
import { ServiceSchema } from '@/schema/service.validate'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { useCreateServiceMutation, useUpdateServiceMutation } from '@/features/service/serviceSlice'
import { Loader } from 'lucide-react'

interface IServiceDetailFormProps {
  setOpen: (value: boolean) => void
  initialData?: z.infer<typeof ServiceSchema>
}

const ServiceDetailForm = ({ setOpen, initialData }: IServiceDetailFormProps) => {
  const [createService, { isLoading: isLoadingCreate }] = useCreateServiceMutation()
  const [updateService, { isLoading: isLoadingUpdate }] = useUpdateServiceMutation()

  const form = useForm<z.infer<typeof ServiceSchema>>({
    defaultValues: initialData || {
      name: '',
      description: '',
      price: 20000,
    },
    resolver: zodResolver(ServiceSchema),
  })

  const onSubmit = async (data: z.infer<typeof ServiceSchema>) => {
    try {
      let result
      const { name, description, price } = data
      if (initialData) {
        result = await updateService({
          id: initialData.id,
          body: { name: name, description: description, price: price },
        })
      } else {
        result = await createService({ name: name, description: description, price: price })
      }

      if ('error' in result) {
        throw new Error('Something went wrong')
      } else {
        toast.success(`Service ${initialData ? 'updated' : 'created'} successfully`)
        setOpen(false)
      }
    } catch (error: any) {
      console.error(error)
      toast.error(error.message)
    }
  }

  const isLoading = isLoadingCreate || isLoadingUpdate

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {isLoading && (
          <div className="absolute inset-0 size-full rounded-md flex justify-center items-center bg-white/50 backdrop-blur-md">
            <Loader className="animate-spin text-primary" size={52} />
          </div>
        )}
        <div className="w-full flex flex-wrap md:flex-nowrap gap-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Type service name"
                    {...field}
                    type="text"
                    className="focus-visible:ring-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter price"
                    {...field}
                    type="number"
                    onChange={(event) => field.onChange(+event.target.value)}
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
          name="description"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter service description"></Textarea>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex justify-end gap-4">
          <Button onClick={() => setOpen(false)} type="button" size="lg" variant="ghost">
            Cancel
          </Button>
          <Button type="submit" size="lg" variant="default">
            {initialData ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ServiceDetailForm
