"use client";

import { deleteUserEvent } from "@/actions/events";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useFetch from "@/hooks/useFetch";
import { showToast } from "@/lib/toast";
import { ServerEventType } from "@/types/types";
import { Link, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type propType = {
  event: ServerEventType,
  username: string,
  isPublic?: boolean
}

export default function EventCard({ event, username, isPublic = false }:propType) {
  const [isCopied, setIsCopied] = useState(false);
  const router = useRouter();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window?.location.origin}/${username}/${event.id}`
      );
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
      showToast("","Event link copied")
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const { loading, fn: fnDeleteEvent } = useFetch(deleteUserEvent);

  const handleDelete = async () => {
    if (window?.confirm("Are you sure you want to delete this event?")) {
      await fnDeleteEvent(event.id);
      router.refresh();
      showToast("","Event deleted successfully")
    }
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as Element
    if (target.tagName !== "BUTTON" && target.tagName !== "SVG") {
      window?.open(
        `${window?.location.origin}/${username}/${event.id}`,
        "_blank"
      );
    }
  };

  return (
    <Card
      className="flex flex-col justify-between cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader>
        <CardTitle className="text-2xl">{event.title}</CardTitle>
        <CardDescription className="flex justify-between">
          <span>
            {event.duration} mins | {event.isPrivate ? "Private" : "Public"}
          </span>
          <span>{event._count.bookings} Bookings</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{event.description.substring(0, event.description.indexOf("."))}.</p>
      </CardContent>
      {!isPublic && (
        <CardFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCopy}
            className="flex items-center"
          >
            <Link className="mr-2 h-4 w-4" />
            {isCopied ? "Copied!" : "Copy Link"}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
