import { z } from "zod";
import { AnswerItem } from "./question.validate";
import { User } from "./user.validate";

export const userAnswerSchema = z.object({
	id: z.number().optional(),
	answerId: z.number().optional(),
	userId: z.number().optional(),
})

export interface IUserAnswer extends z.infer<typeof userAnswerSchema>,BaseEntity {
	answer?: AnswerItem,
	user?: User,
}