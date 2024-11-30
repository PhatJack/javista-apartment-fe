import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import AlertDelete from '@/components/alert/AlertDelete'
import { ReportType, ReportSchema } from '@/schema/report.validate'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
// import DefaultAvatar from '@/assets/default-avatar.jpeg'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useDeleteReportMutation, useUpdateReportMutation } from '@/features/reports/reportSlice'
import { toast } from 'sonner'
import { Loader } from 'lucide-react'
import {
  useCreateRejectionReasonMutation,
  useLazyGetRejectionReasonQuery,
} from '@/features/rejectedreasons/rejectedReasonsSlice'
import { useEffect, useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'

interface ReportFormDetailProps {
  report?: ReportType
  setShowDetail: (value: number | string) => void
}

const ReportFormDetail = ({ report, setShowDetail }: ReportFormDetailProps) => {
  const [rejectionReason, setRejectionReason] = useState<string>('')
  const debounced = useDebounceCallback((rejectionReason) => {
    setRejectionReason(rejectionReason)
  }, 500)
  const [updateReport, { isLoading }] = useUpdateReportMutation()
  const [getRejectedReason, { isLoading: isLoadingRejectedReason, data }] =
    useLazyGetRejectionReasonQuery()
  const [createRejection, { isLoading: isLoadingRejection }] = useCreateRejectionReasonMutation()
  const [deleteReport, { isLoading: isLoadingDelete }] = useDeleteReportMutation()

  const handleDelete = async () => {
    try {
      const result = await deleteReport(report?.id).unwrap()
      console.log(result)
      if (result === undefined) {
        throw new Error('Something went wrong')
      } else {
        toast.success('Report deleted successfully')
        setShowDetail('')
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const form = useForm<z.infer<typeof ReportSchema>>({
    defaultValues: report,
    resolver: zodResolver(ReportSchema),
  })

  const handleGetRejectedReason = async () => {
    if (report?.rejectionReasonId !== null) {
      await getRejectedReason(report?.rejectionReasonId)
        .unwrap()
        .then(() => {})
        .catch((error) => {
          console.log(error)
          toast.error(error.message)
        })
    }
  }

  useEffect(() => {
    if (report && report.status === 'REJECTED') {
      handleGetRejectedReason()
    }
  }, [report])

  const onSubmit = async (data: z.infer<typeof ReportSchema>) => {
    console.log(data)
    try {
      if (data.status === 'REJECTED' && rejectionReason === '') {
        toast.error('Please provide a reason for rejection')
        return
      } else {
        const result = await updateReport({
          id: data.id,
          body: { status: data.status },
        })
        if (result.error) {
          throw new Error('Something went wrong')
        } else {
          if (data.status === 'REJECTED') {
            await createRejection({
              content: rejectionReason,
              reportId: data.id,
            })
              .unwrap()
              .then((payload) => {
                console.log(payload)
              })
              .catch((error) => {
                console.log(error)
                toast.error(error.message)
              })
          }
          toast.success('Report updated successfully')
          setShowDetail('')
        }
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const onError = (error: any) => {
    console.log(error)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="max-w-sm min-[550px]:max-w-lg w-full h-fit bg-white rounded-md relative z-[51] animate-in fade-in-95 zoom-in-95 shadow-lg">
        {isLoading ||
          (isLoadingRejection && (
            <div className="absolute inset-0 size-full rounded-md flex justify-center items-center bg-white/50 backdrop-blur-md">
              <Loader className="animate-spin text-primary" size={52} />
            </div>
          ))}
        <div className="w-full flex justify-start items-center px-4 py-3 text-xl font-medium uppercase">
          Report #<span className="text-primary">{report?.id}</span>{' '}
        </div>
        <Separator />
        <div className="p-4 w-full flex flex-col space-y-4">
          <div className="w-full rounded-md border-2 border-zinc-200 flex space-x-2 items-start p-4">
            {/* <Avatar>
                <AvatarImage
                  src={report?.user?.avatar ?? DefaultAvatar}
                  className="size-12 rounded-full object-cover hidden sm:inline-block"
                />
                <AvatarFallback>
                  {report?.user.full_name
                    ? report?.user.full_name.slice(0, 2)
                    : 'CN'}
                </AvatarFallback>
              </Avatar> */}
            <div className="flex flex-col space-y-1.5">
              {/* <p className="font-medium">{report?.user?.full_name}</p> */}
              <p className="text-sm text-zinc-500 font-medium">{report?.title}</p>
              <p className="text-sm ">{report?.content}</p>
            </div>
          </div>
          {form.getValues('status') === 'REJECTED' && (
            <Textarea
              rows={5}
              defaultValue={data?.content}
              className="disabled:bg-zinc-200 text-black"
              disabled={!data?.content ? false : true}
              onChange={(e) => debounced(e.target.value)}
            />
          )}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={
                      report?.status === 'REJECTED' || report?.status === 'RESOLVED' ? true : false
                    }
                    className="flex space-x-2 disabled:cursor-not-allowed">
                    {['PENDING', 'IN_PROGRESS', 'REJECTED', 'RESOLVED'].map((status) => (
                      <FormItem key={status} className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={status} />
                        </FormControl>
                        <FormLabel
                          className={`${
                            form.getValues('status') === status ? 'font-medium' : 'font-normal'
                          }`}>
                          {status}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Separator />
        <div className="w-full flex justify-between items-center p-4">
          <AlertDelete
            description="report"
            setAction={() => handleDelete()}
            isLoading={isLoadingDelete}
          />
          <div className="w-full flex justify-end gap-2">
            <Button onClick={() => setShowDetail('')} type="button" variant={'ghost'}>
              Cancel
            </Button>
            <Button type="submit" variant={'default'}>
              Save
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default ReportFormDetail
