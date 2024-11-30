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
import { Loader, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface AlertDeleteProps {
  setAction: (value: void) => Promise<void>
  description: string
  variants?:
    | 'link'
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'success'
    | 'warning'
    | 'info'
    | 'error'
  type?: 'icon' | 'button'
  isLoading?: boolean
}

const AlertDelete = ({
  setAction,
  description,
  variants = 'destructive',
  type = 'button',
  isLoading = false,
}: AlertDeleteProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleAction = async () => {
    await setAction()
    setIsOpen(false)
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        {type === 'icon' ? (
          <Button
            onClick={() => setIsOpen(true)}
            size={'icon'}
            type="button"
            variant={variants}>
            <Trash2 />
          </Button>
        ) : (
          <Button
            onClick={() => setIsOpen(true)}
            type="button"
            variant={variants}>
            Delete
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        {isLoading && (
          <div className="w-full h-full absolute rounded-lg bg-black/50 flex justify-center items-center">
            <Loader size={20} className="animate-spin text-white" />
          </div>
        )}
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the{' '}
            {description} and remove the data from the server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              className="bg-red-500 text-white hover:bg-red-400"
              type="button"
              onClick={(e) => {
                e.preventDefault()
                handleAction()
              }}>
              Continue
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AlertDelete
