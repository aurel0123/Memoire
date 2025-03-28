import React from 'react'
import { Button } from '@/components/ui/button'
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

export default function LandingPage() {
  return (
    <div>
    <Toaster variant="destructive"/>
       <Button
      variant="outline"
      onClick={() =>
        toast("Event has been created", {
          description: "Sunday, December 03, 2023 at 9:00 AM",
          variant: "destructive",
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        })
      }
    >
      Show Toast
    </Button>
    </div>
  )
}
