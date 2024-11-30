import z from 'zod'

export const StatisticSchema = z.object({
	month: z.string(),
	revenue: z.number(),
})
export const StatisticQuerySchema = z
  .object({
    startDate: z.string(),
    endDate: z.string(),
  })
  .refine(
    (data) => data.startDate <= data.endDate,
    {
      message: "Start date must be less than or equal to end date.",
      path: ["startDate"],
    }
  );
export type StatisticQuery = z.infer<typeof StatisticQuerySchema>
export type Statistic = z.infer<typeof StatisticSchema>