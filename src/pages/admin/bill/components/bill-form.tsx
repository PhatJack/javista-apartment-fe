import { useGetBillQuery } from '@/features/bill/billSlice'
import { Loader } from 'lucide-react'
import BillDetailForm from './components/bill-detail-form'

interface BillFormProps {
  setShowDetail: (id: number | null) => void
  id: number | undefined
}

const BillForm = ({ setShowDetail, id }: BillFormProps) => {
  const { data: bill, isLoading, isFetching } = useGetBillQuery(id)

  return (
    <div className="fixed w-full h-screen flex justify-center items-center inset-0 z-50">
      <div
        className="fixed inset-0 bg-gradient-to-b from-black/20 to-black/60 animate-in fade-in"
        onClick={() => setShowDetail(null)}></div>
      <div className="max-w-sm min-[550px]:max-w-lg w-full h-fit bg-white rounded-md relative z-[51] animate-in fade-in-95 zoom-in-95 shadow-lg">
        {isLoading || isFetching ? (
          <div className="absolute inset-0 size-full flex justify-center items-center bg-white backdrop-blur-sm">
            <Loader className="text-primary animate-spin" size={52} />
          </div>
        ) : (
          <>
            <BillDetailForm bill={bill} setShowDetail={setShowDetail} />
          </>
        )}
      </div>
    </div>
  )
}

export default BillForm
