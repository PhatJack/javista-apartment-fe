import { Skeleton } from '@/components/ui/skeleton'
import SurveyItem from './survey-item'
import { ISurvey } from '@/schema/survey.validate'

interface SurveyListUserProps {
  surveys?: ISurvey[]
  isLoading?: boolean
  isFetching?: boolean
}

const SurveyListUser = ({ isFetching, isLoading, surveys }: SurveyListUserProps) => {
  return (
    <div className="w-full h-full overflow-hidden">
      <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-4">
        {isLoading || isFetching
          ? Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={index} className="w-full h-[150px]" />
            ))
          : surveys?.map((survey) => <SurveyItem key={survey.id} survey={survey} />)}
      </div>
    </div>
  )
}

export default SurveyListUser
