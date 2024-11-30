import AlertDelete from '@/components/alert/AlertDelete'
import { Button } from '@/components/ui/button'
import { useDeleteSurveyMutation } from '@/features/survey/surveySlice'
import { ISurvey } from '@/schema/survey.validate'
import { AlarmClock, ChartBarBig, Clock } from 'lucide-react'
import { memo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import StatisticsSurvey from '../statistics/statistics-survey'

interface SurveyItemProps {
  survey: ISurvey
}

const SurveyItem = ({ survey }: SurveyItemProps) => {
  const [showStatistics, setShowStatistics] = useState<boolean>(false)
  const [deleteSurvey, { isLoading }] = useDeleteSurveyMutation()
  const navigate = useNavigate()
  const handleDelete = async () => {
    await deleteSurvey(survey?.id)
      .unwrap()
      .then(() => {
        toast.success('Survey deleted successfully')
      })
      .catch((err) => {
        toast.error(err.error.message)
      })
  }

  const handleShowStatistics = (startDate: Date) => {
    if (new Date(startDate) > new Date()) {
      toast.error('Survey is not started yet')
      return
    }
    setShowStatistics(true)
  }

  const handleEditSurvey = (startDate: Date) => {
    // if (new Date(startDate) < new Date()) {
    //   toast.error('Survey is started, you cannot edit it')
    //   return
    // }
    navigate(`/admin/surveys/${survey.id}`)
  }

  return (
    <>
      <div className="w-full h-auto p-4 rounded-md border flex flex-col gap-4">
        <div className="w-full grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-3 min-[400px]:gap-y-0 gap-y-2">
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
          <Button
            onClick={() => handleShowStatistics(survey.startDate)}
            type="button"
            className="gap-2"
            variant={'info'}>
            <ChartBarBig />
            Statistics
          </Button>
          <Button
            onClick={() => handleEditSurvey(survey.startDate)}
            type="button"
            variant={'warning'}>
            Edit
          </Button>
          <AlertDelete
            description="survey"
            setAction={() => handleDelete()}
            isLoading={isLoading}
            variants="error"
          />
        </div>
      </div>
      {showStatistics && (
        <StatisticsSurvey
          surveyId={survey.id}
          showStatistics={showStatistics}
          setShowStatistics={setShowStatistics}
        />
      )}
    </>
  )
}

export default memo(SurveyItem)
