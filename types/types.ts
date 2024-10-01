export type MeetingType = {
    id: string,
    eventId: string,
    userId: string,
    name: string,
    email: string,
    additionalInfo: string,
    startTime: string,
    endTime: string,
    meetLink: string,
    googleEventId: string,
    createdAt: string,
    updatedAt: string,
    event: {
        title: string
    }
}

export type AvailabilityType = {
    monday: {
        isAvailable: boolean,
        startTime: string,
        endTime: string
    },
    tuesday: {
        isAvailable: boolean,
        startTime: string,
        endTime: string
    },
    wednesday: {
        isAvailable: boolean,
        startTime: string,
        endTime: string
    },
    thursday: {
        isAvailable: boolean,
        startTime: string,
        endTime: string
    },
    friday: {
        isAvailable: boolean,
        startTime: string,
        endTime: string
    },
    saturday: {
        isAvailable: boolean,
        startTime: string,
        endTime: string
    },
    sunday: {
        isAvailable: boolean,
        startTime: string,
        endTime: string
    },
    timeGap: number
}

export type BookingType =  {
    id: string,
    availabilityId: string,
    day: string,
    startTime: Date,
    endTime: Date
  }

export type ClientBookingType = {
    eventId: string,
    name: string,
    email: string,
    startTime: Date,
    endTime: Date,
    additionalInfo: string,
}

export type ClientEventType = {
    title: string,
    description: string,
    duration: number,
    isPrivate: boolean,
}

export type ServerEventType = {
    id: string,
    title: string,
    description: string,
    duration: number,
    userId: string,
    isPrivate: boolean,
    createdAt: Date,
    updatedAt: Date,
    _count: { bookings: number}
}