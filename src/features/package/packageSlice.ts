import { IPackage, PackageSchema } from '@/schema/package.validate'
import { apiSlice } from '../api/apiSlice'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { z } from 'zod'

interface PackageState {
  showPackage: boolean
}

const initialState: PackageState = {
  showPackage: false,
}

const packageSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    showDetailPackage(state, action: PayloadAction<PackageState>) {
      state.showPackage = action.payload.showPackage
    },
  },
})

const packageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPackages: builder.query<
      ResponseDataType<IPackage>,
      {
        page?: number
        pageSize?: number
        sort?: string[]
      } & Partial<IPackage>
    >({
      query: (params?) => {
        let url = 'items'
        if (params?.page) {
          url += `?page=${params.page}`
        }
        if (params?.isReceive) {
          url += `&isReceive=eq:${params.isReceive}`
        }
        if (params?.userId) {
          url += `&User_Id=eq:${params.userId}`
        }
        if (params?.pageSize) {
          url += `&pageSize=${params.pageSize}`
        }
        if (params?.sort && params?.sort.length > 0) {
          url += `&sort=${params.sort.join(',')}`
        }
        return {
          url: url,
        }
      },
      providesTags: (results) =>
        results
          ? [
              ...results.data.map(({ id }) => ({
                type: 'Packages' as const,
                id,
              })),
              { type: 'Packages', id: 'LIST' },
            ]
          : [{ type: 'Packages', id: 'LIST' }],
    }),
    getPackage: builder.query<IPackage, { id?: number }>({
      query: (params) => {
        let url = `items/${params.id}`
        return {
          url: url,
        }
      },
      providesTags: (result, error, { id }) => [{ type: 'Packages', id }],
    }),
    updatePackage: builder.mutation<
      IPackage,
      {
        id?: number
        body: Partial<IPackage> & Pick<IPackage, 'description'>
      }
    >({
      query: (data) => ({
        url: `items/${data.id}`,
        method: 'PATCH',
        body: data.body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Packages', id }],
    }),
    updateImagePackage: builder.mutation<void, { id?: number; image: FormData }>({
      query: ({ id, image }) => ({
        url: `items/${id}/image`,
        method: 'POST',
        body: image,
        headers: {
          'Content-Type': undefined,
        },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Packages', id },
        { type: 'Packages', id: 'LIST' },
      ],
    }),
    createPackage: builder.mutation<IPackage, Pick<IPackage, 'description' | 'userId'>>({
      query: (data) => ({
        url: 'items',
        method: 'POST',
        body: data,
      }),
    }),
    deletePackage: builder.mutation<void, { id?: number }>({
      query: (data) => ({
        url: `items/${data.id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Packages', id: 'LIST' }],
    }),
    patchPackage: builder.mutation<IPackage, { id: string; data: Partial<IPackage> }>({
      query: ({ id, data }) => ({
        url: `items/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Packages', id }],
    }),
  }),
})

export const { showDetailPackage } = packageSlice.actions
export default packageSlice.reducer

export const {
  useGetPackagesQuery,
  useCreatePackageMutation,
  useDeletePackageMutation,
  useUpdatePackageMutation,
  useGetPackageQuery,
  useLazyGetPackageQuery,
  useUpdateImagePackageMutation,
} = packageApiSlice
