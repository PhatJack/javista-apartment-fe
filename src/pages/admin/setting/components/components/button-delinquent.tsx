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
import { useUpdateTransitionDelinquentMutation } from '@/features/setting/settingSlice'
import { toast } from 'sonner'

const ButtonDelinquent = () => {
  const [updateStatusDelinquent, { isLoading: isUpdateDelinquent }] =
    useUpdateTransitionDelinquentMutation()
  const handleDelinquentTransition = async () => {
    try {
      await updateStatusDelinquent()
        .unwrap()
        .then(() => {
          toast.success('Updated to Delinquent status successfully')
        })
        .catch(() => {
          toast.error('Failed to update status')
        })
    } catch (error) {
      console.error('Failed to update to Delinquent status:', error)
      toast.error('Failed to update status')
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delinquent</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will change the whole system status to Delinquent.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <>
              <Button
                variant="destructive"
                onClick={handleDelinquentTransition}
                disabled={isUpdateDelinquent}>
                {isUpdateDelinquent ? 'Updating...' : 'Continue'}
              </Button>
            </>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ButtonDelinquent
