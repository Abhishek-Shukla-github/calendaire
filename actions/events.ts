"use server"
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { eventSchema } from "@/lib/validators";

export async function createEvent(data) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const validatedData = eventSchema.parse(data);

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const event = await db.event.create({
    data: {
      ...validatedData,
      userId: user.id,
    },
  });

  return event;
}

export async function getUserEvents(){
  const {userId} = auth();

  if(!userId){
    throw new Error("Unauthorized")
  }

  const user = await db.user.findUnique({
    where: {clerkUserId: userId}
  });

  if(!user){
    throw new Error("User not found");
  }

  const events = await db.event.findMany({
    where: {userId: user.id},
    orderBy: {createdAt: "desc"},
    include: {
      _count: {
        select: {bookings: true}
      }
    }
  })
  
  return {events, username: user.username}
}

export async function deleteUserEvent(eventId: string){
  const {userId} = auth();

  if(!userId){
    throw new Error("Unauthorized")
  }

  const user = await db.user.findUnique({
    where: {clerkUserId: userId}
  });

  if(!user){
    throw new Error("User not found");
  }

  const event = await db.event.findUnique({
    where:{id: eventId}
  })

  if(!event){
    throw new Error("Unauthorized event")
  }

  const deleteEvent = await db.event.delete({
    where: {
      id: eventId
    }
  })

  return {deleteEvent}
}

export async function getEventDetails(username: string,eventId: string) {
  const event = await db.event.findFirst({
    where: {
      id: eventId,
      user: {
        username: username,
      },
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          imageUrl: true,
        },
      },
    },
  });

  return event;
}