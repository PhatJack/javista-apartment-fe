import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { IPackage } from '@/schema/package.validate'
import { Eye } from 'lucide-react'
import AlertDelete from '@/components/alert/AlertDelete'
import { Button } from '@/components/ui/button'
import TableRowSkeleton from '@/components/skeleton/TableRowSkeleton'
import PackageDetail from './package-detail'
import { formatDateWithSlash } from '@/utils/Generate'
import { useState } from 'react'
import { useDeletePackageMutation } from '@/features/package/packageSlice'
import { toast } from 'sonner'

interface PackageListProps {
  packages?: IPackage[]
  isLoading?: boolean
  isFetching?: boolean
}

const PackageList = ({ packages, isLoading, isFetching }: PackageListProps) => {
  const [showDetail, setShowDetail] = useState<number | undefined>(undefined)

  const [deletePackage, { isLoading: isDeleting }] = useDeletePackageMutation()

  const handleDeletePackage = async (id?: number) => {
    await deletePackage({ id: id })
      .unwrap()
      .then(() => {
        toast.success('Delete package successfully')
      })
      .catch(() => {
        toast.error('Delete package failed')
      })
  }

  return (
    <>
      <Table className="relative">
        <TableHeader className="bg-white sticky top-0">
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Shipping to</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Delivery Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(isLoading || isFetching) &&
            Array.from({ length: 10 }).map((_, index) => (
              <TableRow key={index} className="">
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
              </TableRow>
            ))}
          {packages &&
            packages.map((packagee, index) => (
              <TableRow key={index} className="font-medium cursor-pointer">
                <TableCell className="w-[5%] py-3">{packagee.id}</TableCell>
                <TableCell className="w-[25%]">{packagee.user?.fullName}</TableCell>
                <TableCell className="w-[10%]">{packagee.user?.phone}</TableCell>
                <TableCell className="w-[10%]">
                  {formatDateWithSlash(new Date(packagee.createdAt))}
                </TableCell>
                <TableCell className="w-[10%] uppercase">
                  <Badge variant={`${packagee.isReceive ? 'success' : 'error'}`}>
                    {packagee.isReceive ? 'Collected' : 'Not Collected'}
                  </Badge>
                </TableCell>
                <TableCell className="w-[25%]">{packagee.description}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => {
                      setShowDetail(packagee.id)
                    }}
                    type="button"
                    size={'icon'}
                    variant={'ghost'}>
                    <Eye />
                  </Button>
                </TableCell>
                <TableCell>
                  <AlertDelete
                    description="package"
                    isLoading={isDeleting}
                    setAction={() => handleDeletePackage(packagee.id)}
                    type="icon"
                    variants="ghost"
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {showDetail && <PackageDetail id={showDetail} mode="edit" setShowDetail={setShowDetail} />}
    </>
  )
}

export default PackageList
