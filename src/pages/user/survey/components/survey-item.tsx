import { Button } from '@/components/ui/button'
import { ISurvey } from '@/schema/survey.validate'
import { AlarmClock, Clock } from 'lucide-react'
import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
interface SurveyItemProps {
  survey: ISurvey
}

const SurveyItem = ({ survey }: SurveyItemProps) => {
  const navigate = useNavigate()

  const handleChooseSurvey = () => {

		if(new Date(survey.startDate) > new Date()) {
			toast.info("This survey hasn't started yet!")
			return;
		}

    //if end date is less than current date => show toast
    if (new Date(survey.endDate) < new Date()) {
      toast.error('This survey has ended')
      return
    }
    navigate(`/surveys/${survey.id}`)
  }

  return (
    <div className="w-full h-fit p-4 rounded-md border flex flex-col gap-4">
      <div className="w-full grid grid-cols-2 md:grid-cols-3">
        <section className="w-full space-y-0.5 font-medium">
          <h1>{survey.title}</h1>
          <p className="text-sm text-muted-foreground">
            Total Questions: <span>{survey.totalQuestions}</span>
          </p>
        </section>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
          <section className="w-full flex gap-2">
            <span className="w-16 inline-flex rounded-sm bg-zinc-100 justify-center items-center">
              <Clock />
            </span>
            <div className="w-full flex flex-col">
              <p className="text-sm font-medium text-zinc-500">Start Date</p>
              <p className="whitespace-nowrap text-sm font-medium">
                {new Date(survey.startDate).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false,
                })}
              </p>
            </div>
          </section>
          <section className="w-full flex gap-2">
            <span className="w-16 inline-flex rounded-sm bg-zinc-100 justify-center items-center">
              <AlarmClock />
            </span>
            <div className="w-full flex flex-col">
              <p className="text-sm font-medium text-zinc-500">Due Date</p>
              <p className="whitespace-nowrap text-sm font-medium">
                {new Date(survey.endDate).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false,
                })}
              </p>
            </div>
          </section>
        </div>
      </div>
      <div className="w-full flex gap-4">
        <Button onClick={() => handleChooseSurvey()} type="button">
          Start
        </Button>
      </div>
    </div>
  )
}

export default memo(SurveyItem)
