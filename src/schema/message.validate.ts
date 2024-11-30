import { Timestamp } from 'firebase/firestore'
import { z } from 'zod'
export const TimestampType = z.custom<Timestamp>(
  (value) => value instanceof Timestamp,
)
export const MessageSchema = z.object({
	text: z.string().min(1, "Text is required"),
	senderId: z.number(),
	timestamp: TimestampType,
})
export type MessageType = z.infer<typeof MessageSchema>