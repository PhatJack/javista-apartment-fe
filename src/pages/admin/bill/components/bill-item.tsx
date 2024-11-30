import { Badge } from '@/components/ui/badge'
import { TableCell, TableRow } from '@/components/ui/table'
import { IBill } from '@/schema/bill.validate'
import { memo } from 'react'

interface BillItemProps {
  bill: IBill
  setShowDetail: (value: number | null) => void
}

const BillItem = ({ bill, setShowDetail }: BillItemProps) => {
  return (
    <TableRow onClick={() => setShowDetail(bill.id)} className="font-medium cursor-pointer">
      <TableCell className="py-3">{bill.id}</TableCell>
      <TableCell>{bill.relationship?.apartmentId}</TableCell>
      <TableCell>{bill.monthly}</TableCell>
      <TableCell>{bill.totalPrice.toLocaleString()}</TableCell>
      <TableCell>{bill.oldWater}</TableCell>
      <TableCell>{bill.newWater}</TableCell>
      <TableCell>
        {bill.waterReadingDate && new Date(bill.waterReadingDate).toLocaleDateString()}
      </TableCell>
      <TableCell className="uppercase">
        <Badge
          variant={`${
            bill.status == 'UNPAID' ? 'warning' : bill.status == 'OVERDUE' ? 'error' : 'info'
          }`}>
          {bill.status}
        </Badge>
      </TableCell>
    </TableRow>
  )
}

export default memo(BillItem)
