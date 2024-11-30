import { formatDateWithSlash } from '@/utils/Generate'
import ReportForm from './report-form'
import { Button } from '@/components/ui/button'
import { IReport } from '@/schema/report.validate'
import AlertDelete from '@/components/alert/AlertDelete'
import { useDeleteReportMutation } from '@/features/reports/reportSlice'
import { toast } from 'sonner'

interface ReportItemProps {
  report: IReport
}

const ReportItem = ({ report }: ReportItemProps) => {
  const [deleteReport, { isLoading }] = useDeleteReportMutation()
  const handleDelete = async () => {
    await deleteReport(report.id)
      .unwrap()
      .then(() => {
        toast.success('Delete report successfully')
      })
      .catch(() => {
        toast.error('Delete report failed')
      })
  }

  return (
    <div className="p-4 w-full h-[310px] bg-white rounded-md flex flex-col gap-4 border">
      <div className="w-full flex justify-between items-center">
        <span className="font-medium">
          {formatDateWithSlash(new Date(report.createdAt))}
        </span>
        <ReportForm mode="update" report={report}>
          <Button variant={'default'} size={'sm'}>
            Details
          </Button>
        </ReportForm>
      </div>
      <div className="w-full h-full rounded-md bg-zinc-100 p-4 border border-zinc-300">
        <p className="line-clamp-4 font-medium">
          <span className="font-normal">Description:</span> {report.content}
        </p>
      </div>
      <div className="w-full flex justify-between items-center">
        <div className="flex gap-2">
          <div className="flex flex-col">
            <p className="font-medium">
              <span>{}</span>
            </p>
            <span className="text-sm font-medium ">
              {report.relationship?.apartmentId}
            </span>
          </div>
        </div>
        <AlertDelete
          description="report"
          setAction={() => handleDelete()}
					isLoading={isLoading}
          variants="error"
        />
      </div>
    </div>
  )
}

export default ReportItem
