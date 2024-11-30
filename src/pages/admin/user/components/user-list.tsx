import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import UserDetail from './user-detail'
import { useState } from 'react'
import { User } from '@/schema/user.validate'
import UserItem from './user-item'
import TableRowSkeleton from '@/components/skeleton/TableRowSkeleton'

interface UserListProps {
  users?: User[]
  isLoading?: boolean
  isFetching?: boolean
}

const UserList = ({ users, isLoading, isFetching }: UserListProps) => {
  const [showDetail, setShowDetail] = useState<number | string | null>(null)

  return (
    <>
      <Table className="relative">
        <TableHeader className='sticky top-0 bg-white '>
          <TableRow>
            <TableHead className="w-[5%]">ID</TableHead>
            <TableHead className="w-[50%]">Full Name</TableHead>
            <TableHead className='w-[15%]'>Phone</TableHead>
            <TableHead className='w-[15%]'>Account Type</TableHead>
            <TableHead className='w-[15%]'>Is Staying</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading || isFetching
            ? Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index} className="">
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                </TableRow>
              ))
            : users &&
              users.map((user,index) => (
                <UserItem user={user} setShowDetail={setShowDetail} key={index} />
              ))}
        </TableBody>
      </Table>
      {showDetail && (
        <UserDetail showDetail={showDetail} setShowDetail={setShowDetail} />
      )}
    </>
  )
}

export default UserList
