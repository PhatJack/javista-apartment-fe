import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { apiSlice } from '../api/apiSlice'
import { UserFormSchema } from '@/schema/user.validate'

interface AuthState {
  user?: UserFormSchema
  token: string
}

const initialState: AuthState = {
  token: '',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userLoggedIn(state, action: PayloadAction<AuthState>) {
      state.token = action.payload.token
    },
    userLoggedOut(state) {
      state.user = initialState.user
      state.token = initialState.token
    },
  },
})
export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<any, { body: { username: string; password: string } }>({
      query: (data) => ({
        url: 'auth/login',
        method: 'POST',
        body: data.body,
      }),
    }),
  }),
})

export const { userLoggedIn, userLoggedOut } = authSlice.actions

export default authSlice.reducer
export const { useLoginMutation } = authApiSlice
