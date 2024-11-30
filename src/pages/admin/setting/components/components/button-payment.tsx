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
import { useUpdateTransitionPaymentMutation } from '@/features/setting/settingSlice'
import { toast } from 'sonner'

const ButtonPayment = () => {
  const [updateStatusPayment, { isLoading: isUpdatePayment }] = useUpdateTransitionPaymentMutation()
  const handlePaymentTransition = async () => {
    try {
      await updateStatusPayment()
        .unwrap()
        .then(() => {
          toast.success('Updated to Payment status successfully')
        })
        .catch((error: any) => {
          console.error('Failed to update to Payment status:', error)
          toast.error(error.data.message)
        })
    } catch (error) {
      console.error('Failed to update to Payment status:', error)
      toast.error('Failed to update status')
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="success">Payment</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will change the whole system status to Payment
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <>
              <Button
                variant="success"
                onClick={handlePaymentTransition}
                disabled={isUpdatePayment}>
                {isUpdatePayment ? 'Updating...' : 'Continue'}
              </Button>
            </>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ButtonPayment
