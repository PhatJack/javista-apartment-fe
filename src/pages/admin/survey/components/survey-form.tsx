import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import QuestionItem from './question-item'
import { ChevronLeft, Loader } from 'lucide-react'
import { useUpdateSurveryMutation } from '@/features/survey/surveySlice'
import { DateTimePicker } from '@/components/ui/datetime-picker'
import { SurveySchema } from '@/schema/survey.validate'
import { useNavigate } from 'react-router-dom'

// Define prop types for the component
interface SurveyFormProps {
  mode: 'create' | 'edit'
  initialData?: z.infer<typeof SurveySchema>
}

const SurveyForm = ({ mode = 'create', initialData }: SurveyFormProps) => {
  const navigate = useNavigate()
  const [updateSurvey, { isLoading: isLoadingUpdate }] =
    useUpdateSurveryMutation()

  const form = useForm<z.infer<typeof SurveySchema>>({
    defaultValues: initialData,
    resolver: zodResolver(SurveySchema),
  })

  // Initialize form with initial data when in edit mode
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      console.log(initialData)
      form.reset(initialData)
    }
  }, [initialData, mode, form])

  const { fields, append, remove } = useFieldArray({
    name: 'questions',
    control: form.control,
  })

  const appendQuestion = () => {
    append({
      surveyId: initialData?.id, // or any appropriate surveyId
      content: '',
      answers: [
        {
          content: '',
        },
      ],
    })
  }

  const onSubmit = async (data: z.infer<typeof SurveySchema>) => {
    const {id, questions,...rest} = data
    const result = await updateSurvey({ id: initialData?.id, body: rest })
    if (result.error) {
      toast.error(result.data)
    } else {
      console.log(data)
      toast.success(`Survey updated successfully`)
      navigate('/admin/surveys')
    }
  }


  const onError = (error: any) => {
    console.log(error)
  }

  return (
    <>
      <Button
        variant="ghost"
        type="button"
        onClick={() => {
          navigate('/admin/surveys')
        }}
        className="w-fit px-0">
        <ChevronLeft /> Back to survey
      </Button>
      <Card className="h-full relative">
        {isLoadingUpdate && (
          <div className="fixed z-10 inset-0 size-full backdrop-blur bg-white/10 flex justify-center items-center">
            <Loader size={50} className="animate-spin text-primary" />
          </div>
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="size-full">
            <CardHeader className="space-y-2 sticky top-0">
              <div className="w-full flex lg:flex-row flex-col gap-4 justify-between items-center">
                <div className="w-full flex flex-col space-y-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormLabel className="text-base">Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Type here"
                            autoFocus
                            {...field}
                            className="border-none shadow-none focus-visible:ring-0 p-0 text-xl font-bold"
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
                        <FormLabel>Start Date</FormLabel>
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
                        <FormLabel>Due Date</FormLabel>
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
            </CardHeader>
            <Separator />
            <CardContent className="pt-6 flex flex-col space-y-4">
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
              <div className="w-full flex justify-between items-center">
                <Button
                  type="button"
                  variant="default"
                  className="w-fit"
                  onClick={() => appendQuestion()}>
                  + Add new question
                </Button>
                <Button type="submit" variant="destructive" className="w-fit">
                  {mode === 'create' ? 'Save survey' : 'Update survey'}
                </Button>
              </div>
            </CardContent>
          </form>
        </Form>
      </Card>
    </>
  )
}

export default SurveyForm
