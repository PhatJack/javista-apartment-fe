import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import ApartmentDetailAddPeople from './apartment-detail-add-people'
import { useGetRelationshipsQuery } from '@/features/relationships/relationshipsSlice'

interface IApartmentUserTableProps {
  apartmentId?: string
}

const ApartmentUserTable = ({ apartmentId }: IApartmentUserTableProps) => {
  const { data: relationships } = useGetRelationshipsQuery({
    page: 1,
    pageSize: 30,
    apartmentId: apartmentId,
    includes: ['user'],
  })
  const [addPeople, setAddPeople] = useState<boolean>(false)
  const handleAddPeople = () => {
    setAddPeople(true)
  }
	
  return (
    <>
      <Table className="w-full border">
        <TableHeader className="bg-primary">
          <TableRow className="[&>th]:text-black">
            <TableHead>ID</TableHead>
            <TableHead>Fullname</TableHead>
            <TableHead>User Type</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Phone</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {relationships &&
            [...relationships.data]
              .sort((a, b) => (a.role === 'OWNER' ? -1 : b.role === 'OWNER' ? 1 : 0)) // Ensure "OWNER" comes first
              .map((relationship, index) => (
                <TableRow key={index}>
                  <TableCell>{relationship.user?.id}</TableCell>
                  <TableCell>{relationship.user?.fullName}</TableCell>
                  <TableCell
                    className={`${
                      relationship.role === 'OWNER' ? 'font-semibold text-primary' : ''
                    }`}>
                    {relationship.role}
                  </TableCell>
                  <TableCell>{relationship.user?.gender}</TableCell>
                  <TableCell>{relationship.user?.phone}</TableCell>
                </TableRow>
              ))}
          <TableRow className="cursor-pointer hover:bg-gray-50 bg-gray-200">
            <TableCell colSpan={5} className="text-center text-gray-700">
              <div onClick={handleAddPeople} className="flex items-center justify-center gap-2">
                <Plus size={16} />
                <span>Add people</span>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      {addPeople && (
        <ApartmentDetailAddPeople
          relationships={relationships?.data}
          setAddPeople={setAddPeople}
          apartmentId={apartmentId}
        />
      )}
    </>
  )
}

export default ApartmentUserTable
