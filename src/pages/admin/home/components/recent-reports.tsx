import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetReportsQuery } from '@/features/reports/reportSlice'
import { formatDateWithSlash } from '@/utils/Generate'

const RecentReports = () => {
  const { data: reports, isLoading } = useGetReportsQuery({
    page: 1,
    sort: ['createdAt'],
    pageSize: 5,
    includes: ['Relationship'],
  })

  return (
    <div id="recentReports" className="size-full bg-white rounded-md p-4 flex flex-col overflow-hidden">
      <p className="font-medium text-lg">Recent Reports</p>
      <Separator className="mb-4 mt-2" />
      <div className="w-full h-full flex lg:flex-col flex-row gap-4 overflow-x-auto lg:overflow-x-hidden lg:overflow-y-auto">
        {isLoading &&
          Array.from({ length: 5 }).map((_, index) => (
            <Skeleton
              key={index}
              className="p-4 min-w-[300px] min-h-[300px] bg-zinc-100 rounded-md flex flex-col gap-4 border"
            />
          ))}
        {reports?.data.map((report, index) => (
          <div
            key={index}
            className="p-4 min-w-[300px] min-h-[200px] max-h-[250px] bg-white rounded-md flex flex-col gap-4 border">
            <div className="w-full flex justify-between items-center">
              <span className="font-medium">
                {formatDateWithSlash(new Date(report.createdAt))}
              </span>
              <span className="font-medium text-primary">
                {report.relationship?.apartmentId}
              </span>
            </div>
            <div className="w-full h-full rounded-md bg-zinc-100 p-4 border border-primary/30">
              <p className="line-clamp-4 font-medium">
                <span className="font-normal">Description:</span>{' '}
                {report.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentReports
