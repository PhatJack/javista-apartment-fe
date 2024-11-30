import { Separator } from '@/components/ui/separator'
import { IPackage } from '@/schema/package.validate'
import { formatDateWithSlash } from '@/utils/Generate'
import { memo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

interface PackageListProps {
  packages?: IPackage[]
}

const PackageList = ({ packages }: PackageListProps) => {
  const navigate = useNavigate()
  const params = useParams()
  return (
    <div className="w-full flex flex-col gap-4 bg-white">
      {packages &&
        packages.map((packagee, index) => (
          <div
            key={index}
            onClick={() => navigate(`/packages/${packagee.id}`)}
            className={`rounded-md w-full flex flex-col border-2 cursor-pointer hover:bg-zinc-50 transition-all ${
              packagee.id === Number(params?.id)
                ? 'bg-zinc-100 border-primary'
                : 'bg-white'
            }`}>
            <div className="w-full flex justify-between p-4">
              <div className="w-full flex flex-col">
                <h1 className="text-lg font-medium">
                  #<span className="text-primary">{packagee.id}</span>
                </h1>
                <div className="w-full grid grid-cols-[100px_auto] text-sm">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="">
                    {formatDateWithSlash(new Date(packagee.createdAt))}
                  </span>
                </div>
                <div className="w-full grid grid-cols-[100px_auto] text-sm">
                  <span className="text-muted-foreground">Description:</span>
                  <span className="">{packagee.description}</span>
                </div>
              </div>
              {packagee.image && (
                <img
                  src={
                    typeof packagee.image === 'string'
                      ? packagee.image
                      : undefined
                  }
                  alt=""
                  className="aspect-square w-32"
                />
              )}
            </div>
            <Separator
              className={`h-0.5 ${
                packagee.id === Number(params?.id) ? 'bg-primary' : 'bg-border'
              }`}
            />
            <div className="w-full flex justify-end py-2 px-4">
              <span className="text-lg text-red-600 font-medium">
                {packagee.isReceive ? 'Collected' : 'Not Collected'}
              </span>
            </div>
          </div>
        ))}
    </div>
  )
}

export default memo(PackageList)
