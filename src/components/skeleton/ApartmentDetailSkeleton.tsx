import { Skeleton } from '../ui/skeleton'

const ApartmentDetailSkeleton = () => {
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <Skeleton className="w-40 h-10" />
      <div className="w-full flex justify- gap-4">
        <div className="w-full flex flex-col gap-4">
          <Skeleton className="w-full h-6" />
          <Skeleton className="w-40 h-10" />
          <Skeleton className="w-full h-6" />
          <Skeleton className="w-40 h-10" />
          <Skeleton className="w-full h-6" />
          <Skeleton className="w-40 h-28" />
          <Skeleton className="w-full h-6" />
          <Skeleton className="w-40 h-10" />
        </div>
        <Skeleton className="w-full h-48" />
      </div>
			<div className="w-full h-full flex items-end justify-end">
				<Skeleton className='w-full h-10' />
			</div>
    </div>
  )
}

export default ApartmentDetailSkeleton
