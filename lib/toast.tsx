// toastUtil.ts
import { CheckIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "./utils";

export const showToast = (message: string, title: string = 'Scheduled: Catch up') => {
  toast({
    title: (
      <h2 className="flex items-center gap-1 text-md">
        <CheckIcon color="#2563eb"  />
        {title}
      </h2>
    ),
    description: message, // Optional: add a description if needed
    style: { width: "fit-content", background: "#eff6ff" },
    className: cn(
      'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4'
    ),
    duration: 3000
  });
};