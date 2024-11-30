import PieChartItem from '@/components/chart/PieChartItem'
import Overlay from '@/components/overlay/Overlay'
import { Button } from '@/components/ui/button'
import { ChartConfig } from '@/components/ui/chart'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { useGetSurveyStatisticsQuery } from '@/features/survey/surveySlice'
import { Answer, OtherAnswer } from '@/schema/survey.validate'
import { X } from 'lucide-react'

interface StatisticsSurveyProps {
  surveyId?: number
  showStatistics: boolean
  setShowStatistics: (value: boolean) => void
}

const StatisticsSurvey = ({
  surveyId,
  showStatistics,
  setShowStatistics,
}: StatisticsSurveyProps) => {
  const {
    data: surveyStat,
    isLoading,
    isFetching,
  } = useGetSurveyStatisticsQuery(surveyId)

  console.log(surveyStat)
  const transformSurveyData = (
    answers?: Answer[],
    otherAnswers?: OtherAnswer[],
  ) => {
    const newAnswers = answers?.map((answer, index) => {
      return {
        content: answer.content,
        totalSelectOnEach: answer.count,
        fill: `hsl(var(--chart-${index + 1}))`,
      }
    })
    const newOtherAnswers = otherAnswers?.map((answer) => {
      return {
        content: answer.content,
        totalSelectOnEach: otherAnswers.length,
        fill: `hsl(var(--chart-5))`,
      }
    })
    return [...(newAnswers || []), ...(newOtherAnswers || [])]
  }

  const transformChartConfig = (
    answers?: Answer[],
    otherAnswers?: OtherAnswer[],
  ): ChartConfig => {
    return [...(answers || []), ...(otherAnswers || [])].reduce(
      (config, answer, index) => {
        const isOtherAnswer = otherAnswers?.includes(answer as OtherAnswer)
        config[answer.content] = {
          label: answer.content,
          color: isOtherAnswer
            ? `hsl(var(--chart-5))`
            : `hsl(var(--chart-${index + 1}))`,
        }
        return config
      },
      {} as ChartConfig,
    )
  }
  return (
    <Overlay>
      <div className="xl:max-w-7xl lg:min-w-[1000px] xl:min-w-[1200px] bg-white rounded-md flex flex-col space-y-2">
        <div className="w-full flex justify-between items-center px-6 pt-4">
          <h1 className="font-medium text-lg">{surveyStat?.survey.title}</h1>
          <Button
            type="button"
            onClick={() => setShowStatistics(false)}
            variant={'ghost'}
            size={'icon'}>
            <X />
          </Button>
        </div>
        <Separator />
        <div className="p-6 pt-4 flex flex-col space-y-4">
          <div className="w-full grid grid-cols-2 grid-rows-2 divide-x divide-y divide-black">
            <p className="row-start-1 col-start-1 text-muted-foreground p-2 border-l border-black border-t">
              Start Date:{' '}
              <span className="font-medium text-black">
                {' '}
                {surveyStat?.survey.startDate &&
                  new Date(surveyStat.survey.startDate).toLocaleDateString(
                    'vi-VN',
                    {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false,
                    },
                  )}
              </span>
            </p>
            <p className="row-start-2 col-start-1 text-muted-foreground p-2 !border-b border-black">
              End Date:{' '}
              <span className="font-medium text-black">
                {' '}
                {surveyStat?.survey?.endDate &&
                  new Date(surveyStat.survey.endDate).toLocaleDateString(
                    'vi-VN',
                    {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false,
                    },
                  )}
              </span>
            </p>
            <p className="col-start-2 row-start-1 text-muted-foreground p-2 !border-r border-black	">
              Number of questions:{' '}
              <span className="font-medium text-black">
                {surveyStat?.survey.totalQuestions}
              </span>
            </p>
            <p className="col-start-2 row-start-2 text-muted-foreground p-2 !border-r !border-b border-black	">
              Number of participants:{' '}
              <span className="font-medium text-black">
                {surveyStat?.totalParticipants}
              </span>
            </p>
          </div>
          <div className="w-full lg:h-[650px] flex flex-col gap-4 overflow-y-auto overflow-x-hidden">
            {surveyStat &&
              surveyStat?.questions.map((item, index) => (
                <div
                  key={index}
                  className="p-4 border border-black w-full flex justify-between">
                  <div className="md:w-3/5 w-full flex flex-col space-y-1">
                    <h3 className="font-semibold text-xl">
                      Question {index + 1}
                    </h3>
                    <p className="text-black">{item.questionContent}</p>
                    <div className="flex flex-col space-y-2">
                      {item.answers.map((answer, index) => (
                        <div key={index} className="flex flex-col space-y-1">
                          <div
                            className="w-auto text-nowrap font-medium"
                            style={{
                              color: `hsl(var(--chart-${index + 1}))`,
                            }}>
                            {answer.content}
                          </div>
                          <Progress
                            className="h-3 bg-zinc-200"
                            backgroundColorIndicator={`hsl(var(--chart-${
                              index + 1
                            }))`}
                            value={Math.floor(
                              (answer.count / surveyStat.totalParticipants) *
                                100,
                            )}
                          />
                        </div>
                      ))}
                      {item.otherAnswers?.map((answer, index) => (
                        <div key={index} className="flex flex-col space-y-1">
                          <div
                            className="w-auto text-nowrap font-medium"
                            style={{
                              color: `hsl(var(--chart-${index + 1}))`,
                            }}>
                            {answer.content}
                          </div>
                          <Progress
                            className="h-3 bg-zinc-200"
                            backgroundColorIndicator={`hsl(var(--chart-${
                              index + 1
                            }))`}
                            value={Math.floor(
                              (item.otherAnswers.length /
                                surveyStat.totalParticipants) *
                                100,
                            )}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="w-2/5 md:flex hidden justify-center">
                    <PieChartItem
                      key={index}
                      chartConfigData={transformChartConfig(
                        surveyStat?.questions[index].answers,
                        surveyStat?.questions[index].otherAnswers,
                      )}
                      data={transformSurveyData(
                        surveyStat?.questions[index].answers,
                        surveyStat?.questions[index].otherAnswers,
                      )}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Overlay>
  )
}

export default StatisticsSurvey
