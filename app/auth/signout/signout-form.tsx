"use client"

import { Button } from "@/components/ui/button"
import { LogOut, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export function SignOutForm() {
  const router = useRouter()

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="flex gap-4">
      <Button
        onClick={handleCancel}
        variant="outline"
        className="flex-1 bg-card hover:bg-card/80 text-card-foreground border-border hover:shadow-md transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Cancel
      </Button>
      <form action="/api/auth/signout" method="POST" className="flex-1">
        <Button
          type="submit"
          className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </form>
    </div>
  )
}
