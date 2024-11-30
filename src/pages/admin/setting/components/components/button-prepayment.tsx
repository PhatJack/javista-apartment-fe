import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useUpdateTransitionPrepaymentMutation } from '@/features/setting/settingSlice'
import { toast } from 'sonner'

const ButtonPrepayment = () => {
  const [updateStatusPrepayment, { isLoading: isUpdatePrepayment }] =
    useUpdateTransitionPrepaymentMutation()
  const handlePrepaymentTransition = async () => {
    try {
      await updateStatusPrepayment()
        .unwrap()
        .then(() => {
          toast.success('Updated to Prepayment status successfully')
        })
        .catch(() => {
          toast.error('Failed to update status')
        })
    } catch (error) {
      console.error('Failed to update to Prepayment status:', error)
      toast.error('Failed to update status')
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="info">Prepayment</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will change the whole system status to Prepayment.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <>
              <Button
                variant="info"
                onClick={handlePrepaymentTransition}
                disabled={isUpdatePrepayment}>
                {isUpdatePrepayment ? 'Updating...' : 'Continue'}
              </Button>
            </>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ButtonPrepayment
