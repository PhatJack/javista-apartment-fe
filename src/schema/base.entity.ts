import { z } from 'zod'

export const BaseEntitySchema = z.object({
  createdAt: z.union([z.date(), z.string()]).optional(),
  updatedAt: z.union([z.date(), z.string()]).nullable().optional(),
  deletedAt: z.union([z.date(), z.string()]).nullable().optional(),
})
