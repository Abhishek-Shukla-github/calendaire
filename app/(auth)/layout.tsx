import React from 'react'

type propType = {
    children: React.ReactNode
}

const Layout = ({children}: propType) => {
  return (
    <div className='flex justify-center pt-20'>{children}</div>
  )
}

export default Layout