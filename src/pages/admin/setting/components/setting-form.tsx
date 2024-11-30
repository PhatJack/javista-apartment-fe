import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import {
  usePatchSettingMutation,
  useUpdateTransitionDelinquentMutation,
  useUpdateTransitionOverdueMutation,
  useUpdateTransitionPaymentMutation,
  useUpdateTransitionPrepaymentMutation,
} from '@/features/setting/settingSlice'
import { SettingSchema } from '@/schema/setting.validate'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useDebounceValue } from 'usehooks-ts'
import { z } from 'zod'
import ButtonOverdue from './components/button-overdue'
import ButtonPrepayment from './components/button-prepayment'
import ButtonPayment from './components/button-payment'
import ButtonDelinquent from './components/button-delinquent'
import { zodResolver } from '@hookform/resolvers/zod'

interface SettingFormProps {
  setting?: z.infer<typeof SettingSchema>
  isLoading?: boolean
  isFetching?: boolean
}

const SettingForm = ({ setting, isLoading, isFetching }: SettingFormProps) => {
  const [debounceCurrentMonthly, updateDebounceCurrentValue] = useDebounceValue(
    setting?.currentMonthly,
    700,
  )
  const [patchSetting, { isLoading: isUpdateSetting }] = usePatchSettingMutation()

  const form = useForm<z.infer<typeof SettingSchema>>({
    defaultValues: {
      currentMonthly: setting?.currentMonthly ?? '',
      systemStatus: setting?.systemStatus ?? 'PAYMENT',
      roomPricePerM2: setting?.roomPricePerM2 ?? 0,
      waterPricePerM3: setting?.waterPricePerM3 ?? 0,
      waterVat: setting?.waterVat ?? 0,
      envProtectionTax: setting?.envProtectionTax ?? 0,
    },
  })

  const onSubmit = async (data: z.infer<typeof SettingSchema>) => {
    // console.log(data)
    await patchSetting(data)
      .unwrap()
      .then((payload) => {
        console.log(payload)
        toast.success('Update setting successfully')
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const onSubmitMonthly = async (data: Pick<z.infer<typeof SettingSchema>, 'currentMonthly'>) => {
    await patchSetting(data)
      .unwrap()
      .then((payload) => {
        console.log(payload)
        toast.success('Update setting successfully')
      })
      .catch((error) => {
        console.log(error)
      })
  }
  useEffect(() => {
    if (setting) {
      form.reset(setting)
    }
  }, [setting])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-0 h-full overflow-hidden flex space-x-4">
        <div className="md:w-1/2 w-full flex flex-col space-y-4">
          {isLoading || isFetching ? (
            <>
              <Skeleton className="w-full h-[144px]" />
              <Skeleton className="w-full h-[358px]" />
            </>
          ) : (
            <>
              <div className="border border-zinc-300 p-4 rounded-md flex flex-col space-y-3 shadow-md">
                <Label>Current Monthly</Label>
                <Input
                  type="month"
                  defaultValue={setting?.currentMonthly}
                  onChange={(e) => updateDebounceCurrentValue(e.target.value)}
                />
                <Button
                  type="button"
                  onClick={() => onSubmitMonthly({ currentMonthly: debounceCurrentMonthly })}
                  className="w-fit">
                  {isUpdateSetting ? 'Loading...' : 'Submit'}
                </Button>
              </div>
              <div className="border border-zinc-300 p-4 rounded-md shadow-md">
                <FormField
                  control={form.control}
                  name="roomPricePerM2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Price Per M2</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step={1000}
                          {...field}
                          placeholder="Enter room price per m2"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="waterPricePerM3"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Water Price Per M3</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step={1000}
                          {...field}
                          placeholder="Enter water price per m3"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="waterVat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Water VAT (%)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter water VAT" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="envProtectionTax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Environment Protection Tax (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          placeholder="Enter environment protection tax"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="pt-4">
                  <Button type="submit" className="">
                    {isUpdateSetting ? 'Loading...' : 'Submit'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="md:w-1/2 w-full">
          {isLoading || isFetching ? (
            <Skeleton className="w-full h-[140px]" />
          ) : (
            <div className="flex flex-col space-y-4 p-4 border border-zinc-300 rounded-md h-fit shadow-md">
              <Label>System Status</Label>
              <div className="flex gap-4">
                <ButtonPrepayment />
                <ButtonPayment />
                <ButtonOverdue />
                <ButtonDelinquent />
              </div>
              <div className="flex gap-4">
                <p className="font-medium">Current System Status:</p>
                <Badge
                  variant={`${
                    setting?.systemStatus === 'DELINQUENT'
                      ? 'destructive'
                      : setting?.systemStatus === 'OVERDUE'
                      ? 'warning'
                      : setting?.systemStatus === 'PAYMENT'
                      ? 'success'
                      : 'info'
                  }`}>
                  {setting?.systemStatus}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </form>
    </Form>
  )
}

export default SettingForm
