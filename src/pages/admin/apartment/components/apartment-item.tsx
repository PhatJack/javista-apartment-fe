import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ApartmentFormSchema } from '@/schema/apartment.validate'
import { useNavigate } from 'react-router-dom'

interface ApartmentItemProps {
  apartment: ApartmentFormSchema
}

const ApartmentItem = ({ apartment }: ApartmentItemProps) => {
  const navigate = useNavigate()

  return (
    <div className="p-4 min-w-full sm:min-w-[300px] flex flex-col gap-2 bg-white rounded-lg border">
      <div className="w-full h-full grid grid-cols-2">
        <span className="text-lg font-medium">{apartment.id}</span>
        <Button
          variant="default"
          size="sm"
          onClick={() => {
            navigate(`${apartment.id}`)
          }}
          className="w-fit place-self-end">
          Details
        </Button>
      </div>
      <div className="w-full h-full grid grid-cols-2">
        <span className="text-sm font-medium">Status</span>
        <Badge
          className="w-fit place-self-end uppercase"
          variant={`${
            apartment.status === 'IN_USE'
              ? 'success'
              : apartment.status === 'DISRUPTION'
              ? 'error'
              : 'info'
          }`}>
          {apartment.status}
        </Badge>
      </div>
			<div className="w-full h-full grid grid-cols-2">
        <span className="text-sm font-medium">Status</span>
        <Badge
          className="w-fit place-self-end uppercase"
          variant={`outline`}>
          {apartment.area}
        </Badge>
      </div>
    </div>
  )
}

export default ApartmentItem
