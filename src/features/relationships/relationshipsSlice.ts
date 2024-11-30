import { apiSlice } from '../api/apiSlice'
import { RelationshipsTypeSchema } from '@/schema/relationship.validate'

export const relationshipsSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRelationships: builder.query<
      ResponseDataType<RelationshipsTypeSchema>,
      {
        page?: number
        pageSize?: number
        includes?: string[]
        sort?: string[]
      } & Partial<RelationshipsTypeSchema>
    >({
      query: (params = { page: 1 }) => {
        let url = `relationships?page=${params.page}`
        if (params.pageSize && params.pageSize > 0) {
          url += `&pageSize=${params.pageSize}`
        }
        if (params.apartmentId) {
          url += `&apartment_Id=eq:${params.apartmentId}`
        }
				if (params.userId) {
					url += `&user_Id=eq:${params.userId}`
				}
        if (params.sort && params.sort.length > 0) {
          url += `&sort=${params.sort.join(',')}`
        }
        if (params.includes && params?.includes.length > 0) {
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
                type: 'Relationships' as const,
                id,
              })),
              { type: 'Relationships', id: 'LIST' },
            ]
          : [{ type: 'Relationships', id: 'LIST' }],
    }),
    getRelationship: builder.query<RelationshipsTypeSchema, string | number>({
      query: (id) => ({
        url: `relationships/${id}?includes=rejectionReason`,
      }),
      providesTags: (result, _error, id) => (result ? [{ type: 'Relationships', id }] : []),
    }),
    createRelationship: builder.mutation<
      RelationshipsTypeSchema,
      | Partial<RelationshipsTypeSchema>
      | Pick<RelationshipsTypeSchema, 'role' | 'userId' | 'apartmentId'>
    >({
      query: (data) => ({
        url: 'relationships',
        method: 'POST',
        body: {
          role: data.role,
          userId: data.userId,
          apartmentId: data.apartmentId,
        },
      }),
      invalidatesTags(_result, _error, _arg, _meta) {
        return [{ type: 'Relationships', id: 'LIST' }]
      },
    }),
    updateRelationship: builder.mutation<
      void,
      { id: number | undefined; body: Partial<RelationshipsTypeSchema> }
    >({
      query: (data) => ({
        url: `relationships/${data.id}`,
        method: 'PATCH',
        body: data.body,
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Relationships', id: arg.id }],
    }),
    deleteRelationship: builder.mutation<void, { id?: string | number; apartmentId?: string }>({
      query: (data) => ({
        url: `relationships/${data.id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Relationships', id }],
    }),
  }),
})

export const {
  useCreateRelationshipMutation,
  useDeleteRelationshipMutation,
  useGetRelationshipQuery,
  useGetRelationshipsQuery,
  useLazyGetRelationshipQuery,
  useLazyGetRelationshipsQuery,
} = relationshipsSlice
