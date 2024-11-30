import BreadCrumb from '@/components/breadcrumb'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Filter, Search } from 'lucide-react'
import UserList from './components/user-list'
import { useDebounceCallback, useDocumentTitle } from 'usehooks-ts'
import UserForm from './components/user-form'
import { useGetUsersQuery } from '@/features/user/userSlice'
import { useState } from 'react'
import PaginationCustom from '@/components/pagination/PaginationCustom'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import PageSizeSelector from '@/components/table/page-size-selector'
import PaginationInfo from '@/components/table/page-info'

const Index = () => {
  useDocumentTitle('User')
  const [openUserForm, setOpenUserForm] = useState<boolean>(false)
  const [pageSize, setPageSize] = useState<number>(10)
  const [searchValue, setSearchValue] = useState<string>('')
  const [filterType, setFilterType] = useState<string>('username') // Default filter
  const [advancedSearch, setAdvancedSearch] = useState<boolean>(false)
  const handleSearch = useDebounceCallback((value: string) => {
    setSearchValue(value)
    if (value) {
      setCurrentPage(1)
    }
  }, 500)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const {
    data: users,
    isLoading,
    isFetching,
  } = useGetUsersQuery({
    page: currentPage,
    [filterType]: searchValue,
    pageSize: pageSize,
  })
  return (
    <>
      <div className="w-full h-full lg:h-screen flex flex-col bg-zinc-100 overflow-hidden">
        <BreadCrumb paths={[{ label: 'user', to: '/user' }]} />
        <div className="size-full p-4 overflow-hidden">
          <div className="size-full p-4 bg-white rounded-md flex flex-col space-y-2 overflow-hidden">
            <div className="w-full h-auto flex lg:flex-row flex-col gap-4 justify-between items-center">
              <div className="w-full flex gap-4 items-center">
                <div className="w-full lg:w-[40%] xl:w-1/4 flex items-center border px-3 py-0.5 relative rounded-md focus-within:border-primary transition-all">
                  <Search size={22} />
                  <Input
                    placeholder="Search something"
                    className="border-none shadow-none focus-visible:ring-0"
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                <Select value={filterType} onValueChange={(value) => setFilterType(value)}>
                  <SelectTrigger className="w-[130px] h-10">
                    <SelectValue placeholder="Select filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="username">User name</SelectItem>
                      <SelectItem value="fullName">Full name</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={() => setAdvancedSearch(!advancedSearch)}
                type="button"
                className={`w-full lg:w-fit gap-1`}
                size={'lg'}
                variant={`${advancedSearch ? 'default' : 'secondary'}`}>
                <Filter size={20} />
                Filter
              </Button>
              <Button type="button" onClick={() => setOpenUserForm(true)}>
                Create New User
              </Button>
            </div>
            <div className="size-full overflow-y-auto">
              <UserList users={users?.data} isFetching={isFetching} isLoading={isLoading} />
            </div>
            <div className="w-full flex justify-between items-center">
              <PageSizeSelector
                className="w-full"
                pageSize={pageSize}
                setCurrentPage={setCurrentPage}
                onPageSizeChange={setPageSize}
              />
              <div className="w-full">
                <PaginationCustom
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  totalPages={users?.totalPages}
                />
              </div>
              <PaginationInfo
                className="w-full whitespace-nowrap"
                currentPage={currentPage}
                pageSize={pageSize}
                totalElements={users?.totalElements}
                loading={isLoading || isFetching}
              />
            </div>
          </div>
        </div>
      </div>
      {openUserForm && <UserForm open={openUserForm} onClose={() => setOpenUserForm(false)} />}
    </>
  )
}

export default Index
