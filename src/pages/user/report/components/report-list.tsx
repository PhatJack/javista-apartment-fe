import { Badge } from '@/components/ui/badge'
import ReportForm from './report-form'
import { Button } from '@/components/ui/button'
import { BadgePlus } from 'lucide-react'
import AlertDelete from '@/components/alert/AlertDelete'
import { ReportType } from '@/schema/report.validate'
import { formatDateWithSlash } from '@/utils/Generate'
import ReportItem from './report-item'
import { Skeleton } from '@/components/ui/skeleton'

interface ReportListProps {
  reports?: ReportType[]
  isLoading?: boolean
  isFetching?: boolean
}

const ReportList = ({ reports, isFetching, isLoading }: ReportListProps) => {
  return (
    <div className={`w-full h-full grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-y-auto`}>
      <ReportForm mode="create">
        <div className="p-4 w-full h-[310px] bg-white hover:bg-zinc-100 transition-all cursor-pointer rounded-md flex flex-col justify-center items-center gap-2 border">
          <p className="text-xl font-medium">New Report</p>
          <BadgePlus size={50} />
        </div>
      </ReportForm>
      {(isLoading || isFetching) &&
        Array.from({ length: 5 }).map((_, index) => (
          <Skeleton className="w-[510px] h-[310px]" key={index}></Skeleton>
        ))}
      {reports && reports.map((report, index) => <ReportItem report={report} key={index} />)}
    </div>
  )
}

export default ReportList
