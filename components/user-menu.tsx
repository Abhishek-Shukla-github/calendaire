"use client"

import { UserButton } from '@clerk/nextjs'
import { ChartNoAxesGanttIcon } from 'lucide-react'
import React from 'react'

const UserMenu = () => {
  return (
    <UserButton
        appearance={{
            elements: {
                userButtonAvatarBox: "w-10 h-10", 
                avatarBox: "w-10 h-10" 
            }
        }}
    >
        <UserButton.MenuItems>
            <UserButton.Link
                label='My Events'
                labelIcon={<ChartNoAxesGanttIcon size={15} />}
                href="/events"
            />
            <UserButton.Action label='manageAccount' />
        </UserButton.MenuItems>
    </UserButton>
  )
}

export default UserMenu