import { RejectionReasonType } from '@/schema/report.validate'
import { apiSlice } from '../api/apiSlice'

export const rejectedReasonsSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRejectionReasons: builder.query<ResponseDataType<RejectionReasonType>, number | void>({
      query: (page = 1) => {
        return {
          url: `rejectionReasons?page=${page}`,
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: 'RejectionReasons' as const,
                id,
              })),
              { type: 'RejectionReasons', id: 'LIST' },
            ]
          : [{ type: 'RejectionReasons', id: 'LIST' }],
    }),
    getRejectionReason: builder.query<RejectionReasonType, undefined | number>({
      query: (id) => ({
        url: `rejectionReasons/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: 'RejectionReasons', id }],
    }),
    createRejectionReason: builder.mutation<
      RejectionReasonType,
      Partial<RejectionReasonType> & Omit<RejectionReasonType, 'id'>
    >({
      query: (data) => ({
        url: 'rejectionReasons',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Reports', id: arg.reportId ?? undefined }],
    }),
    updateRejectionReason: builder.mutation<
      void,
      { id: string | number | undefined; body: Partial<RejectionReasonType> }
    >({
      query: (data) => ({
        url: `rejectionReasons/${data.id}`,
        method: 'PATCH',
        body: data.body,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'RejectionReasons', id: arg.id }],
    }),
    deleteRejectionReason: builder.mutation<void, string | number | undefined>({
      query: (id: string) => ({
        url: `rejectionReasons/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'RejectionReasons', id }],
    }),
  }),
})

export const { useCreateRejectionReasonMutation, useLazyGetRejectionReasonQuery } =
  rejectedReasonsSlice
