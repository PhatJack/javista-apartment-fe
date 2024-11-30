import { ApartmentStatusSchema } from '@/enums'
import { z } from 'zod'
import { BaseEntitySchema } from './base.entity'
import { ExtendedRelationshipsSchema } from './relationship.validate'

export const ApartmentSchema = z.object({
  id: z.string(),
  area: z.coerce.number().positive(),
  description: z.string(),
  floorNumber: z.coerce.number().positive(),
  apartmentNumber: z.coerce.number().positive(),
  status: ApartmentStatusSchema,
  currentWaterNumber: z.number().positive(),
})

type ApartmentType = z.infer<typeof ApartmentSchema> & {
  relationships?: z.infer<typeof ExtendedRelationshipsSchema>[]
  createdAt?: Date | null | string
  updatedAt?: Date | null | string
  deleteAt?: Date | null | string
}

export const ExtendedApartmentSchema: z.ZodType<ApartmentType> = ApartmentSchema.extend({
  relationships: z.lazy(() => ExtendedRelationshipsSchema.array()).optional(),
}).merge(BaseEntitySchema)

export type ApartmentFormSchema = z.infer<typeof ExtendedApartmentSchema>
