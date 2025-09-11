"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MessageCircle, History, Home, Moon, Sun, Menu } from "lucide-react"
import { useTheme } from "next-themes"
import { useState } from "react"
import { usePathname } from "next/navigation"

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Hide navbar on auth pages
  const isAuthPage = pathname?.startsWith('/auth')

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/chat", label: "Start Chat", icon: MessageCircle },
    { href: "/sessions", label: "Chat History", icon: History },
  ]

  // Don't render navbar on auth pages
  if (isAuthPage) {
    return null
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2 group">
              <MessageCircle className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                CareerAI
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors group"
                >
                  <Icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 hover:bg-accent transition-colors"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden h-9 w-9 hover:bg-accent">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background border-border">
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="flex items-center space-x-2 mb-6">
                    <MessageCircle className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold text-foreground">CareerAI</span>
                  </div>
                  {navItems.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 text-foreground hover:text-primary transition-colors p-3 rounded-lg hover:bg-accent"
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-lg">{label}</span>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
