import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { IBill } from '@/schema/bill.validate'
import BillItem from './bill-item'
import BillForm from './bill-form'
import { useState } from 'react'
import TableRowSkeleton from '@/components/skeleton/TableRowSkeleton'

interface BillListProps {
  bills?: IBill[]
  isLoading?: boolean
  isFetching?: boolean
}

const BillList = ({ bills, isFetching, isLoading }: BillListProps) => {
  const [showDetail, setShowDetail] = useState<number | null>(null)

  return (
    <>
      <Table className="relative">
        <TableHeader className="bg-white sticky top-0">
          <TableRow>
            <TableHead className="w-[5%]">ID</TableHead>
            <TableHead>ApartmentId</TableHead>
            <TableHead>Monthly</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>
              Old Water(m<sup>3</sup>)
            </TableHead>
            <TableHead>
              New Water(m<sup>3</sup>)
            </TableHead>
            <TableHead>Water Read Date</TableHead>
            <TableHead>Status</TableHead>
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
                </TableRow>
              ))
            : bills &&
              bills.map((bill, index) => (
                <BillItem bill={bill} key={index} setShowDetail={setShowDetail} />
              ))}
        </TableBody>
      </Table>
      {showDetail && <BillForm setShowDetail={setShowDetail} id={showDetail} />}
    </>
  )
}

export default BillList
