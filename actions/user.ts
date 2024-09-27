"use server"

import { db } from "@/lib/prisma"
import { auth, clerkClient } from "@clerk/nextjs/server"

export async function updateUsername(username: string){
    const {userId} = auth();
    if(!userId){
        throw new Error("Unauthorized")
    }

    const existingUsername = await db.user.findUnique({
        where: {username}
    })

     if(existingUsername && existingUsername.id !== userId){
        throw new Error("Username is already taken")
     }

     await db.user.update({
        where:{clerkUserId: userId},
        data:{username:username}
     })

     await clerkClient.users.updateUser(userId,{
        username
     });
    
     return {success: true}
}