import { getUserMeetings } from '@/actions/meetings';
import { Chart } from '@/components/chart';
import React, { Suspense } from 'react'
import { MoonLoader } from 'react-spinners';
import { format, parse, parseISO, subMonths } from "date-fns"
import { MeetingType } from '@/types/types';

export default async function AnalyticsPage() {
  return (
    <div>
        <Suspense fallback={<MoonLoader color="#2563eb" />}>
          <AnaylticsData />
        </Suspense>
    </div>
  )
}


const initChartData = {
    January: 0,
    February: 0,
    March: 0,
    April: 0,
    May: 0,
    June: 0,
    July: 0,
    August: 0,
    September: 0,
    October: 0,
    November: 0,
    December: 0,
  };


  const transformData = (meetings: MeetingType[]) => {
    let res = [], delta;
    meetings.forEach((meeting: MeetingType) => {
      const dateString = meeting.startTime;
      const isoString = new Date(dateString).toISOString();
      const fullMonth = format(parseISO(isoString), 'MMMM');
      const monthDate = parse(fullMonth, 'MMMM', new Date());
      const prevMonthDate = subMonths(monthDate, 1);
      const prevMonth = format(prevMonthDate, 'MMMM');

      initChartData[fullMonth]+=1
      delta = initChartData[fullMonth] - initChartData[prevMonth]
      res = Object.keys(initChartData).map(month => {
        return {
            month: month,
            count: initChartData[month]
        }
      })
    })
    return {res: res,  delta: delta}
}

async function AnaylticsData() {
    const meetings = await getUserMeetings("past");
    const {res : chartData, delta} =  transformData(meetings)
    return <Chart chartData={chartData} delta={delta}/>;
}