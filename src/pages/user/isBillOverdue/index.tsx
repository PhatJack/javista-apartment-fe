import Overlay from '@/components/overlay/Overlay'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const IsBillOverdue = () => {
  const navigate = useNavigate()

  return (
    <Overlay className="backdrop-blur-sm">
      <div className="w-[500px] p-4 bg-warning rounded-md flex flex-col space-y-2 relative overflow-hidden">
        <p className="text-2xl text-primary font-bold">Bill Overdue</p>
        <p className="text-zinc-500 font-medium">
          Your bill is overdue, please pay your bill to continue using our service
        </p>
        <Button className="w-full" type="button" onClick={() => navigate('/bills')}>
          View Bills
        </Button>
      </div>
    </Overlay>
  )
}

export default IsBillOverdue
