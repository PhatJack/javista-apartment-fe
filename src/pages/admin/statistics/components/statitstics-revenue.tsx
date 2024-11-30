import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from 'recharts'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Statistic } from '@/schema/statistic.validate'

interface StatisticsRevenueProps {
  data?: Statistic[]
  chartConfigData: any
}

const StatisticsRevenue = ({ data, chartConfigData }: StatisticsRevenueProps) => {
	const chartConfig: ChartConfig = {
    ...chartConfigData,
  }
  return (
    <div className="size-[65%]">
      <ChartContainer config={chartConfig}>
        <BarChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
						fontSize={16}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
						tickFormatter={(value) => chartConfig['revenue']?.label || value}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Bar
            dataKey="revenue"
            strokeWidth={2}
            radius={8}
            activeIndex={2}
            activeBar={({ ...props }) => {
              return (
                <Rectangle
                  {...props}
                  fillOpacity={0.8}
                  stroke={props.payload.fill}
                  strokeDasharray={4}
                  strokeDashoffset={4}
                />
              )
            }}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}

export default StatisticsRevenue
