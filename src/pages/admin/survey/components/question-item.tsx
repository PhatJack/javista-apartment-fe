// QuestionItem.tsx
import { Button } from '@/components/ui/button'
import { CircleHelp, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from '@/components/ui/form'
import { useFieldArray, Control } from 'react-hook-form'

interface QuestionItemProps {
  control: Control<any>
  questionIndex: number
  removeQuestion: (index: number) => void
}

const QuestionItem = ({
  control,
  questionIndex,
  removeQuestion,
}: QuestionItemProps) => {
  const {
    fields: answerFields,
    append: appendAnswer,
    remove: removeAnswer,
  } = useFieldArray({
    name: `questions.${questionIndex}.answers`,
    control,
  })

  return (
    <div className="w-full flex flex-col rounded-xl overflow-hidden border shadow-[0px_4px_6px_-2px_rgba(0,_0,_0,_0.1)] animate-in fade-in zoom-in-95">
      <section className="px-4 py-2 bg-[#f8fafc] w-full flex justify-between items-center">
        <div className="flex items-center gap-2">
          <CircleHelp size={20} />
          <h3 className="font-semibold">Question {questionIndex + 1}</h3>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant={'ghost'}
              size={'icon'}
              onClick={() => removeQuestion(questionIndex)}>
              <Trash2 size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>Delete question {questionIndex + 1}</span>
          </TooltipContent>
        </Tooltip>
      </section>
      <Separator />
      <div className="p-4 space-y-4">
        <div className="flex flex-col gap-1.5">
          <FormField
            control={control}
            name={`questions.${questionIndex}.content`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">
                  Question <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="text-base h-10"
                    placeholder="Type here"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <Separator />
        <div className="w-full grid md:grid-cols-2 grid-cols-1 gap-4">
          {answerFields.map((answerField, answersIndex) => (
            <FormField
              key={answerField.id}
              control={control}
              name={`questions.${questionIndex}.answers.${answersIndex}.content`}
              render={({ field }) => (
                <FormItem className="border bg-[#f8fafc] p-2 rounded-md flex items-center gap-2 space-y-0">
                  <FormLabel className="inline-flex size-10 rounded-md justify-center items-center p-1.5 border bg-white text-blue-500 font-semibold">
                    {String.fromCharCode(65 + answersIndex)}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Type the answer here"
                      className="border-none shadow-none focus-visible:ring-0 px-0 text-base placeholder:font-semibold font-semibold"
                    />
                  </FormControl>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button type="button" size={'icon'} variant={'ghost'}>
                        <Trash2
                          size={20}
                          onClick={() => removeAnswer(answersIndex)}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>Delete Answer {String.fromCharCode(65 + answersIndex)}</span>
                    </TooltipContent>
                  </Tooltip>
                </FormItem>
              )}
            />
          ))}
        </div>
        <Button
          type="button"
          variant={'secondary'}
          onClick={() => appendAnswer({ answer: '' })}>
          + Add Answer
        </Button>
      </div>
    </div>
  )
}

export default QuestionItem
