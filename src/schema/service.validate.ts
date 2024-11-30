import { z } from 'zod'
export const ServiceSchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters long'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters long')
    .max(500, 'Description must be less than 500 characters long'),
  price: z.coerce
    .number()
    .positive('Price must be a positive number') // Must be positive
    .min(1, 'Price must be at least 1'),
})

type ServiceFormSchema = z.infer<typeof ServiceSchema>

export interface IService extends ServiceFormSchema, BaseEntity {}
