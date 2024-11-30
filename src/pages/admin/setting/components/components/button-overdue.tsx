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
import { useUpdateTransitionOverdueMutation } from '@/features/setting/settingSlice'
import { toast } from 'sonner'

const ButtonOverdue = () => {
  const [updateStatusOverdue, { isLoading: isUpdateOverdue }] = useUpdateTransitionOverdueMutation()
  const handleOverdueTransition = async () => {
    try {
      await updateStatusOverdue()
        .unwrap()
        .then(() => {
          toast.success('Updated to Overdue status successfully')
        })
        .catch(() => {
          toast.error('Failed to update status')
        })
    } catch (error) {
      console.error('Failed to update to Overdue status:', error)
      toast.error('Failed to update status')
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="warning">Overdue</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will change the whole system status to Overdue.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <>
              <Button
                variant="warning"
                onClick={handleOverdueTransition}
                disabled={isUpdateOverdue}>
                {isUpdateOverdue ? 'Updating...' : 'Continue'}
              </Button>
            </>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ButtonOverdue
