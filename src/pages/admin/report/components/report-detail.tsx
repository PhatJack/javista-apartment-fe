import { useGetReportQuery } from '@/features/reports/reportSlice'
import ReportDetailForm from './components/report-detail-form'
import { Loader } from 'lucide-react'
import { memo } from 'react'

interface ReportDetailProps {
  report: number | string
  setShowDetail: (value: number | string) => void
}

const ReportDetail = ({ setShowDetail, report }: ReportDetailProps) => {
  const {
    data: reportData,
    isLoading,
    isFetching,
  } = useGetReportQuery(report, {
    skip: !report,
  })

  return (
    <div className="fixed w-full h-screen flex justify-center items-center inset-0 z-50">
      <div
        className="fixed inset-0 bg-gradient-to-b from-black/20 to-black/60 animate-in fade-in"
        onClick={() => setShowDetail('')}></div>
      {isLoading || isFetching ? (
        <div className="w-[512px] h-[484px] rounded-lg bg-white flex justify-center items-center relative z-[51]">
          <Loader className="animate-spin text-primary" size={52} />
        </div>
      ) : (
        <ReportDetailForm report={reportData} setShowDetail={setShowDetail} />
      )}
    </div>
  )
}

export default memo(ReportDetail)
