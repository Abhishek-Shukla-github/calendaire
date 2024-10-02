import { Suspense } from 'react';
import { MoonLoader } from 'react-spinners';

type propType = {
    children: React.ReactNode
}

export default function AvailabilityLayout({children}: propType){
  return (
    <Suspense fallback={<MoonLoader color="#2563eb" />}>
      {children}
    </Suspense>
  )
}