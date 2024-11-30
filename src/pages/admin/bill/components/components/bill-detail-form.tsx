import AlertDelete from '@/components/alert/AlertDelete'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { BillStatus } from '@/enums'
import { useDeleteBillMutation, useUpdateBillMutation } from '@/features/bill/billSlice'
import { BillSchema, ExtendedBillSchema } from '@/schema/bill.validate'
import { formatISODate } from '@/utils/ExtractTime'
import { formatDateWithSlash } from '@/utils/Generate'
import { Loader } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

interface BillDetailFormProps {
  bill?: z.infer<typeof ExtendedBillSchema>
  setShowDetail: (id: number | null) => void
}

const BillDetailForm = ({ bill, setShowDetail }: BillDetailFormProps) => {
  const form = useForm<z.infer<typeof BillSchema>>()
  const [updateBill, { isLoading }] = useUpdateBillMutation()
  const [deleteBill, { isLoading: isDeleting }] = useDeleteBillMutation()

  useEffect(() => {
    if (bill) {
      form.reset(bill)
    }
  }, [])

  const onSubmit = async (data: z.infer<typeof BillSchema>) => {
    await updateBill({ id: bill?.id, body: { status: data.status } })
      .unwrap()
      .then((payload) => {
        console.log(payload)
        toast.success('Bill updated successfully')
        setShowDetail(null)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const handleDelete = async () => {
    await deleteBill(bill?.id)
      .unwrap()
      .then((payload) => {
        console.log(payload)
        toast.success('Bill deleted successfully')
        setShowDetail(null)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {isLoading && (
          <div className="absolute inset-0 z-10 size-full flex justify-center items-center bg-white/50 backdrop-blur-sm">
            <Loader className="text-primary animate-spin" size={52} />
          </div>
        )}
        <div className="w-full flex justify-between items-center px-4 py-3">
          <div className="flex flex-col">
            <p className="text-3xl font-medium">
              Bill <span className="text-zinc-400">#</span>
              <span className="text-primary">{bill?.id}</span>
            </p>
            <span className="uppercase text-sm font-medium text-zinc-400">water bill</span>
          </div>
        </div>
        <Separator />
        <div className="p-4 w-full flex flex-col space-y-4">
          <div className="w-full flex justify-between items-center">
            <div className="w-full">
              <Label className="text-zinc-400">Issued on:</Label>
              <p className="font-medium">
                {bill?.createdAt && formatISODate(new Date(bill?.createdAt).toISOString())}
              </p>
            </div>
            <div className="w-full">
              <Label className="text-zinc-400">Period:</Label>
              <p className="font-medium">{bill?.monthly}</p>
            </div>
          </div>
          <div className="w-full flex justify-between items-center">
            <div className="w-full ">
              <Label className="text-zinc-400">From:</Label>
              <div className="flex flex-col">
                <span className="font-medium">Jack Phat</span>
                <p className="text-sm text-zinc-400">Zity Apartment Manager</p>
              </div>
            </div>
            <div className="w-full ">
              <Label className="text-zinc-400">To:</Label>
              <div className="flex flex-col">
                <span className="font-medium">{bill?.relationship?.role}</span>
                <p className="text-sm text-zinc-400">Room {bill?.relationship?.apartmentId}</p>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col gap-2">
            <Label className="">Invoice Items:</Label>
            <Table className="font-medium rounded-md">
              <TableHeader className="bg-zinc-100 border">
                <TableRow>
                  <TableHead className="">Description</TableHead>
                  <TableHead>Old Usage</TableHead>
                  <TableHead>New Usage</TableHead>
                  <TableHead className="text-right">Read Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="border">
                <TableRow>
                  <TableCell>Water</TableCell>
                  <TableCell>{bill?.oldWater}</TableCell>
                  <TableCell>{bill?.newWater}</TableCell>
                  <TableCell className="text-right">
                    {bill?.waterReadingDate &&
                      formatDateWithSlash(new Date(bill?.waterReadingDate))}
                  </TableCell>
                </TableRow>
              </TableBody>
              <TableFooter className="border">
                <TableRow>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell className="text-right">
                    VND {bill?.totalPrice.toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-44">
                      <SelectValue placeholder="Choose status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {['UNPAID', 'PAID', 'OVERDUE'].map((status, index) => (
                      <SelectItem key={index} value={status as BillStatus}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Separator />
        <div className="w-full flex justify-between items-center p-4">
          <AlertDelete description="bill" setAction={() => handleDelete()} isLoading={isDeleting} />
          <div className="w-full flex justify-end gap-2">
            <Button onClick={() => setShowDetail(null)} type="button" variant={'ghost'}>
              Cancel
            </Button>
            <Button type="submit" variant={'default'}>
              Save
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default BillDetailForm
