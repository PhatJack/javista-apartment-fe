import { apiSlice } from '../api/apiSlice'
import { IQuestion } from '@/schema/question.validate'

const questionsSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQuestionsById: builder.query<ResponseDataType<IQuestion>, number | void>({
      query: (page = 1) => `surveys?page=${page}`,
    }),
    submitSurvey: builder.mutation<void, { id?: number; body: any }>({
      query: (data) => ({
        url: `surveys/${data.id}/submit`,
        method: 'POST',
        body: data.body,
      }),
    }),
  }),
})

export const { useGetQuestionsByIdQuery, useSubmitSurveyMutation } = questionsSlice
