import { IUserAnswer } from '@/schema/userAnswer.validate'
import { apiSlice } from '../api/apiSlice'

const userAnswerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserAnswers: builder.query<ResponseDataType<IUserAnswer>, string | number>({
      query: () => `userAnswers`,
    }),
    getUserAnswer: builder.query<ResponseDataType<IUserAnswer>, string | number>({
      query: (id) => `userAnswers/${id}`,
    }),
    createUserAnswer: builder.mutation<
      ResponseDataType<IUserAnswer>,
      Pick<IUserAnswer, 'answerId' | 'userId'>
    >({
      query: (body) => ({
        url: `userAnswers`,
        method: 'POST',
        body,
      }),
    }),
    updateUserAnswer: builder.mutation<ResponseDataType<IUserAnswer>, IUserAnswer>({
      query: (body) => ({
        url: `userAnswers/${body.id}`,
        method: 'PUT',
        body,
      }),
    }),
    deleteUserAnswer: builder.mutation<ResponseDataType<IUserAnswer>, number>({
      query: (id) => ({
        url: `userAnswers/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
})

export const {
  useGetUserAnswersQuery,
  useGetUserAnswerQuery,
  useCreateUserAnswerMutation,
  useUpdateUserAnswerMutation,
  useDeleteUserAnswerMutation,
} = userAnswerApiSlice
