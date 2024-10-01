"use server";

import { db } from "@/lib/prisma";
import { AvailabilityType, BookingType } from "@/types/types";
import { auth } from "@clerk/nextjs/server";
import {
  startOfDay,
  addDays,
  format,
  parseISO,
  isBefore,
  addMinutes,
} from "date-fns";

export async function getUserAvailability() {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      availability: {
        include: { days: true },
      },
    },
  });

  if (!user || !user.availability) {
    return null;
  }

  // Transform the availability data into the format expected by the form
  const availabilityData: AvailabilityType = {
    timeGap: user.availability.timeGap,
    monday: { isAvailable: false, startTime: "09:00", endTime: "17:00" }, // default values
    tuesday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
    wednesday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
    thursday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
    friday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
    saturday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
    sunday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
  };



  [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ].forEach((day) => {
    const dayAvailability = user.availability.days.find(
      (d: BookingType) => d.day === day.toUpperCase()
    );

    availabilityData[day as keyof AvailabilityType] = {
      isAvailable: !!dayAvailability,
      startTime: dayAvailability
        ? dayAvailability.startTime.toISOString().slice(11, 16)
        : "09:00",
      endTime: dayAvailability
        ? dayAvailability.endTime.toISOString().slice(11, 16)
        : "17:00",
    };
  });

  return availabilityData;
}

export async function updateAvailability(data: AvailabilityType) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { availability: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const availabilityData = Object.entries(data).flatMap(
    ([day, value]) => {
      const { isAvailable, startTime, endTime } = value as { isAvailable: boolean; startTime: string; endTime: string }
      if (isAvailable) {
        const baseDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format

        return [
          {
            day: day.toUpperCase(),
            startTime: new Date(`${baseDate}T${startTime}:00Z`),
            endTime: new Date(`${baseDate}T${endTime}:00Z`),
          },
        ];
      }
      return [];
    }
  );

  if (user.availability) {
    await db.availability.update({
      where: { id: user.availability.id },
      data: {
        timeGap: data.timeGap,
        days: {
          deleteMany: {},
          create: availabilityData,
        },
      },
    });
  } else {
    await db.availability.create({
      data: {
        userId: user.id,
        timeGap: data.timeGap,
        days: {
          create: availabilityData,
        },
      },
    });
  }

  return { success: true };
}

export async function getEventAvailability(eventId: string) {
  const event = await db.event.findUnique({
    where: { id: eventId },
    include: {
      user: {
        include: {
          availability: {
            select: {
              days: true,
              timeGap: true,
            },
          },
          bookings: {
            select: {
              startTime: true,
              endTime: true,
            },
          },
        },
      },
    },
  });

  if (!event || !event.user.availability) {
    return [];
  }

  const { availability, bookings } = event.user;
  const startDate = startOfDay(new Date());
  const endDate = addDays(startDate, 30); // Get availability for the next 30 days

  const availableDates = [];

  for (let date = startDate; date <= endDate; date = addDays(date, 1)) {
    const dayOfWeek = format(date, "EEEE").toUpperCase();
    const dayAvailability = availability?.days?.find(
      (d: BookingType) => d.day === dayOfWeek
    );

    if (dayAvailability) {
      const dateStr = format(date, "yyyy-MM-dd");

      const slots = generateAvailableTimeSlots(
        dayAvailability.startTime,
        dayAvailability.endTime,
        event.duration,
        bookings,
        dateStr,
        availability.timeGap
      );

      availableDates.push({
        date: dateStr,
        slots,
      });
    }
  }

  return availableDates;
}

function generateAvailableTimeSlots(
  startTime: Date,
  endTime: Date,
  duration: number,
  bookings: BookingType[],
  dateStr: string,
  timeGap = 0
) {
  const slots = [];
  let currentTime = parseISO(
    `${dateStr}T${startTime.toISOString().slice(11, 16)}`
  );
  const slotEndTime = parseISO(
    `${dateStr}T${endTime.toISOString().slice(11, 16)}`
  );

  // If the date is today, start from the next available slot after the current time
  const now = new Date();
  if (format(now, "yyyy-MM-dd") === dateStr) {
    currentTime = isBefore(currentTime, now)
      ? addMinutes(now, timeGap)
      : currentTime;
  }

  while (currentTime < slotEndTime) {
    const slotEnd = new Date(currentTime.getTime() + duration * 60000);

    const isSlotAvailable = !bookings.some((booking) => {
      const bookingStart = booking.startTime;
      const bookingEnd = booking.endTime;
      // console.log("booking.endTime",booking.endTime)
      return (
        (currentTime >= bookingStart && currentTime < bookingEnd) ||
        (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
        (currentTime <= bookingStart && slotEnd >= bookingEnd)
      );
    });

    if (isSlotAvailable) {
      slots.push(format(currentTime, "HH:mm"));
    }

    currentTime = slotEnd;
  }

  return slots;
}
