import BreadCrumb from '@/components/breadcrumb'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createNewSurvey, useGetSurverysQuery } from '@/features/survey/surveySlice'
import { RootState, useAppDispatch } from '@/store'
import { Filter, Search } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useDocumentTitle } from 'usehooks-ts'
import { useState } from 'react'
import PaginationCustom from '@/components/pagination/PaginationCustom'
import SurveyDetail from './components/survey-detail'
import SurveyList from './components/survey-list'
import SurveyCreate from './components/survey-create'
import PageSizeSelector from '@/components/table/page-size-selector'
import PaginationInfo from '@/components/table/page-info'

const Index = () => {
  useDocumentTitle('Survey')
  const [pageSize, setPageSize] = useState<number>(10)
  const params = useParams()
  const dispatch = useAppDispatch()
  const isCreateNewSurvey = useSelector((state: RootState) => state.surveyReducer.isCreateNewSurvey)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const { data: surveys, isLoading, isFetching } = useGetSurverysQuery({ page: currentPage })

  return (
    <div
      className={`w-full ${
        isCreateNewSurvey || params.id ? 'h-full' : 'h-full sm:h-screen'
      } flex flex-col bg-zinc-100 `}>
      <BreadCrumb
        paths={[
          { label: 'survey', to: '/admin/survey' },
          ...(params.id ? [{ label: params.id }] : []),
          ...(isCreateNewSurvey ? [{ label: 'New Survey' }] : []),
        ]}
      />
      <div className="w-full h-full p-4 overflow-hidden">
        <div className="w-full h-full bg-white rounded-md p-4 flex flex-col	space-y-2">
          {isCreateNewSurvey ? (
            <SurveyCreate />
          ) : params?.id ? (
            <SurveyDetail surveyID={params?.id} />
          ) : (
            <>
              <div className="w-full h-auto flex sm:flex-row flex-col gap-4 justify-between items-center">
                <div className="w-full flex gap-4 items-center">
                  <div className="sm:w-1/4 w-full flex items-center border px-3 py-0.5 relative rounded-md focus-within:border-primary transition-all">
                    <Search size={20} />
                    <Input
                      placeholder="Search something"
                      className="border-none shadow-none focus-visible:ring-0"
                    />
                  </div>
                  <Button className="gap-1" size={`lg`} variant={'secondary'}>
                    <Filter size={20} />
                    <span className="sm:inline-block hidden">Filter</span>
                  </Button>
                </div>
                <Button
                  onClick={() => dispatch(createNewSurvey({ isCreateNewSurvey: true }))}
                  className={`sm:w-fit w-full`}
                  size={'lg'}
                  variant={'default'}>
                  Create Survey
                </Button>
              </div>
              <div className="size-full overflow-y-auto">
                <SurveyList
                  surveys={surveys?.data}
                  isFetching={isFetching}
                  isLoading={isLoading}
                />
              </div>
              <div className="w-full flex justify-between items-center">
                <PageSizeSelector
                  className="w-full"
                  pageSize={pageSize}
                  onPageSizeChange={setPageSize}
                  setCurrentPage={setCurrentPage}
                />
                <div className="w-full">
                  <PaginationCustom
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    totalPages={surveys?.totalPages}
                  />
                </div>
                <PaginationInfo
                  className="w-full whitespace-nowrap"
                  currentPage={currentPage}
                  pageSize={pageSize}
                  totalElements={surveys?.totalElements}
                  loading={isLoading || isFetching}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Index
