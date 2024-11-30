import { Skeleton } from '../ui/skeleton'

const ApartmentSkeleton = () => {
  return (
    <Skeleton className="w-full h-48 p-4 flex flex-col gap-4">
      <Skeleton className="w-40 h-10 bg-zinc-200" />
      <div className="w-full flex gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="p-4 min-w-full sm:min-w-[300px] flex flex-col gap-2 bg-white rounded-lg border">
            <Skeleton className="w-20 h-6" />
            <Skeleton className="w-20 h-6" />
            <Skeleton className="w-20 h-6" />
          </div>
        ))}
      </div>
    </Skeleton>
  )
}

export default ApartmentSkeleton
