import React from "react";
import AvailabilityForm from "./_components/availablility_form";
import { getUserAvailability } from "@/actions/availability";
import { defaultAvailability } from "./data";

export default async function AvailabilityPage() {
  const availability = await getUserAvailability();

  return <AvailabilityForm initialData={availability || defaultAvailability} />;
}
