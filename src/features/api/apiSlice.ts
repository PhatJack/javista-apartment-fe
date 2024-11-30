import { RootState } from '@/store'
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { toast } from 'sonner'
import Cookies from 'universal-cookie'
import { userLoggedIn, userLoggedOut } from '../auth/authSlice'

const cookies = new Cookies(null, { path: '/' })

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_SERVER_URL,
  prepareHeaders: (headers, { getState }) => {
    // By default, if we have a token in the store, let's use that for authenticated requests
    const token = (getState() as RootState).authReducer.token || cookies.get('accessToken')
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await baseQuery(args, api, extraOptions)
  if (result.error && result.error.status === 401) {
    // Get the error message from the response
    const errorMessage = (result.error.data as { message: string })?.message
    // Check if this is a login attempt failure
    if (typeof args !== 'string' && args.url === 'auth/login') {
      // Don't attempt token refresh for login failures
      return result
    }

    // For other 401 errors, attempt token refresh
    const token =
      (api.getState() as RootState).authReducer.token || cookies.get('accessToken')

    const refreshResult = await baseQuery(
      {
        url: 'auth/refresh',
        method: 'POST',
        body: { token: token },
      },
      api,
      extraOptions,
    )

    if (refreshResult.data) {
      const tokens = refreshResult.data as {
        token: string
      }

      // Store the new tokens
      api.dispatch(
        userLoggedIn({
          token: tokens.token,
        }),
      )

      cookies.set('accessToken', tokens.token, { path: '/' })

      // Retry the initial query
      result = await baseQuery(args, api, extraOptions)
    } else {
      if (errorMessage === 'Unauthorized') {
        toast.error('Your session has expired. Please log in again.', {
          action: {
            label: 'Log in',
            onClick: () => {
              cookies.remove('accessToken')
              cookies.remove('refreshToken')
              api.dispatch(userLoggedOut())
              window.location.href = '/login'
            },
          },
        })
      }
    }
  }
  return result
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Auth',
    'Service',
    'Bills',
    'Reports',
    'Apartments',
    'Surveys',
    'RejectionReasons',
    'Users',
    'Settings',
    'Packages',
    'Relationships',
  ],
  endpoints: () => ({}),
})
