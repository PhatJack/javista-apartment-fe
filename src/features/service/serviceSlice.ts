import { IService } from '@/schema/service.validate'
import { apiSlice } from '../api/apiSlice'

export const serviceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query<
      ResponseDataType<IService>,
      { page?: number; pageSize?: number } & Partial<IService>
    >({
      query: (params = { page: 1, name: '' }) => {
        let baseUrl = `services?page=${params.page}`
        if (params.pageSize) {
          baseUrl += `&pageSize=${params.pageSize}`
        }
        if (params.name && params.name != '') {
          baseUrl += `&name=like:${params.name}`
        }
        return {
          url: baseUrl,
        }
      },
      providesTags: (results) =>
        results
          ? [
              ...results.data.map(({ id }) => ({
                type: 'Service' as const,
                id,
              })),
              { type: 'Service', id: 'LIST' },
            ]
          : [{ type: 'Service', id: 'LIST' }],
    }),
    getService: builder.query<IService, string | number | undefined>({
      query: (id: string) => ({
        url: `services/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Service', id }],
    }),
    createService: builder.mutation<IService, Omit<IService, 'id' | 'createdAt' | 'updatedAt'>>({
      query: (body) => ({
        url: 'services',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Service', id: 'LIST' }],
    }),
    updateService: builder.mutation<
      IService,
      {
        id: number | undefined
        body: Partial<IService> & Omit<IService, 'id' | 'createdAt' | 'updatedAt'>
      }
    >({
      query: (data) => ({
        url: `services/${data.id}`,
        method: 'PUT',
        body: data.body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Service', id }],
    }),
    patchService: builder.mutation<IService, Partial<IService>>({
      query: (body) => ({
        url: `services/${body.id}`,
        method: 'PATCH',
        body,
      }),
    }),
    deleteService: builder.mutation<void, string | number | undefined>({
      query: (id: string) => ({
        url: `services/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Service', id }],
    }),
  }),
})

export const {
  useGetServicesQuery,
  useGetServiceQuery,
  useCreateServiceMutation,
  useDeleteServiceMutation,
  usePatchServiceMutation,
  useUpdateServiceMutation,
} = serviceApiSlice
