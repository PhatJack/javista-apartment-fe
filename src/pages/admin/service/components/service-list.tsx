import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Service } from '@/schema/service.validate'
import ServiceItem from './service-item'
import TableRowSkeleton from '@/components/skeleton/TableRowSkeleton'

interface ServiceListProps {
  services?: Service[]
  isLoading?: boolean
  isFetching?: boolean
}

const ServiceList = ({ services, isFetching, isLoading }: ServiceListProps) => {
  return (
    <>
      <Table className="relative">
        <TableHeader className='bg-white sticky top-0'>
          <TableRow>
            <TableHead className='w-[5%]'>ID</TableHead>
            <TableHead className='w-[25%]'>Name</TableHead>
            <TableHead className='w-[15%]'>Price</TableHead>
            <TableHead className='w-[15%]'>Last Update</TableHead>
            <TableHead className='w-[25%]'>Description</TableHead>
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
            : services?.map((service, index) => (
                <ServiceItem service={service} key={index} />
              ))}
        </TableBody>
      </Table>
    </>
  )
}

export default ServiceList
