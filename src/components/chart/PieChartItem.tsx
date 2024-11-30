import { Pie, PieChart } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

interface PiechartItemProps {
  data?: any[]
  chartConfigData: any
}

const PiechartItem = ({ data, chartConfigData }: PiechartItemProps) => {
  const chartConfig: ChartConfig = {
    totalSelectOnEach: { label: 'Total Select' },
    ...chartConfigData,
  }
	// console.log(chartConfig)
	console.log(data)
  return (
    <Card className="flex flex-col shadow-none border-none bg-transparent">
      <CardHeader className="items-center pb-0 pt-3">
        <CardTitle className="text-lg">Answer Distribution</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square min-h-[330px] max-h-[330px]">
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="content" hideLabel />}
            />
            <Pie data={data} dataKey="totalSelectOnEach" />
            <ChartLegend
              content={<ChartLegendContent nameKey="content" />}
              className="-translate-y-2 flex-col gap-1 [&>*]:basis-1/4 [&>*]:justify-start items-start text-sm"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
export default PiechartItem
