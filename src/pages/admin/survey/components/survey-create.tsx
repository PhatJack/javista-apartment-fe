import { Button } from '@/components/ui/button'
import { DateTimePicker } from '@/components/ui/datetime-picker'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  createNewSurvey,
  useCreateFullSurveyMutation,
} from '@/features/survey/surveySlice'
import { SurveySchema } from '@/schema/survey.validate'
import { useAppDispatch, useAppSelector } from '@/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft, Loader } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import QuestionItem from './question-item'

const SurveyCreate = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.userReducer.user)
  const [createFullSurvey, { isLoading }] = useCreateFullSurveyMutation()

  const form = useForm<Omit<z.infer<typeof SurveySchema>, 'id'>>({
    defaultValues: {
      title: '',
      questions: [
        {
          content: '',
          answers: [
            { content: '' },
            { content: '' },
            { content: '' },
            { content: '' },
          ],
        },
      ],
      userId: user?.id,
      startDate: new Date(),
      endDate: new Date(),
    },
    resolver: zodResolver(SurveySchema),
  })

  const { fields, append, remove } = useFieldArray({
    name: 'questions',
    control: form.control,
  })

  const appendQuestion = () => {
    append({
      content: '',
      answers: [
        {
          content: '',
        },
      ],
    })
  }

  const onSubmit = async (data: Omit<z.infer<typeof SurveySchema>, 'id'>) => {
    const newData = {
      ...data,
      totalQuestions: data.questions.length,
    }
    const result = await createFullSurvey(newData)
    if (result.error) {
      toast.error(result.data)
    } else {
      toast.success(`Survey created successfully`)
      dispatch(createNewSurvey({ isCreateNewSurvey: false }))
      form.reset()
    }
  }

  const onError = (error: any) => {
    console.log(error)
  }

  return (
    <>
      <Button
        variant="secondary"
        type="button"
        onClick={() => {
          dispatch(createNewSurvey({ isCreateNewSurvey: false }))
        }}
        className="w-fit">
        <ChevronLeft /> Back to survey
      </Button>
      <div className="h-full relative">
        {isLoading && (
          <div className="fixed z-10 inset-0 size-full backdrop-blur bg-white/10 flex justify-center items-center">
            <Loader size={50} className="animate-spin text-primary" />
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)}>
            <div className="w-full flex lg:flex-row flex-col gap-4 justify-between items-center">
              <div className="w-full flex flex-col space-y-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel className="text-base">
                        Title <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Type here"
                          autoFocus
                          {...field}
                          className="font-medium focus-visible:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full flex gap-4 md:flex-row flex-col lg:justify-end">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        Start Date <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <DateTimePicker
                          value={new Date(field.value)}
                          onChange={field.onChange}
                          placeholder="Pick a date"
                          className="w-full lg:w-[240px] pl-3 text-left font-normal"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        Due Date <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <DateTimePicker
                          value={new Date(field.value)}
                          onChange={field.onChange}
                          placeholder="Pick a date"
                          className="w-full lg:w-[240px] pl-3 text-left font-normal"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Separator className="my-4" />
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
              {fields.map((field, index) => (
                <QuestionItem
                  key={field.id}
                  control={form.control}
                  questionIndex={index}
                  removeQuestion={remove}
                />
              ))}
            </div>
            <Separator className="my-4" />
            <div className="w-full flex justify-between items-center">
              <Button
                type="button"
                variant="default"
                className="w-fit"
                onClick={() => appendQuestion()}>
                + Add new question
              </Button>
              <Button type="submit" variant="destructive" className="w-fit">
                Create survey
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}

export default SurveyCreate
