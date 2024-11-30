import { Input } from '@/components/ui/input'
import { Filter, Search } from 'lucide-react'
import { Button } from '@components/ui/button'
import PackageList from './components/package-list'
import BreadCrumb from '@/components/breadcrumb'
import { useDocumentTitle } from 'usehooks-ts'
import { useGetPackagesQuery } from '@/features/package/packageSlice'
import PaginationCustom from '@/components/pagination/PaginationCustom'
import { useState } from 'react'
import PackageDetail from './components/package-detail'
import PageSizeSelector from '@/components/table/page-size-selector'
import PaginationInfo from '@/components/table/page-info'
const Index = () => {
  useDocumentTitle('Package')
  const [pageSize, setPageSize] = useState<number>(10)
  const [showDetail, setShowDetail] = useState<number | undefined>(undefined)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const {
    data: packages,
    isLoading,
    isFetching,
  } = useGetPackagesQuery({
    page: currentPage,
    pageSize: pageSize,
  })

  return (
    <>
      <div className="w-full sm:h-screen flex flex-col bg-zinc-100">
        <BreadCrumb paths={[{ label: 'package', to: '/package' }]} />
        <div className="size-full p-4 overflow-hidden">
          <div className="size-full p-4 bg-white rounded-md flex flex-col space-y-2">
            <div className="w-full h-auto flex lg:flex-row flex-col gap-4 justify-between items-center">
              <div className="w-full flex gap-4 items-center">
                <div className="lg:w-1/4 w-full flex items-center border px-3 py-0.5 relative rounded-md focus-within:border-primary transition-all">
                  <Search size={20} />
                  <Input
                    placeholder="Search something"
                    className="border-none shadow-none focus-visible:ring-0"
                  />
                </div>
                <Button className="gap-1" size={'lg'} variant={'secondary'}>
                  <Filter size={20} />
                  Filter
                </Button>
              </div>
              <Button
                type="button"
                onClick={() => {
                  setShowDetail(-1)
                }}
                className="w-full sm:w-[160px]"
                variant={'default'}
                size={'lg'}>
                New Package
              </Button>
            </div>
            <div className="size-full overflow-y-auto">
              <PackageList
                packages={packages?.data}
                isFetching={isFetching}
                isLoading={isLoading}
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
                  totalPages={packages?.totalPages}
                />
              </div>
              <PaginationInfo
                className="w-full whitespace-nowrap"
                currentPage={currentPage}
                pageSize={pageSize}
                totalElements={packages?.totalElements}
                loading={isLoading || isFetching}
              />
            </div>
          </div>
        </div>
      </div>
      {showDetail === -1 && <PackageDetail mode="create" setShowDetail={setShowDetail} />}
    </>
  )
}

export default Index
