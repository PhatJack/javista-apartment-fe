import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { useState } from 'react'
import ServiceDetailForm from './components/service-detail-form'
import { Eye } from 'lucide-react'
import { ServiceSchema } from '@/schema/service.validate'
import { z } from 'zod'

interface IServiceDetailProps {
  mode: 'create' | 'edit'
  service?: z.infer<typeof ServiceSchema>
}

const ServiceDetail = ({ mode, service }: IServiceDetailProps) => {
  const [open, setOpen] = useState<boolean>(false)

  const triggerButton =
    mode === 'edit' ? (
      <Button variant="ghost" size="icon">
        <Eye />
      </Button>
    ) : (
      <Button className="w-full sm:w-[160px]" variant="default" size="lg">
        New Service
      </Button>
    )

  const dialogTitle =
    mode === 'edit' ? (
      <>
        Service #<span className="text-primary">{service?.id}</span>
      </>
    ) : (
      'Create New Service'
    )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent
        className="max-w-sm lg:max-w-lg xl:max-w-xl"
        aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-2xl">{dialogTitle}</DialogTitle>
        </DialogHeader>
        <Separator />
        <ServiceDetailForm setOpen={setOpen} initialData={service} />
      </DialogContent>
    </Dialog>
  )
}

export default ServiceDetail
