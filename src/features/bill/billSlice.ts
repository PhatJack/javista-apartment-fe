import { IBill, IUpdateWaterReading } from '@/schema/bill.validate'
import { apiSlice } from '../api/apiSlice'
import { Statistic, StatisticQuery } from '@/schema/statistic.validate'

export const billSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBills: builder.query<
      ResponseDataType<IBill>,
      {
        page?: number
        pageSize?: number
        includes?: string[]
        Relationship_UserId?: number
      } & Partial<IBill>
    >({
      query: (params = { page: 1 }) => {
        let url = `bills?page=${params.page}`
        if (params.pageSize) {
          url += `&PageSize=${params.pageSize}`
        }
        if (params.Relationship_UserId) {
          url += `&relationship_user_Id=eq:${params.Relationship_UserId}`
        }
        if (params.monthly) {
          url += `&Monthly=eq:${params.monthly}`
        }
        if (params.relationshipId) {
          url += `&relationshipId=eq:${params.relationshipId}`
        }
        if (params.status) {
          url += `&status=eq:${params.status}`
        }
        if (params.id) {
          url += `&id=like:${params.id}`
        }
        if (params.includes && params.includes.length > 0) {
          url += `&includes=${params.includes.join(',')}`
        }
        return {
          url: url,
        }
      },
      providesTags: (results) =>
        results
          ? [
              ...results.data.map(({ id }) => ({
                type: 'Bills' as const,
                id,
              })),
              { type: 'Bills', id: 'LIST' },
            ]
          : [{ type: 'Bills', id: 'LIST' }],
    }),
    getBill: builder.query<IBill, number | undefined | string>({
      query: (id) => ({
        url: `bills/${id}?includes=Relationship`,
      }),
      providesTags: (result, error, id) => [{ type: 'Bills', id }],
    }),
    updateBill: builder.mutation<void, { id?: number; body: Partial<IBill> }>({
      query: (data) => ({
        url: `bills/${data.id}`,
        method: 'PATCH',
        body: data.body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Bills', id }],
    }),
    deleteBill: builder.mutation<void, number | undefined>({
      query: (id) => ({
        url: `bills/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Bills', id }],
    }),
    paidByMomo: builder.mutation<
      void,
      {
        id?: string
        body: { RequestType?: string }
      }
    >({
      query: (data) => ({
        url: `bills/${data.id}/payment/momo`,
        method: 'POST',
        body: data.body,
      }),
    }),
    paidByVnpay: builder.mutation<void, { id?: string }>({
      query: (data) => ({
        url: `bills/${data.id}/payment/vnpay`,
        method: 'POST',
      }),
    }),
    updateWaterReadings: builder.mutation<void, { body: { waterReadings: IUpdateWaterReading[] } }>(
      {
        query: (data) => ({
          url: `bills/update-water-readings`,
          method: 'PUT',
          body: data.body,
        }),
        invalidatesTags: (result, error) => [{ type: 'Bills' }],
      },
    ),
    statisticsRevenue: builder.query<Statistic[], StatisticQuery>({
      query: (params) => ({
        url: `statistics/revenue?startMonth=${params.startDate}&endMonth=${params.endDate}`,
      }),
      transformResponse(
        baseQueryReturnValue: { result?: { monthlyRevenueStatistics: Statistic[] } },
        meta,
        arg,
      ) {
        return baseQueryReturnValue.result?.monthlyRevenueStatistics || []
      },
    }),
  }),
})

export const {
  usePaidByMomoMutation,
  usePaidByVnpayMutation,
  useGetBillsQuery,
  useLazyGetBillsQuery,
  useGetBillQuery,
  useUpdateBillMutation,
  useDeleteBillMutation,
  useUpdateWaterReadingsMutation,
  useStatisticsRevenueQuery,
} = billSlice
