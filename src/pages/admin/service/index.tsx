import { Input } from '@/components/ui/input'
import { Filter, Search } from 'lucide-react'
import { Button } from '@components/ui/button'
import ServiceList from './components/service-list'
import BreadCrumb from '@/components/breadcrumb'
import { useDebounceCallback, useDocumentTitle } from 'usehooks-ts'
import { useGetServicesQuery } from '@/features/service/serviceSlice'
import { useState } from 'react'
import PaginationCustom from '@/components/pagination/PaginationCustom'
import ServiceDetail from './components/service-detail'
import PageSizeSelector from '@/components/table/page-size-selector'
import PaginationInfo from '@/components/table/page-info'

const Index = () => {
  const [pageSize, setPageSize] = useState<number>(10)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchByName, setSearchByName] = useState<string>('')
  const handleSearch = useDebounceCallback((value: string) => {
    setSearchByName(value)
    if (value) {
      setCurrentPage(1)
    }
  }, 500)
  const {
    data: services,
    isLoading,
    isFetching,
  } = useGetServicesQuery({
    page: currentPage,
    name: searchByName,
    pageSize: pageSize,
  })
  useDocumentTitle('Service')

  return (
    <>
      <div className="w-full sm:h-screen flex flex-col bg-zinc-100">
        <BreadCrumb paths={[{ label: 'service', to: '/service' }]} />
        <div className="size-full p-4 overflow-hidden">
          <div className="size-full p-4 bg-white rounded-md flex flex-col space-y-2">
            <div className="w-full h-auto flex lg:flex-row flex-col gap-4 justify-between items-center">
              <div className="w-full flex gap-4 items-center">
                <div className="lg:w-1/4 w-full flex items-center border px-3 py-0.5 relative rounded-md focus-within:border-primary transition-all">
                  <Search size={20} />
                  <Input
                    placeholder="Search something"
                    className="border-none shadow-none focus-visible:ring-0"
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                <Button className="gap-1" size={'lg'} variant={'secondary'}>
                  <Filter size={20} />
                  Filter
                </Button>
              </div>
              <ServiceDetail mode="create" />
            </div>
            <div className="size-full overflow-y-auto">
              <ServiceList
                services={services?.data}
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
                  totalPages={services?.totalPages}
                />
              </div>
              <PaginationInfo
                className="w-full whitespace-nowrap"
                currentPage={currentPage}
                pageSize={pageSize}
                totalElements={services?.totalElements}
                loading={isLoading || isFetching}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Index
