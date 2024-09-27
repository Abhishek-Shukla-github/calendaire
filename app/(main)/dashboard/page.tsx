"use client"
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useUser } from '@clerk/nextjs'
import React, {useEffect} from 'react';
import { usernameSchema } from '@/lib/validators'
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import useFetch from '@/hooks/useFetch'
import { updateUsername } from '@/actions/user'
import { Loader2 } from 'lucide-react'
import { BarLoader } from 'react-spinners'

const Dashboard = () => {
  const {isLoaded, user} = useUser();

  const {register, handleSubmit, setValue, formState:{errors}} = useForm({
    resolver: zodResolver(usernameSchema)
  })

  const onSubmit= (data) => {
    fnUpdateUsername(data.username)
  }

  useEffect(() => {
    setValue("username", user?.username)
  },[isLoaded])

  const {loading, data,error, fn: fnUpdateUsername} = useFetch(updateUsername)



  return (
    <main className='space-y-8'>
      <Card>
        <CardHeader>
          <CardTitle>Bonjour, {user?.firstName} !</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Unique Link</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div>
              <div className='flex items-center gap-2'>
                <span>{window?.location.origin}/</span>
                <Input {...register("username")} placeholder='Enter Username' />
              </div>
              {errors.username && <p className='text-red-500 text-sm mt-1'>{errors.username.message}</p>}
            </div>
            <p>{loading && <BarLoader className='mb-4' width={"100%"}/>}</p>
            <Button type='submit'>Update Username</Button>
          </form>
        </CardContent>
        </Card>
    </main>
  )
}

export default Dashboard