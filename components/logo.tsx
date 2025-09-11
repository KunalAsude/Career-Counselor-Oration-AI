import Link from "next/link"
import { Brain, Briefcase } from "lucide-react"

interface LogoProps {
  className?: string
  showText?: boolean
  size?: "sm" | "md" | "lg"
}

export function Logo({ className = "", showText = true, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
  }

  return (
    <Link href="/" className={`flex items-center space-x-2 ${className}`}>
      <div className="relative">
        <div
          className={`${sizeClasses[size]} bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center`}
        >
          <Brain className={`${size === "lg" ? "h-7 w-7" : size === "md" ? "h-5 w-5" : "h-4 w-4"} text-white`} />
        </div>
        <Briefcase
          className={`absolute -bottom-1 -right-1 ${size === "lg" ? "h-4 w-4" : "h-3 w-3"} text-emerald-600`}
        />
      </div>
      {showText && (
        <span
          className={`font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent ${textSizeClasses[size]}`}
        >
          CareerAI
        </span>
      )}
    </Link>
  )
}
