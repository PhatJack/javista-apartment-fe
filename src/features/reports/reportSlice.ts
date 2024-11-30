import { ReportType } from '@/schema/report.validate'
import { apiSlice } from '../api/apiSlice'

export const reportsSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReports: builder.query<
      ResponseDataType<ReportType>,
      {
        page?: number
        pageSize?: number
        includes?: string[]
        sort?: string[]
        Relationship_UserId?: number
      } & Partial<ReportType>
    >({
      query: (params = { page: 1 }) => {
        let url = `reports?page=${params.page}`
        if (params.pageSize && params.pageSize > 0) {
          url += `&pageSize=${params.pageSize}`
        }
        if(params.Relationship_UserId){
          url += `&Relationship_UserId=eq:${params.Relationship_UserId}`
        }
        if (params.sort && params.sort.length > 0) {
          url += `&sort=${params.sort.join(',')}`
        }
        if (params.includes && params?.includes.length > 0) {
          url += `&includes=${params.includes.join(',')}`
        }
        if (params.relationshipId && params.relationshipId !== -1) {
          url += `&relationshipId=eq:${params.relationshipId}`
        }
        return {
          url: url,
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: 'Reports' as const,
                id,
              })),
              { type: 'Reports', id: 'LIST' },
            ]
          : [{ type: 'Reports', id: 'LIST' }],
    }),
    getReport: builder.query<ReportType, string | number>({
      query: (id) => ({
        url: `reports/${id}`,
      }),
      providesTags: (result, error, id) => (result ? [{ type: 'Reports', id }] : []),
    }),
    createReport: builder.mutation<
      ReportType,
      Partial<ReportType> | Pick<ReportType, 'title' | 'content' | 'relationshipId' | 'status'>
    >({
      query: (data) => ({
        url: 'reports',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Reports', id: 'LIST' }],
    }),
    updateReport: builder.mutation<void, { id: number | undefined; body: Partial<ReportType> }>({
      query: (data) => ({
        url: `reports/${data.id}`,
        method: 'PATCH',
        body: data.body,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Reports', id: arg.id }],
    }),
    deleteReport: builder.mutation<void, string | number | undefined>({
      query: (id: string) => ({
        url: `reports/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Reports', id }],
    }),
  }),
})

export const {
  useGetReportsQuery,
  useGetReportQuery,
  useUpdateReportMutation,
  useDeleteReportMutation,
  useCreateReportMutation,
} = reportsSlice
