import { ReportStatusSchema } from '@/enums'
import { z } from 'zod'
import { BaseEntitySchema } from './base.entity'

export const RejectionReasonSchema = z.object({
  id: z.number(),
  content: z.string(),
  reportId: z.number().nullable(),
})

export type RejectionReasonType = z.infer<typeof RejectionReasonSchema>

export const ReportSchema = z.object({
  id: z.number(),
  content: z.string(),
  title: z.string(),
  status: ReportStatusSchema,
  relationshipId: z.number().nullable().optional(),
  rejectionReasonId: z.number().nullable().optional(),
})
export type ReportFormSchema = z.infer<typeof ReportSchema>

export type ReportType = z.infer<typeof ReportSchema> & {
  createdAt?: Date | string
  updatedAt?: Date | null | string
  deleteAt?: Date | null | string
}

export const ExtendedReportSchema: z.ZodType<ReportType> = ReportSchema.merge(BaseEntitySchema)
