import { Button } from '@/components/ui/button'
import { useNotifyReceivedPackageMutation } from '@/features/user/userSlice'
import { toast } from 'sonner'

interface PackageReceivedPackageProps {
  packageId?: number
}

const PackageReceivedPackage = ({ packageId }: PackageReceivedPackageProps) => {
  const [notifyReceivedPackage, { isLoading: isNotifying }] = useNotifyReceivedPackageMutation()

  const handleNotifyReceivedPackage = async () => {
    await notifyReceivedPackage({ id: packageId })
      .unwrap()
      .then(() => {
        toast.success('Notify user to receive package successfully')
      })
      .catch(() => {
        toast.error('Notify user to receive package failed')
      })
  }

  return (
    <Button type="button" variant={'info'} onClick={handleNotifyReceivedPackage}>
      {isNotifying ? 'Sending...' : 'Send SMS'}
    </Button>
  )
}

export default PackageReceivedPackage
