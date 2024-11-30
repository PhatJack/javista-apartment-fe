import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { ApartmentSchema } from '@/schema/apartment.validate'
import { Textarea } from '@/components/ui/textarea'
import { useCreateApartmentMutation } from '@/features/apartment/apartmentSlice'

interface ApartmentFormProps {
  textTrigger: string
}

const ApartmentForm = ({ textTrigger }: ApartmentFormProps) => {
  const [createApartment, { isLoading }] = useCreateApartmentMutation()
  const form = useForm<z.infer<typeof ApartmentSchema>>({
    defaultValues: {
      area: undefined,
      description: '',
      floorNumber: undefined,
      apartmentNumber: undefined,
      status: 'EMPTY',
    },
  })

  const onSubmit = async (data: z.infer<typeof ApartmentSchema>) => {
    console.log(data)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-fit" variant={'default'} size={'lg'}>
          {textTrigger}
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-2xl">New Apartment</DialogTitle>
        </DialogHeader>
        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Area</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Type something"
                      {...field}
                      className="focus-visible:ring-primary"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Type something"
                      className="focus-visible:ring-primary max-h-[200px]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="w-full flex gap-2">
              <FormField
                control={form.control}
                name="floorNumber"
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Floor Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Type something"
                        {...field}
                        className="focus-visible:ring-primary"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="apartmentNumber"
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Apartment Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Type something"
                        {...field}
                        className="focus-visible:ring-primary"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Separator />
            <div className="w-full flex justify-end gap-4">
              <DialogClose asChild>
                <Button size={'lg'} variant={'ghost'}>
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button size={'lg'} variant={'default'}>
                  Save
                </Button>
              </DialogClose>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ApartmentForm
