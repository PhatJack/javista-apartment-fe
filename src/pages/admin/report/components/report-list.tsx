import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ReportType } from '@/schema/report.validate'
import { useState } from 'react'
import ReportDetail from './report-detail'
import TableRowSkeleton from '@/components/skeleton/TableRowSkeleton'

interface ReportListProps {
  reports?: ReportType[]
  isLoading?: boolean
  isFetching?: boolean
}

const ReportList = ({ reports, isFetching, isLoading }: ReportListProps) => {
  const [showDetail, setShowDetail] = useState<number | string>('')
  return (
    <>
      <Table className="relative">
        <TableHeader className="sticky top-0 bg-white">
          <TableRow>
            <TableHead className="w-[5%]">ID</TableHead>
            <TableHead className="w-[25%]">Title</TableHead>
            <TableHead className="w-[15%]">Sent Date</TableHead>
            <TableHead className="w-[15%]">Last Update</TableHead>
            <TableHead className="w-[25%]">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading || isFetching
            ? Array.from({ length: 10 }).map((_, index) => (
                <TableRow key={index} className="">
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                </TableRow>
              ))
            : reports &&
              reports.map((report) => (
                <TableRow
                  key={report?.id}
                  className="font-medium cursor-pointer"
                  onClick={() => setShowDetail(report?.id)}>
                  <TableCell className="py-4">{report?.id}</TableCell>
                  <TableCell>{report.title}</TableCell>
                  <TableCell>
                    {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {report.updatedAt === null
                      ? 'N/A'
                      : report.updatedAt
                      ? new Date(report.updatedAt).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell className="uppercase">
                    <Badge
                      variant={`${
                        report?.status === 'PENDING'
                          ? 'info'
                          : report.status === 'IN_PROGRESS'
                          ? 'warning'
                          : report.status === 'REJECTED'
                          ? 'destructive'
                          : 'success'
                      }`}>
                      {report.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
      {showDetail && <ReportDetail report={showDetail} setShowDetail={setShowDetail} />}
    </>
  )
}

export default ReportList
