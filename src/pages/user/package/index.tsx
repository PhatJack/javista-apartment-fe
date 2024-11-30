import { useParams } from 'react-router-dom'
import { useDocumentTitle, useWindowSize } from 'usehooks-ts'
import PackageList from './components/package-list'
import BreadCrumb from '@components/breadcrumb'
import PackageDetail from './components/package-detail'
import { useGetPackagesQuery } from '@/features/package/packageSlice'
import { useAppSelector } from '@/store'
import { useState } from 'react'
import PaginationCustom from '@/components/pagination/PaginationCustom'

const Index = () => {
  useDocumentTitle('Package')
  const [activeFilter, setActiveFilter] = useState('All')
  const filterBar: string[] = ['All', 'Not Collected', 'Collected']
  const user = useAppSelector((state) => state.userReducer.user)
  const params = useParams()
  const { width = 0 } = useWindowSize()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const { data: packages } = useGetPackagesQuery({
    page: currentPage,
    userId: user?.id,
  })

  // Filter packages based on the active filter
  const filteredPackages = packages?.data.filter((pkg) => {
    if (activeFilter === 'All') return true
    if (activeFilter === 'Collected') return pkg.isReceive
    if (activeFilter === 'Not Collected') return !pkg.isReceive
    return true
  })

  return (
    <div className="w-full sm:h-screen flex flex-col bg-zinc-100 overflow-hidden">
      <BreadCrumb
        paths={[
          { label: 'package', to: '/packages' },
          ...(params.id ? [{ label: params.id }] : []),
        ]}
      />
      <div className="w-full h-full p-4 flex gap-4 overflow-hidden">
        <div className="w-full h-full flex flex-col p-4 bg-white rounded-md">
          <div className="w-full h-full overflow-y-auto flex flex-col gap-4">
            {params.id && width < 1024 ? (
              <div className="size-full p-4 bg-white rounded-md lg:flex hidden overflow-hidden flex-col">
                <PackageDetail />
              </div>
            ) : (
              <>
                <div className="w-full h-fit flex flex-col sm:flex-row justify-between items-center sm:gap-0 gap-4">
                  <div className="w-full sm:w-fit rounded-md flex bg-zinc-200 overflow-hidden border">
                    {filterBar.map((item, index) => (
                      <span
                        key={index}
                        onClick={() => setActiveFilter(item)}
                        className={`inline-block w-full text-nowrap text-center font-medium px-4 py-2 transition-all cursor-pointer ${
                          activeFilter === item
                            ? 'bg-primary text-white'
                            : 'bg-transparent hover:bg-primary/20'
                        }`}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <PackageList packages={filteredPackages} />
              </>
            )}
          </div>
          <div className="bg-white p-2">
            <PaginationCustom
              onPageChange={setCurrentPage}
              currentPage={currentPage}
              totalPages={packages?.totalPages}
            />
          </div>
        </div>
        {params.id && width > 1024 && (
          <div className="size-full p-4 bg-white rounded-md lg:flex hidden overflow-hidden flex-col">
            <PackageDetail />
          </div>
        )}
      </div>
    </div>
  )
}

export default Index
