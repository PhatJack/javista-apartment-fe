import { TableCell } from '../ui/table'

const TableRowSkeleton = () => {
  return (
    <TableCell>
      <p className="h-9 w-full bg-gray-100 animate-pulse"></p>
    </TableCell>
  )
}

export default TableRowSkeleton
