import AlertDelete from '@/components/alert/AlertDelete'
import { TableCell, TableRow } from '@/components/ui/table'
import { useDeleteServiceMutation } from '@/features/service/serviceSlice'
import { Service } from '@/schema/service.validate'
import { toast } from 'sonner'
import ServiceDetail from './service-detail'

interface IServiceItemProps {
  service: Service
}

const ServiceItem = ({ service }: IServiceItemProps) => {
  const [deleteService, { isLoading }] = useDeleteServiceMutation()

  const handleDelete = async () => {
    try {
      const result = await deleteService(service?.id).unwrap()
      console.log(result)
      if (result === undefined) {
        throw new Error('Something went wrong')
      } else {
        toast.success('Service deleted successfully')
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error.message)
    }
  }

  return (
    <TableRow key={service.id} className="font-medium cursor-pointer">
      <TableCell className="py-3">{service.id}</TableCell>
      <TableCell className="">
        <p className="">{service.name}</p>
      </TableCell>
      <TableCell>{service.price}</TableCell>
      <TableCell>
        {service.updatedAt === null
          ? 'N/A'
          : new Date(service.updatedAt).toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
      </TableCell>
      <TableCell className="uppercase">{service.description}</TableCell>
      <TableCell className="uppercase">
        <ServiceDetail mode="edit" service={service} />
      </TableCell>
      <TableCell>
        <AlertDelete
          description="package"
          setAction={() => handleDelete()}
          isLoading={isLoading}
          type="icon"
          variants="ghost"
        />
      </TableCell>
    </TableRow>
  )
}

export default ServiceItem
