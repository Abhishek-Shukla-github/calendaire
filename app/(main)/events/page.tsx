import { getUserEvents } from '@/actions/events'
import EventCard from '@/components/event-card';
import { ServerEventType } from '@/types/types';
import { Suspense } from 'react';
import { MoonLoader } from 'react-spinners';

export default function EventsPage(){
  return (
    <Suspense fallback={<MoonLoader color="#2563eb" />}>
      <Events />
    </Suspense>
  )
}

const Events = async () => {
  
  const {events, username} = await getUserEvents();

  if(events.length === 0){
    return <>
      <p>You have no events currently</p>
    </>
  }
  console.log("events",events)

  return (
    <div className='grid gap-4 grid-cols-1 lg:grid-cols-4'>
        {events?.map((event: ServerEventType) => (
          <EventCard key={event.id} event={event} username={username} />
        ))}
    </div>
  )
}