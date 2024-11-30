import { Input } from '@/components/ui/input'
import { Droplets, Filter, Search } from 'lucide-react'
import { Button } from '@components/ui/button'
import BillList from './components/bill-list'
import { useDocumentTitle } from 'usehooks-ts'
import BreadCrumb from '@/components/breadcrumb'
import { useGetBillsQuery } from '@/features/bill/billSlice'
import { useState } from 'react'
import PaginationCustom from '@/components/pagination/PaginationCustom'
import PageSizeSelector from '@/components/table/page-size-selector'
import PaginationInfo from '@/components/table/page-info'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import BillUpdateWaterReading from './components/bill-update-water-reading'
import FilterPanel, { FilterValues } from './components/bill-filter-panel'
const Index = () => {
  useDocumentTitle('Bill')
  const [isOpenWaterReading, setIsOpenWaterReading] = useState<boolean>(false)
  const [pageSize, setPageSize] = useState<number>(10)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)
  const [filters, setFilters] = useState<FilterValues>({
    id: undefined,
    monthly: undefined,
    status: undefined,
  })
  const {
    data: bills,
    isLoading,
    isFetching,
  } = useGetBillsQuery({
    page: currentPage,
    pageSize: pageSize,
    ...(filters.id !== null ? { id: filters.id } : {}),
    ...(filters.monthly ? { monthly: filters.monthly } : {}),
    ...(filters.status ? { status: filters.status } : {}),
  })

  const handleApplyFilters = (newFilters: FilterValues) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const activeFilterCount = Object.values(filters).filter(Boolean).length

  return (
    <>
      <div className="w-full sm:h-screen flex flex-col bg-zinc-100">
        <BreadCrumb paths={[{ label: 'bill', to: '/bill' }]} />
        <div className="size-full p-4 overflow-hidden">
          <div className="size-full p-4 bg-white rounded-md flex flex-col space-y-2">
            <div className="w-full flex flex-col space-y-2">
              <div className="w-full h-auto flex justify-between items-center">
                <div className="w-full flex gap-4 items-center">
                  <Button
                    className={`${isFilterOpen ? 'bg-primary' : ''}`}
                    size={'lg'}
                    variant={'secondary'}
                    onClick={() => setIsFilterOpen(!isFilterOpen)}>
                    <Filter size={20} />
                    Filter
                    {activeFilterCount > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        onClick={() => setIsOpenWaterReading(true)}
                        size={'icon'}
                        variant={'outline'}>
                        <Droplets size={20} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Update water reading</TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <FilterPanel isOpen={isFilterOpen} onApplyFilters={handleApplyFilters} />
            </div>
            <div className="size-full overflow-y-auto">
              <BillList bills={bills?.data} isFetching={isFetching} isLoading={isLoading} />
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
                  totalPages={bills?.totalPages}
                />
              </div>
              <PaginationInfo
                className="w-full whitespace-nowrap"
                currentPage={currentPage}
                pageSize={pageSize}
                totalElements={bills?.totalElements}
                loading={isLoading || isFetching}
              />
            </div>
          </div>
        </div>
      </div>
      {isOpenWaterReading && (
        <BillUpdateWaterReading setIsOpenWaterReading={setIsOpenWaterReading} />
      )}
    </>
  )
}

export default Index
