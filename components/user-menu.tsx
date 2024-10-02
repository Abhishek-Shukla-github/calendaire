"use client"

import { UserButton, useUser } from '@clerk/nextjs'
import { PersonIcon } from '@radix-ui/react-icons'
import { ChartNoAxesGanttIcon } from 'lucide-react'
import React from 'react'

const UserMenu = () => {
    const { user} = useUser();
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
            <UserButton.Link
                label='My Profile'
                labelIcon={<PersonIcon />}
                href={`/${user?.username}`}
            />
            <UserButton.Action label='manageAccount' />
        </UserButton.MenuItems>
    </UserButton>
  )
}

export default UserMenu