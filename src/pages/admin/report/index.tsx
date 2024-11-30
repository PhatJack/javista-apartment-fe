import { useDocumentTitle } from 'usehooks-ts'
import ReportList from './components/report-list'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import BreadCrumb from '@/components/breadcrumb'
import { useGetReportsQuery } from '@/features/reports/reportSlice'
import { useState } from 'react'
import PaginationCustom from '@/components/pagination/PaginationCustom'
import PageSizeSelector from '@/components/table/page-size-selector'
import PaginationInfo from '@/components/table/page-info'
const Index = () => {
  useDocumentTitle('Report')
  const [pageSize, setPageSize] = useState<number>(10)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const {
    data: reports,
    isLoading,
    isFetching,
  } = useGetReportsQuery({ page: currentPage })

  return (
    <div className="w-full h-full flex flex-col bg-zinc-100">
      <BreadCrumb
        paths={[
          {
            label: 'report',
            to: '/admin/report',
          },
        ]}
      />
      <div className="w-full h-full p-4 overflow-hidden">
        <div className="bg-white w-full h-full rounded-md p-4 flex flex-col space-y-2">
          <section className="w-full flex flex-col sm:flex-row sm:gap-0 gap-4 justify-between items-center">
            <div className="w-full lg:w-1/3 flex items-center border px-3 py-0.5 relative rounded-md focus-within:border-primary transition-all">
              <Search size={20} />
              <Input
                placeholder="Search something"
                className="border-none shadow-none focus-visible:ring-0"
              />
            </div>
          </section>
          <div className="size-full overflow-y-auto">
            <ReportList
              reports={reports?.data}
              isLoading={isLoading}
              isFetching={isFetching}
            />
          </div>
          <div className="w-full flex justify-between items-center">
            <PageSizeSelector
              className="w-full"
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
							setCurrentPage={setCurrentPage}
            />
            <div className="w-full">
              <PaginationCustom
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                totalPages={reports?.totalPages}
              />
            </div>
            <PaginationInfo
              className="w-full whitespace-nowrap"
              currentPage={currentPage}
              pageSize={pageSize}
              totalElements={reports?.totalElements}
              loading={isLoading || isFetching}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
