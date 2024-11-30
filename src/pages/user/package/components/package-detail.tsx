import { useGetPackageQuery } from '@/features/package/packageSlice'
import { useParams } from 'react-router-dom'

const PackageDetail = () => {
  const params = useParams()
  const { data: packagee } = useGetPackageQuery({id: parseInt(params.id ?? '0')}, {
    skip: !params.id,
  })

  return (
    <>
      <div className="p-4 size-full">
        <img
          src={typeof packagee?.image === 'string' ? packagee.image : undefined}
          alt="package image"
					loading='lazy'
					className='size-full object-contain'
        />
      </div>
    </>
  )
}

export default PackageDetail
