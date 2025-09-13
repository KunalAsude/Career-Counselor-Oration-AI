"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MessageCircle, History, Home, Moon, Sun, Menu, User, LogOut, LogIn } from "lucide-react"
import { useTheme } from "next-themes"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { useSession as useNextAuthSession, signOut } from "next-auth/react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useNextAuthSession()

  // Hide navbar on auth pages
  const isAuthPage = pathname?.startsWith('/auth')

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/chat", label: "New Chat", icon: MessageCircle },
    { href: "/history", label: "History", icon: History },
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
                Career Counselor
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-0">
              {navItems.map(({ href, label, icon: Icon }, index) => {
                const isActive = pathname === href || 
                  (href === "/" && pathname === "/") ||
                  (href === "/chat" && pathname.startsWith("/chat")) ||
                  (href === "/history" && pathname.startsWith("/history"))
                return (
                  <div key={href} className="flex items-center">
                    <Link
                      href={href}
                      className={`flex items-center space-x-2 px-4 py-2 transition-all duration-200 group relative ${
                        isActive 
                          ? "text-primary" 
                          : "text-muted-foreground hover:text-primary hover:bg-accent/30"
                      }`}
                    >
                      <Icon className={`h-4 w-4 transition-transform ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                      <span className="font-medium">{label}</span>
                      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-primary transition-opacity duration-200 ${isActive ? "opacity-100" : "opacity-0"}`}></div>
                    </Link>
                    {index < navItems.length - 1 && (
                      <div className="w-px h-6 bg-border/40 mx-1"></div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 hover:bg-accent transition-colors cursor-pointer"
            >
              <Sun className="h-8 w-8 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-8 w-8 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-accent transition-colors">
                  {session ? (
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                        {session.user?.name?.charAt(0)?.toUpperCase() || session.user?.email?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-popover border-border shadow-lg z-50">
                {session ? (
                  <>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        {session.user?.name && (
                          <p className="font-medium text-popover-foreground">{session.user.name}</p>
                        )}
                        {session.user?.email && (
                          <p className="w-[200px] truncate text-sm text-muted-foreground">
                            {session.user.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="focus:bg-accent">
                      <Link href="/profile" className="cursor-pointer text-popover-foreground hover:bg-accent">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                      className="cursor-pointer text-destructive focus:text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem asChild className="focus:bg-accent">
                    <Link href="/auth/signin" className="cursor-pointer text-popover-foreground hover:bg-accent">
                      <LogIn className="mr-2 h-4 w-4" />
                      <span>Sign in</span>
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

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
                    <span className="text-xl font-bold text-foreground">Career Counselor</span>
                  </div>
              {navItems.map(({ href, label, icon: Icon }, index) => {
                const isActive = pathname === href || 
                  (href === "/" && pathname === "/") ||
                  (href === "/chat" && pathname.startsWith("/chat")) ||
                  (href === "/history" && pathname.startsWith("/history"))
                return (
                      <div key={href}>
                        <Link
                          href={href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center space-x-3 p-3 transition-all duration-200 ${
                            isActive 
                              ? "text-primary border-l-4 border-primary" 
                              : "text-foreground hover:text-primary hover:bg-accent/50"
                          }`}
                        >
                          <Icon className={`h-5 w-5 ${isActive ? "scale-110" : ""}`} />
                          <span className="text-lg font-medium">{label}</span>
                        </Link>
                        {index < navItems.length - 1 && (
                          <div className="h-px bg-border/60 mx-3 my-2"></div>
                        )}
                      </div>
                    )
                  })}
                  
                  {/* Mobile Profile Section */}
                  <div className="border-t border-border/60 pt-4 mt-4">
                    {session ? (
                      <>
                        <div className="flex items-center space-x-3 p-3 mb-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                              {session.user?.name?.charAt(0)?.toUpperCase() || session.user?.email?.charAt(0)?.toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            {session.user?.name && (
                              <span className="font-medium text-sm">{session.user.name}</span>
                            )}
                            {session.user?.email && (
                              <span className="text-xs text-muted-foreground truncate">
                                {session.user.email}
                              </span>
                            )}
                          </div>
                        </div>
                        <Link
                          href="/profile"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center space-x-3 p-3 text-foreground hover:text-primary hover:bg-accent/50 transition-all duration-200"
                        >
                          <User className="h-5 w-5" />
                          <span className="text-lg font-medium">Profile</span>
                        </Link>
                        <button
                          onClick={() => {
                            signOut({ callbackUrl: "/auth/signin" })
                            setIsOpen(false)
                          }}
                          className="flex items-center space-x-3 p-3 text-destructive hover:bg-destructive/10 transition-all duration-200 w-full"
                        >
                          <LogOut className="h-5 w-5" />
                          <span className="text-lg font-medium">Sign out</span>
                        </button>
                      </>
                    ) : (
                      <Link
                        href="/auth/signin"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 p-3 text-foreground hover:text-primary hover:bg-accent/50 transition-all duration-200"
                      >
                        <LogIn className="h-5 w-5" />
                        <span className="text-lg font-medium">Sign in</span>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
