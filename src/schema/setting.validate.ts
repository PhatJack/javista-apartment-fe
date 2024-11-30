import { SystemStatusSchema } from '@/enums'
import {z} from 'zod'

export const SettingSchema = z.object({
	id: z.number().optional(),
	currentMonthly: z.string().optional(),
	systemStatus: SystemStatusSchema,
	roomPricePerM2: z.number(),
	waterPricePerM3: z.number(),
	waterVat: z.number(),
	envProtectionTax: z.number()
})

export interface ISetting extends z.infer<typeof SettingSchema> {}