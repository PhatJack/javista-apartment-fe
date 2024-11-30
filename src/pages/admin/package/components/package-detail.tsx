import { Separator } from '@/components/ui/separator'
import { Loader, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useGetPackageQuery } from '@/features/package/packageSlice'
import PackageForm from './package-form'
import Overlay from '@/components/overlay/Overlay'
import { Button } from '@/components/ui/button'
import { useGetUserByIdQuery, useLazyGetUserByIdQuery } from '@/features/user/userSlice'

interface PackageDetailProps {
  id?: number
  mode: 'create' | 'edit'
  setShowDetail: (value: number | undefined) => void
}

const PackageDetail = ({ id, mode, setShowDetail }: PackageDetailProps) => {
  const [open, setOpen] = useState<boolean>(false)
  const [getUser, { data }] = useLazyGetUserByIdQuery()
  const {
    data: packagee,
    isLoading,
    isFetching,
  } = useGetPackageQuery(
    { id: id },
    {
      skip: mode === 'create' || !id,
    },
  )

  const dialogTitle =
    mode === 'edit' ? (
      <>
        Package #<span className="text-primary">{packagee?.id}</span>
      </>
    ) : (
      'New Package'
    )

  return (
    <Overlay>
      <div className="max-w-sm lg:max-w-lg xl:max-w-xl w-full flex flex-col space-y-2 bg-white rounded-md">
        <div className="w-full flex justify-between items-center px-6 pt-4">
          <div className="text-lg font-medium">{dialogTitle}</div>
          <Button
            type="button"
            onClick={() => setShowDetail(undefined)}
            variant={'ghost'}
            size={'icon'}>
            <X />
          </Button>
        </div>
        <Separator />
        <div className="size-full p-4">
          {isLoading || isFetching ? (
            <div className="size-full flex justify-center items-center">
              <Loader size={40} className="animate-spin text-primary" />
            </div>
          ) : (
            <PackageForm packagee={packagee} setOpen={setShowDetail} />
          )}
        </div>
      </div>
    </Overlay>
  )
}

export default PackageDetail
