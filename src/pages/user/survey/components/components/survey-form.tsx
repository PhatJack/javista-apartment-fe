import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { useSubmitSurveyMutation } from '@/features/questions/questionsSlice'
import { QuestionSchema } from '@/schema/question.validate'
import { SurveySchema } from '@/schema/survey.validate'
import { useAppSelector } from '@/store'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

interface SurveyFormProps {
  survey?: z.infer<typeof SurveySchema>
}

const SurveyForm = ({ survey }: SurveyFormProps) => {
  const navigate = useNavigate()
  const [submitSurvey, { isLoading }] = useSubmitSurveyMutation()
  const user = useAppSelector((state) => state.userReducer.user)
  const form = useForm<z.infer<typeof QuestionSchema>>()
  const onSubmit = async (data: z.infer<typeof QuestionSchema>) => {
    const checkAnswersID = data.answers?.some(
      (answer) => answer.id?.toString() === 'other',
    )
    const checkEmptyOtherAnswers = data.otherAnswers?.some(
      (answer) => answer.content === '',
    )
    if (checkEmptyOtherAnswers && checkAnswersID) {
      toast.error('Please fill in all other answers')
      return
    }
    const newData = {
      userAnswers: data.answers
        .map((answer) => ({
          answerId: answer.id ? parseInt(answer.id.toString()) : null,
          userId: user?.id,
        }))
        .filter(
          (answer) => answer.answerId !== null && !isNaN(answer.answerId),
        ),
      otherAnswers: data.otherAnswers
        ?.map((answer, index) => ({
          content: answer.content || null,
          userId: user?.id,
          questionId: survey?.questions[index]?.id,
        }))
        .filter((answer) => answer.content !== null),
    }
    await submitSurvey({ id: survey?.id, body: newData })
      .unwrap()
      .then(() => {
        toast.success('Thanks for your response')
        navigate('/surveys')
      })
      .catch((error) => {
        console.log(error)
        toast.error('Something went wrong')
      })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-4 overflow-y-auto">
        {survey &&
          survey.questions.map((question, index) => (
            <div key={index} className="rounded-md p-4 border shadow-md">
              <FormField
                control={form.control}
                name={`answers.${index}.id` as const}
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-base">
                      Question {index + 1}. {question.content}
                    </FormLabel>
                    <RadioGroup
                      value={String(field.value)}
                      onValueChange={(value) => {
                        field.onChange(value)
                        if (value !== 'other') {
                          form.setValue(`otherAnswers.${index}.content`, '')
                        }
                      }}
                      className="">
                      {question.answers.map((answer, idx) => (
                        <FormItem
                          key={idx}
                          className={`flex items-center space-y-0 space-x-2 ${
                            field.value == answer.id
                              ? 'bg-primary/20'
                              : 'bg-zinc-100'
                          } px-3 rounded-md`}>
                          <FormControl>
                            <RadioGroupItem value={answer.id + ''} />
                          </FormControl>
                          <FormLabel
                            className={`w-full py-3 ${
                              field.value == answer.id
                                ? 'font-medium'
                                : 'font-normal'
                            }`}>
                            {answer.content}
                          </FormLabel>
                        </FormItem>
                      ))}
                      <FormItem
                        className={`flex items-center space-y-0 space-x-2 px-3 rounded-md ${
                          String(field.value) === 'other'
                            ? 'bg-primary/20'
                            : 'bg-zinc-100'
                        }`}>
                        <FormControl>
                          <RadioGroupItem value="other" />
                        </FormControl>
                        <FormLabel className="w-full py-3 font-normal">
                          Other
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                    {/* Textarea for Other option */}
                    {String(field.value) === 'other' && (
                      <FormField
                        control={form.control}
                        name={`otherAnswers.${index}.content` as const}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Please specify answer..."
                                className="mt-2 max-h-32"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </FormItem>
                )}
              />
            </div>
          ))}

        <Button type="submit" className="w-full">
          {isLoading ? 'Sending...' : 'Send'}
        </Button>
      </form>
    </Form>
  )
}

export default SurveyForm
