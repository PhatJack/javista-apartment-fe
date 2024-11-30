import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DateTimePicker } from '@/components/ui/datetime-picker'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useUpdateWaterReadingsMutation } from '@/features/bill/billSlice'
import { IBill, UpdateWaterReadingListSchema } from '@/schema/bill.validate'
import { memo } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

interface BillUpdateWaterReadingFormProps {
  bills?: IBill[]
  setIsOpenWaterReading: (value: boolean) => void
}

const BillUpdateWaterReadingForm = ({
  bills,
  setIsOpenWaterReading,
}: BillUpdateWaterReadingFormProps) => {
  const [updateWaterReadings, { isLoading }] = useUpdateWaterReadingsMutation()

  const form = useForm<z.infer<typeof UpdateWaterReadingListSchema>>({
    defaultValues: {
      waterReadings: [],
    },
  })

  const onSubmit = async (data: z.infer<typeof UpdateWaterReadingListSchema>) => {
    const filteredData = data.waterReadings.filter(
      (item) => (item.newWaterIndex || item.newWaterIndex != 0) && item.readingDate,
    )
    // const checkValidReadingDate = filteredData.every(
    //   (item) => item.readingDate && item.readingDate > new Date(),
    // )
    // if (!checkValidReadingDate) {
    //   toast.error('Reading date must be in the future')
    //   return
    // }
    await updateWaterReadings({ body: { waterReadings: filteredData } })
      .unwrap()
      .then(() => {
        toast.success('Update water reading successfully')
        setIsOpenWaterReading(false)
      })
      .catch(() => {
        toast.error('Update water reading failed')
      })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="size-full flex flex-col space-y-2 overflow-hidden">
        <div className="size-full overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[10%]">ID</TableHead>
                <TableHead className="w-[20%]">Apartment</TableHead>
                <TableHead className="w-[35%]">New Water Index</TableHead>
                <TableHead className="w-[35%]">Reading Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bills?.filter(bill => bill.newWater === null).map((bill, index) => (
                <TableRow key={bill.id}>
                  <TableCell>
                    <FormField
                      name={`waterReadings.${index}.billId`}
                      control={form.control}
                      defaultValue={bill.id}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              value={bill.id}
                              readOnly
                              className="border-none shadow-none cursor-default p-0"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <Badge variant={'info'}>{bill.relationship?.apartmentId}</Badge>
                  </TableCell>
                  <TableCell>
                    <FormField
                      name={`waterReadings.${index}.newWaterIndex`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              value={field.value || ''}
                              onChange={(event) => field.onChange(+event.target.value)}
                              placeholder="Enter new water usage"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      name={`waterReadings.${index}.readingDate`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <DateTimePicker
                              {...field}
                              value={field.value || undefined}
                              onChange={(date) => field.onChange(date)}
                              placeholder="Pick a date"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Separator />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </form>
    </Form>
  )
}

export default memo(BillUpdateWaterReadingForm)
