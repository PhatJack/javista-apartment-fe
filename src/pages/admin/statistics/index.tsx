import Breadcrumb from '@/components/breadcrumb'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import StatisticsRevenue from './components/statitstics-revenue'
import { useState } from 'react'
import { useStatisticsRevenueQuery } from '@/features/bill/billSlice'
import { useDebounceCallback } from 'usehooks-ts'
import { Statistic } from '@/schema/statistic.validate'
import { ChartConfig } from '@/components/ui/chart'
import { validateDates } from '@/helpers/error-handling'
import { toast } from 'sonner'

const Index = () => {
  const currentYear = new Date().getFullYear()
  const [startDate, setStartDate] = useState<string>(`${currentYear}-01`)
  const [endDate, setEndDate] = useState<string>(`${currentYear}-12`)
  const debounceStartDate = useDebounceCallback((value: string) => {
    if(validateDates(value, endDate)) {
      setStartDate(value)
    }else {
      toast.error('Start date must be less than end date')
    }
  }, 500)
  const debounceEndDate = useDebounceCallback((value: string) => {
    if(validateDates(startDate, value)) {
      setEndDate(value)
    }else {
      toast.error('End date must be greater than start date')
    }
  }, 500)
  const { data, isLoading, isError, isFetching } = useStatisticsRevenueQuery({ startDate, endDate })

  const transformChartData = (data?: Statistic[]) => {
    return data?.map((item, index) => {
      return {
        month: item.month,
        revenue: item.revenue,
        fill: `hsl(var(--chart-${index + 1}))`,
      }
    })
  }
  const transformChartConfig = (data?: Statistic[]): ChartConfig => {
    return (
      data?.reduce((config, item, index) => {
        config[item.month] = {
          label: item.month,
          color: `hsl(var(--chart-${index + 1}))`,
        }
        return config
      }, {} as ChartConfig) || ({} as ChartConfig)
    )
  }
  return (
    <div className="w-full sm:h-screen h-full flex flex-col bg-gray-100">
      <Breadcrumb paths={[{ label: 'statistics', to: '/admin/statistics' }]} />
      <div className="size-full p-4 flex justify-center items-center overflow-hidden">
        <div className="rounded-md bg-white size-full flex flex-col space-y-4 gap-4 p-4">
          <div className="w-full flex justify-between items-center">
            <p className="w-full text-xl font-medium">Total Revenue</p>
            <div className="w-full flex items-center justify-end gap-4">
              <Label>Start Date</Label>
              <Input
                value={startDate}
                onChange={(e) => debounceStartDate(e.target.value)}
                type="month"
                className="w-48 font-medium"
                placeholder="Start Date"
              />
              <Label>End Date</Label>
              <Input
                value={endDate}
                onChange={(e) => debounceEndDate(e.target.value)}
                type="month"
                className="w-48 font-medium"
                placeholder="End Date"
              />
            </div>
          </div>
          <div className="size-full flex justify-center items-center overflow-hidden">
            <StatisticsRevenue
              data={transformChartData(data)}
              chartConfigData={transformChartConfig(data)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
