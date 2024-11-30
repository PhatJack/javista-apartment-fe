import { useDocumentTitle } from 'usehooks-ts'
import BreadCrumb from '@/components/breadcrumb'
import ReportList from './components/report-list'
import { useState } from 'react'
import { useGetReportsQuery } from '@/features/reports/reportSlice'
import { useAppSelector } from '@/store'
import PaginationCustom from '@/components/pagination/PaginationCustom'
const Index = () => {
  useDocumentTitle('Report')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const user = useAppSelector((state) => state.userReducer.user)
  const { data, isLoading, isFetching } = useGetReportsQuery({
    page: currentPage,
    includes: ['relationship'],
    Relationship_UserId: user?.id,
  })
  return (
    <div className="w-full sm:h-screen flex flex-col bg-zinc-100">
      <BreadCrumb paths={[{ label: 'report', to: '/reports' }]} />
      <div className="w-full h-full p-4 overflow-hidden">
        <div className="w-full h-full p-4 bg-white rounded-md flex flex-col gap-2 overflow-y-auto">
          <ReportList reports={data?.data} isLoading={isLoading} isFetching={isFetching} />
          <div className="p-2">
            <PaginationCustom
              onPageChange={setCurrentPage}
              currentPage={currentPage}
              totalPages={data?.totalPages}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
