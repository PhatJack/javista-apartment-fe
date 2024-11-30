import { ApartmentUserRoleSchema } from '@/enums'
import { z } from 'zod'
import { UserSchema } from './user.validate'
import { BaseEntitySchema } from './base.entity'
import { ApartmentSchema } from './apartment.validate'
export const RelationshipsSchema = z.object({
  id: z.number(),
  role: ApartmentUserRoleSchema, // adjust enums based on all possible roles
  userId: z.number(),
  apartmentId: z.string(),
})

type RelationshipsType = z.infer<typeof RelationshipsSchema> & {
  user?: z.infer<typeof UserSchema> | null
  apartment?: z.infer<typeof ApartmentSchema>
  createdAt?: Date | null | string
  updatedAt?: Date | null | string
  deleteAt?: Date | null | string
}

export const ExtendedRelationshipsSchema: z.ZodType<RelationshipsType> = RelationshipsSchema.extend(
  {
    user: UserSchema.optional(),
    apartment: z.lazy(() => ApartmentSchema).optional(),
  },
).merge(BaseEntitySchema)

export type RelationshipsTypeSchema = z.infer<typeof ExtendedRelationshipsSchema>
