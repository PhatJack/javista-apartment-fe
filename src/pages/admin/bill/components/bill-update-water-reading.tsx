import Overlay from '@/components/overlay/Overlay'
import { Separator } from '@/components/ui/separator'
import { useLazyGetBillsQuery } from '@/features/bill/billSlice'
import { X } from 'lucide-react'
import BillUpdateWaterReadingForm from './components/bill-update-water-reading-form'
import { useGetSettingsQuery } from '@/features/setting/settingSlice'
import { useEffect, useState } from 'react'
import { IBill } from '@/schema/bill.validate'

interface BillUpdateWaterReadingProps {
  setIsOpenWaterReading: (value: boolean) => void
}

const BillUpdateWaterReading = ({ setIsOpenWaterReading }: BillUpdateWaterReadingProps) => {
  const [bills, setBills] = useState<IBill[]>([])
  const {
    data: setting,
    isLoading: isLoadingSetting,
    isFetching: isFetchingSetting,
    isSuccess,
  } = useGetSettingsQuery()

  const [getBills] = useLazyGetBillsQuery()

  const handleGetBill = async () => {
    await getBills({
      page: 1,
      pageSize: 80,
      includes: ['Relationship'],
      monthly: setting?.currentMonthly,
    })
      .unwrap()
      .then((res) => {
        setBills(res.data)
      })
      .catch((err) => {})
  }

  useEffect(() => {
    if (isSuccess) {
      handleGetBill()
    }
  }, [isSuccess])

  return (
    <Overlay>
      <div className="md:max-w-3xl md:min-w-[600px] max-h-[600px] bg-white rounded-md flex flex-col overflow-hidden">
        <div className="w-full flex justify-between items-center p-4">
          <p className="font-medium">Update Water Reading</p>
          <X className="cursor-pointer" onClick={() => setIsOpenWaterReading(false)} />
        </div>
        <Separator />
        <div className="size-full px-4 py-2 flex flex-col overflow-hidden">
          <BillUpdateWaterReadingForm bills={bills} setIsOpenWaterReading={setIsOpenWaterReading} />
        </div>
      </div>
    </Overlay>
  )
}

export default BillUpdateWaterReading
