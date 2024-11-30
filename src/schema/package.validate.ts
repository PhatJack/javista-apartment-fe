import { z } from 'zod'
import { User } from './user.validate'

// Custom type refinement for File objects
const isFile = (value: any): value is File => {
  return value instanceof File
}

// Custom file validation
const FileSchema = z.custom<File>((value) => {
  // Allow both string (for existing records) and File objects (for uploads)
  if (typeof value === 'string') return true
  if (!value) return false
  return isFile(value)
}, 'Invalid file')

export const PackageSchema = z.object({
  id: z.number().int().positive().optional(),
  image: z.union([z.string(), FileSchema]),
  description: z.string(),
  isReceive: z.boolean().default(false),
  userId: z.coerce.number(),
})
export interface IPackage extends z.infer<typeof PackageSchema>, BaseEntity {
  user?: User
}
