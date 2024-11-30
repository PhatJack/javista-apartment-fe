import { ApartmentFormSchema } from '@/schema/apartment.validate'
import { User } from '@/schema/user.validate'
import { Separator } from '@radix-ui/react-separator'
import { LayoutPanelTop } from 'lucide-react'

interface ColumnDisplayInformationProps {
  user?: User
  apartmentData?: ApartmentFormSchema
  selectedHouse: string
}

const ColumnDisplayInformation = ({
  user,
  apartmentData,
  selectedHouse,
}: ColumnDisplayInformationProps) => {
  return (
    <div className="size-full flex flex-col space-y-2">
      <p className="flex items-center gap-2 text-lg font-medium uppercase">
        <span>
          <LayoutPanelTop />
        </span>
        Apartment <span className="text-primary">{selectedHouse}</span>
      </p>
      <Separator />
      <p>
        <span className="font-medium">Floor:</span> {apartmentData?.floorNumber}
      </p>
      <p>
        <span className="font-medium">Owner:</span> {user ? user?.fullName : 'loading...'}
      </p>
      <p>
        <span className="font-medium">Area:</span> {apartmentData?.area}x{apartmentData?.area} (m
        <sup>2</sup>)
      </p>
      <p>
        <span className="font-medium">Description: </span>
        {apartmentData?.description}
      </p>
    </div>
  )
}

export default ColumnDisplayInformation
