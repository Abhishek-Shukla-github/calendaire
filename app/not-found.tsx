import Image from 'next/image'
import React from 'react'

const NotFound = () => {
  return (
    <main className='container mx-auto px-4 py-16 flex flex-col justify-center items-center'>
        <h1 className='text-7xl gradient-title pb-4 mb-4'>Page not found!</h1>
        <div className='w-2/4 h-2/4 max-w-md aspect-square relative'>
            <Image alt='404 illustration' src={"/404.jpg"} layout="fill" objectFit="contain"/>
        </div>
    </main>
  )
}

export default NotFound