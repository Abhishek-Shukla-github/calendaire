import { Suspense } from 'react';

type propType = {
    children: React.ReactNode
}

export default function AvailabilityLayout({children}: propType){
  return (
    <Suspense fallback={<h3>Loading....</h3>}>
      {children}
    </Suspense>
  )
}