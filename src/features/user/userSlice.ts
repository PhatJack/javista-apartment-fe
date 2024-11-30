import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { apiSlice } from '../api/apiSlice'
import { FirstLogin, User } from '@/schema/user.validate'

interface QrScanInformation {
  nationID?: string
  name?: string
  dob?: string
  gender?: string
}

interface UserState {
  isEditingUser: boolean
  qrScanInformation?: Partial<QrScanInformation>
  user?: User
}

const initialState: UserState = {
  isEditingUser: false,
  qrScanInformation: undefined,
  user: undefined,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getQrScanInformation: (state, action: PayloadAction<QrScanInformation | undefined>) => {
      state.qrScanInformation = action.payload
    },
    getUserInformation: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },
  },
})

const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<
      ResponseDataType<User>,
      {
        page?: number
        username?: string
        pageSize?: number
      } & Partial<User>
    >({
      query: (params = { page: 1, username: '', pageSize: 10 }) => {
        let baseUrl = `users?page=${params.page}`
        if (params.pageSize && params.pageSize != 10) {
          baseUrl += `&pageSize=${params.pageSize}`
        }
        if (params.id) {
          baseUrl += `&id=eq:${params.id}`
        }
        if (params.email && params.email != '') {
          baseUrl += `&email=like:${params.email}`
        }
        if (params.fullName && params.fullName != '') {
          baseUrl += `&fullName=like:${params.fullName}`
        }
        if (params.phone && params.phone != '') {
          baseUrl += `&phone=like:${params.phone}`
        }
        if (params.username && params.username != '') {
          baseUrl += `&username=like:${params.username}`
        }
        return {
          url: baseUrl,
        }
      },
      providesTags: (results) =>
        results
          ? [
              ...results.data.map(({ id }) => ({
                type: 'Users' as const,
                id,
              })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),
    getUsersInScroll: builder.query<ResponseDataType<User>, { page?: number; pageSize?: number }>({
      query: (params) => `users?page=${params.page}&pageSize=${params.pageSize}&Id=neq:1`,
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName
      },
      merge(currentCacheData, responseData) {
        currentCacheData.data.push(...responseData.data)
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg
      },
    }),
    getUserById: builder.query<User, string | number>({
      query: (id) => `users/${id}`,
      providesTags: (result, error, id) => [{ type: 'Users', id }],
    }),
    getCurrentUser: builder.query<User, void>({
      query: () => 'users/me',
    }),
    createUser: builder.mutation<
      void,
      Partial<User> &
        Omit<
          User,
          | 'id'
          | 'createdAt'
          | 'updatedAt'
          | 'items'
          | 'otherAnswers'
          | 'relationships'
          | 'surveys'
          | 'userAnswers'
        >
    >({
      query: (data) => ({
        url: 'users',
        method: 'POST',
        body: data,
      }),
      invalidatesTags(result, error, arg, meta) {
        return [{ type: 'Users', id: 'LIST' }]
      },
    }),
    updateUser: builder.mutation<
      void,
      {
        id: string | number
        body: Partial<User> &
          Pick<
            User,
            'email' | 'fullName' | 'isStaying' | 'dateOfBirth' | 'nationId' | 'phone' | 'gender'
          >
      }
    >({
      query: (data) => ({
        url: `users/${data.id}`,
        method: 'PATCH',
        body: data.body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Users', id }],
    }),
    deleteUser: builder.mutation<void, string | number | undefined>({
      query: (id) => ({
        url: `users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Users' }],
    }),
    updatePassord: builder.mutation<void, { body: FirstLogin }>({
      query: (data) => ({
        url: 'users/me/first-login',
        method: 'POST',
        body: data.body,
      }),
    }),
    notifyReceivedPackage: builder.mutation<void, { id?: number }>({
      query: (data) => ({
        url: `users/${data.id}/notify-sms`,
        method: 'POST',
      }),
    }),
  }),
})

export default userSlice.reducer
export const { getQrScanInformation, getUserInformation } = userSlice.actions
export const {
  useGetUsersQuery,
  useGetUsersInScrollQuery,
  useLazyGetUserByIdQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  useUpdatePassordMutation,
  useNotifyReceivedPackageMutation,
} = userApiSlice
