"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => router.back()}
      className="flex items-center mb-4"
    >
      <ChevronLeft className="mr-1 h-4 w-4" />
      Back
    </Button>
  );
}

