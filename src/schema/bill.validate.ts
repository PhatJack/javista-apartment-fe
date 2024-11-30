import { BillStatusSchema, PaymentMethodTypeSchema, RequestTypeForMomoSchema } from '@/enums'
import { z } from 'zod'
import { ExtendedRelationshipsSchema } from './relationship.validate'
import { BaseEntitySchema } from './base.entity'

export const BillSchema = z.object({
  id: z.number(),
  monthly: z.string(),
  totalPrice: z.number(),
  oldWater: z.number().nullable(),
  newWater: z.number().nullable(),
  status: BillStatusSchema,
  relationshipId: z.number(),
  waterReadingDate: z.coerce.date().nullable(),
})

type BillType = z.infer<typeof BillSchema> & {
  relationship?: z.infer<typeof ExtendedRelationshipsSchema>
  createdAt?: Date | null | string
  updatedAt?: Date | null | string
  deleteAt?: Date | null | string
}

export const ExtendedBillSchema: z.ZodType<BillType> = BillSchema.extend({
  relationship: z.lazy(() => ExtendedRelationshipsSchema).optional(),
}).merge(BaseEntitySchema)

export type IBill = z.infer<typeof ExtendedBillSchema>

export const UpdateWaterReadingSchema = z
  .object({
    billId: z.number(),
    newWaterIndex: z.number().optional(),
    readingDate: z.coerce.date().optional(),
  })

export const UpdateWaterReadingListSchema = z.object({
  waterReadings: z.array(UpdateWaterReadingSchema),
})

export type IUpdateWaterReading = z.infer<typeof UpdateWaterReadingSchema>

export const PaymentMethodSchema = z
  .object({
    name: PaymentMethodTypeSchema.optional(),
    requestType: RequestTypeForMomoSchema.optional(),
  })
  .refine(
    (data) => {
      // If name is "MOMO", then requestType must be present
      return data.name !== 'MOMO' || (data.requestType !== undefined && data.requestType !== null)
    },
    {
      message: 'requestType is required when name is "MOMO"',
      path: ['requestType'], // specify the path to the error
    },
  )
