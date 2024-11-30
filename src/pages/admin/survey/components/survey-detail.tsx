import { useGetSurveyByIdQuery } from '@/features/survey/surveySlice'
import SurveyForm from './survey-form'
import { Loader } from 'lucide-react'

interface ISurveyDetailProps {
  surveyID: string | number
}

const SurveyDetail = ({ surveyID }: ISurveyDetailProps) => {
  const {
    data: detailSurvey,
    isLoading,
    isFetching,
  } = useGetSurveyByIdQuery(surveyID, {
    skip: !surveyID,
  })

  console.log(detailSurvey)
  if (isLoading || isFetching) return <div className='size-full flex justify-center items-center'>
		<Loader size={50} className='animate-spin' />
	</div>
  return <SurveyForm mode="edit" initialData={detailSurvey} />
}

export default SurveyDetail
