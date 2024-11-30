import { useGetSurveyByIdQuery } from '@/features/survey/surveySlice'
import { useNavigate, useParams } from 'react-router-dom'
import SurveyForm from './components/survey-form'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'

const SurveyDoingForm = () => {
  const navigate = useNavigate()
  const params = useParams()
  const {
    data: survey,
    isLoading,
    isFetching,
  } = useGetSurveyByIdQuery(params?.id as string, {
    skip: !params?.id,
  })
  return (
    <div className="p-4 flex flex-col gap-4">
      <Button
        onClick={() => navigate('/surveys')}
        className="w-fit gap-2"
        variant={'ghost'}>
        <ChevronLeft />
        Back to survey list
      </Button>
      <h1 className="text-xl font-semibold text-center">{survey?.title}</h1>
      {isLoading || isFetching ? (
        <p>Loading...</p>
      ) : (
        <SurveyForm survey={survey} />
      )}
    </div>
  )
}

export default SurveyDoingForm
