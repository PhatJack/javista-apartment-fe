import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ReportType, ReportSchema } from '@/schema/report.validate'
import { formatDateWithSlash } from '@/utils/Generate'
import { useCreateReportMutation } from '@/features/reports/reportSlice'
import { useAppSelector } from '@/store'
import { toast } from 'sonner'

interface ReportFormProps {
  children: React.ReactNode
  report?: ReportType
  mode: 'create' | 'update'
}

const ReportForm = ({ children, report, mode = 'create' }: ReportFormProps) => {
  const [open, setOpen] = useState<boolean>(false)
  const user = useAppSelector((state) => state.userReducer.user)
  const form = useForm<z.infer<typeof ReportSchema>>({})
  const [createReport, { isLoading }] = useCreateReportMutation()

  // Get unique apartment IDs using Set
  const uniqueApartments = Array.from(
    new Set(user?.relationships?.map((rel) => rel.apartmentId) || []),
  ).map((apartmentId) => {
    // Find the first relationship with this apartmentId to get its ID
    const relationship = user?.relationships?.find((rel) => rel.apartmentId === apartmentId)
    return {
      relationshipId: relationship?.id,
      apartmentId: apartmentId,
    }
  })

  useEffect(() => {
    if (report) {
      form.reset({
        title: report.title,
        content: report.content,
      })
    }
  }, [])

  const onSubmit = async (data: z.infer<typeof ReportSchema>) => {
    if (mode === 'create') {
      await createReport({
        title: data.title,
        content: data.content,
        relationshipId: data.relationshipId,
        status: 'PENDING',
      })
        .unwrap()
        .then(() => {
          toast.success('Send report to admin successfully')
          setOpen(false)
        })
        .catch((error) => {
          console.error(error)
          toast.error('Failed to send report')
        })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-sm min-[500px]:max-w-md sm:max-w-lg lg:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {report?.id
              ? `Report - ${formatDateWithSlash(new Date(report.createdAt ?? ''))}`
              : 'New Report'}
          </DialogTitle>
        </DialogHeader>
        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {!report && (
              <FormField
                control={form.control}
                name="relationshipId"
                render={({ field }) => (
                  <FormItem className="w-full space-y-4">
                    <FormLabel className="text-base">From apartment</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={String(field.value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose apartment" />
                        </SelectTrigger>
                        <SelectContent>
                          {uniqueApartments.map((apartment) => (
                            <SelectItem
                              key={apartment.apartmentId}
                              value={String(apartment.relationshipId)}>
                              {apartment.apartmentId}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full space-y-4">
                  <FormLabel className="text-base">Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="read-only:bg-zinc-100"
                      placeholder="Title"
                      readOnly={!!report}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="w-full space-y-4">
                  <FormLabel className="text-base">
                    What do you think about that problem? (Write something)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      {...field}
                      readOnly={!!report}
                      className="read-only:bg-zinc-100"
                      placeholder="Write something..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {mode === 'create' && (
              <div className="w-full flex justify-end gap-4">
                <DialogClose asChild>
                  <Button size="lg" type="button" variant="ghost">
                    Cancel
                  </Button>
                </DialogClose>
                <Button size="lg" type="submit" variant="default">
                  {isLoading ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ReportForm
