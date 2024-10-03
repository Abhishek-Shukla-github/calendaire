"use client"

import { TrendingDown, TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { MeetingType } from "@/types/types"


export const description = "A linear area chart"
const chartConfig = {
  desktop: {
    label: "Meet Count",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

type PropType = {
  meetings: MeetingType[],
  chartData: {
    January: number,
    February: number,
    March: number,
    April: number,
    May: number,
    June: number,
    July: number,
    August: number,
    September: number,
    October: number,
    November: number,
    December: number,
  },
  delta: number
}

export function Chart({chartData, delta}:PropType) {
  return (
    <div className="w-7/12">
      <Card >
        <CardHeader>
          <CardTitle>Track your analytics</CardTitle>
          <CardDescription>
            Showing total meets scheduled in the year so far
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" hideLabel />}
              />
              <Area
                dataKey="count"
                type="linear"
                fill="rgb(59 130 246 / 0.5)"
                fillOpacity={0.4}
                stroke="#2563eb"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 font-medium leading-none">
                Trending by <span className={`${delta > 0 ? 'text-green-500' : 'text-red-500'}`}>{delta > 0 ? `+${delta} meets` : `-${delta} meets`}</span> this month 
                {delta > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              </div>
              <div className="flex items-center gap-2 leading-none text-muted-foreground">
                {new Date().getFullYear()} Data
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
