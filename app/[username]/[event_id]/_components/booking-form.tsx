"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createBooking } from "@/actions/bookings";
import { bookingSchema } from "@/lib/validators";
import { useUser } from "@clerk/nextjs";
import "react-day-picker/style.css";
import useFetch from "@/hooks/useFetch";
import { Calendar, CheckCircle2Icon, Clock } from "lucide-react";
import { PersonIcon } from "@radix-ui/react-icons";

export default function BookingForm({ event, availability }) {
  const { user} = useUser();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(bookingSchema),
  });

  useEffect(() => {
    if (selectedDate) {
      setValue("date", format(selectedDate, "yyyy-MM-dd"));
    }
  }, [selectedDate, setValue]);

  useEffect(() => {
    if (selectedTime) {
      setValue("time", selectedTime);
    }
  }, [selectedTime, setValue]);

  const { loading, data, fn: fnCreateBooking } = useFetch(createBooking);

  const onSubmit = async (data) => {
    console.log("Form submitted with data:", data);

    if (!selectedDate || !selectedTime) {
      console.error("Date or time not selected");
      return;
    }
    const startTime = new Date(
      `${format(selectedDate, "yyyy-MM-dd")}T${selectedTime}`
    );
    const endTime = new Date(startTime.getTime() + event.duration * 60000);
    const bookingData = {
      eventId: event.id,
      name: data.name,
      email: data.email,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      additionalInfo: data.additionalInfo,
    };

    await fnCreateBooking(bookingData);
  };

  // const availableDays = availability.map((day) => new Date(day.date));
  const availableDays = availability.map(day => {
    // Create a date in the local timezone by adding the time component
    const localDate = new Date(day.date + 'T00:00:00'); // Set to midnight local time
    return localDate;
});

  const timeSlots = selectedDate
    ? availability.find(
        (day) => day.date === format(selectedDate, "yyyy-MM-dd")
      )?.slots || []
    : [];

  if (Object.keys(data).length > 0) {
    return (
      <div className="p-10 border bg-white">
        <h2 className="text-2xl font-bold">Meet Scheduled!</h2>
        {data.meetLink && (
          <div>
            <p>Find the details below: </p>
            <div className="flex items-center flex-col justify-start mt-2">
              <div className="flex items-center mb-2 mt-2 w-full">
                <CheckCircle2Icon className="w-8 h-8 mr-1" />
                <p className="font-semibold text-gray-600 mr-1">With: </p>
                <h2 className="text-blue-600 font-bold">
                  <a
                    href={`${window?.location.origin}/${user?.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >{user?.firstName} {user?.lastName}</a>
                </h2>
              </div>
              <div className="flex items-center mb-1 w-full">
                <Clock className="w-8 h-8 mr-1"/>
                <p className="font-semibold text-gray-600">{format(data.booking.startTime, "eee MMM dd")} at {format(data.booking.startTime, 'HH:mm')}</p>
              </div>
              <div className="flex items-center mb-2 w-full">
                <PersonIcon className="w-8 h-8 mr-1"/>
                <p className="font-semibold text-gray-600">Meet Link:
                  <a
                    href={data.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  > {data.meetLink}</a>
                </p>
              </div>
              <div className="flex items-center mb-2 w-full">
                <Calendar className="w-8 h-8 mr-1"/>
                <p className="font-semibold text-gray-600">Meet is also added in your Google Calendar</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-10 border bg-white">
      <div className="md:h-96 flex flex-col md:flex-row gap-5 ">
        <div className="w-full">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              setSelectedTime(null); // Reset selected time when date changes
            }}
            disabled={[{ before: new Date() }]}
            modifiers={{ available: availableDays }}
            modifiersStyles={{
              available: {
                background: "lightblue",
                borderRadius: 100,
              },
            }}
          />
        </div>
        <div className="w-full h-full md:overflow-scroll no-scrollbar">
          {/* add hide scroll bar code */}
          {selectedDate && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">
                Available Time Slots
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot}
                    variant={selectedTime === slot ? "default" : "outline"}
                    onClick={() => setSelectedTime(slot)}
                  >
                    {slot}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {selectedTime && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input {...register("name")} placeholder="Your Name" />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Input
              {...register("email")}
              type="email"
              placeholder="Your Email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div>
            <Textarea
              {...register("additionalInfo")}
              placeholder="Additional Information"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Scheduling..." : "Schedule Event"}
          </Button>
        </form>
      )}
    </div>
  );
}