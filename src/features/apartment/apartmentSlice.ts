import { apiSlice } from '../api/apiSlice'
import { ApartmentFormSchema } from '@/schema/apartment.validate'

export const apartmentSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getApartments: builder.query<
      ResponseDataType<ApartmentFormSchema>,
      {
        page?: number
        pageSize?: number
        includes?: string[]
      } & Partial<ApartmentFormSchema>
    >({
      query: (params) => {
        let url = `apartments?page=${params.page}`
        if (params.pageSize) {
          url += `&PageSize=${params.pageSize}`
        }
        if (params.status) {
          url += `&status=eq:${params.status}`
        }
        if (params.id) {
          url += `&id=like:${params.id}`
        }
        if (params.includes && params.includes?.length > 0) {
          url += `&includes=${params.includes.join(',')}`
        }
        return {
          url: url,
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: 'Apartments' as const,
                id,
              })),
              { type: 'Apartments', id: 'LIST' },
            ]
          : [{ type: 'Apartments', id: 'LIST' }],
    }),
    getApartment: builder.query<ApartmentFormSchema, { id?: string; includes?: string }>({
      query: (params) => {
        let url = `apartments/${params.id}`
        if (params.includes) {
          url += `?includes=${params.includes}`
        }
        return {
          url: url,
        }
      },
      providesTags: (result, error, { id }) => (result ? [{ type: 'Apartments', id }] : []),
    }),
    createApartment: builder.mutation<ApartmentFormSchema, Partial<ApartmentFormSchema>>({
      query: (body) => ({
        url: 'apartments',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: [{ type: 'Apartments', id: 'LIST' }],
    }),
    updateApartment: builder.mutation<
      void,
      {
        id: string
        body: Partial<ApartmentFormSchema> &
          Pick<
            ApartmentFormSchema,
            'area' | 'description' | 'floorNumber' | 'apartmentNumber' | 'status'
          >
      }
    >({
      query: (data) => ({
        url: `apartments/${data.id}`,
        method: 'PUT',
        body: data.body,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Apartments', id: arg.id }],
    }),
    deleteApartment: builder.mutation<void, string | undefined>({
      query: (id: string) => ({
        url: `apartments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Apartments', id }],
    }),
  }),
})

export const {
  useGetApartmentsQuery,
  useGetApartmentQuery,
  useCreateApartmentMutation,
  useUpdateApartmentMutation,
  useDeleteApartmentMutation,
  useLazyGetApartmentQuery,
  useLazyGetApartmentsQuery,
} = apartmentSlice
