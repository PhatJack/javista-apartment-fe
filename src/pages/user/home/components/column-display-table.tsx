import { House } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ApartmentFormSchema } from '@/schema/apartment.validate'
import { useLazyGetRelationshipsQuery } from '@/features/relationships/relationshipsSlice'
import { useEffect } from 'react'

interface ColumnDisplayTableProps {
  apartmentData?: ApartmentFormSchema
}

const ColumnDisplayTable = ({ apartmentData }: ColumnDisplayTableProps) => {
  const [getRelationships, { data: relationships }] = useLazyGetRelationshipsQuery()
  const handleGetRelationships = async () => {
    await getRelationships({ apartmentId: apartmentData?.id, page: 1 })
      .unwrap()
      .then((payload) => {
      })
      .catch(() => {})
  }
  useEffect(() => {
    if (apartmentData) {
      handleGetRelationships()
    }
  }, [apartmentData])

  return (
    <div className="size-full flex flex-col space-y-2">
      <p className="flex items-center gap-2 text-lg font-medium uppercase">
        <span>
          <House />
        </span>
        Members List
      </p>
      <Separator />
      <div className="w-full">
        <Table className="w-full border">
          <TableHeader className="bg-primary">
            <TableRow>
              <TableHead className="text-white">No</TableHead>
              <TableHead className="text-white">Fullname</TableHead>
              <TableHead className="text-white">User Type</TableHead>
              <TableHead className="text-white">Phone</TableHead>
              <TableHead className="text-white">Gender</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {relationships?.data.map((relationship, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{relationship.user?.fullName}</TableCell>
                <TableCell>{relationship.role}</TableCell>
                <TableCell>{relationship.user?.phone}</TableCell>
                <TableCell>{relationship.user?.gender}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default ColumnDisplayTable
