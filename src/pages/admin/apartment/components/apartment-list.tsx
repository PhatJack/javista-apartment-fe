import { ApartmentFormSchema } from '@/schema/apartment.validate'
import { splitByKey } from '@/utils/Split'
import ApartmentItem from './apartment-item'
interface ApartmentListProps {
  apartments?: ApartmentFormSchema[]
}

const ApartmentList = ({ apartments }: ApartmentListProps) => {
  const finalApartmentsResult = splitByKey('floorNumber', apartments)
  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-y-auto">
      {finalApartmentsResult.map((item, index) => (
        <div key={index} className="w-full p-4 border rounded-md bg-zinc-100">
          <h1 className="text-xl font-bold">Floor {item.floorNumber}</h1>
          <div className="w-full flex mt-4 gap-4 overflow-x-auto">
            {item.items.map((apartment, index) => (
              <ApartmentItem apartment={apartment} key={index} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ApartmentList
