import ApartmentDetailSkeleton from '@/components/skeleton/ApartmentDetailSkeleton'
import { Button } from '@/components/ui/button'
import { useGetApartmentQuery } from '@/features/apartment/apartmentSlice'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ApartmentDetailForm from './components/apartment-detail-form'

interface IApartmentDetailProps {
  id: string
}

const ApartmentDetail = ({ id }: IApartmentDetailProps) => {
  const navigate = useNavigate()
  const { data, isLoading, isFetching } = useGetApartmentQuery(
    { id: id, includes: 'relationships.User' },
    {
      skip: !id,
    },
  )
  return (
    <div className="w-full h-full flex flex-col gap-4 relative">
      {isLoading || isFetching ? (
        <ApartmentDetailSkeleton />
      ) : (
        <>
          <div className="flex items-center">
            <Button onClick={() => navigate('/admin/apartments')} size={'icon'} variant={'ghost'}>
              <ChevronLeft />
            </Button>
            <h1 className="text-xl font-medium">{data?.id}</h1>
          </div>
          <ApartmentDetailForm apartment={data} />
        </>
      )}
    </div>
  )
}

export default ApartmentDetail
