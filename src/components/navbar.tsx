"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Menu, MessageSquare, X } from "lucide-react"
import { Button } from "./ui/button"
import { ThemeToggle } from "./theme-toggle"
import UserProfile from "./user-profile"
import { cn } from "@/components/lib/utils"

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <>
      {/* Header Component */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300",
          isScrolled ? "bg-background/95 backdrop-blur-sm shadow-sm" : "bg-background",
        )}
      >
        <div className="container mx-auto px-4 md:px-6">
          <nav className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              href="/"
              prefetch
              className="flex items-center space-x-2 transition-transform duration-200 hover:scale-105"
            >
              <div className="bg-primary/10 p-2 rounded-md">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-bold tracking-tight">RAGify</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <div className="flex items-center space-x-1 mr-4">
                {["Features", "Solutions", "Pricing", "Resources"].map((item) => (
                  <Link
                    key={item}
                    href={item === "Pricing" ? "#pricing" : "#"}
                    className="relative px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors group"
                  >
                    {item}
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200" />
                  </Link>
                ))}
              </div>

              <div className="flex items-center space-x-3">
                <ThemeToggle />

                {user ? (
                  <div className="flex items-center space-x-3">
                    <Link href="/dashboard">
                      <Button variant="default" size="sm" className="h-9 px-4 font-medium">
                        Dashboard
                      </Button>
                    </Link>
                    <UserProfile />
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Link href="/sign-in">
                      <Button variant="ghost" size="sm" className="h-9 px-4 font-medium">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/sign-up">
                      <Button
                        variant="default"
                        size="sm"
                        className="h-9 px-4 font-medium relative overflow-hidden group"
                      >
                        <span className="relative z-10">Sign Up</span>
                        <span className="absolute inset-0 bg-primary/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-3 md:hidden">
              <ThemeToggle />
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu} aria-label="Toggle menu">
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </nav>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "fixed inset-x-0 top-16 bg-background/95 backdrop-blur-sm border-b md:hidden transition-all duration-300 ease-in-out overflow-hidden",
            mobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <div className="container mx-auto px-4 py-4 space-y-4">
            <div className="flex flex-col space-y-3">
              {["Features", "Solutions", "Pricing", "Resources"].map((item) => (
                <Link
                  key={item}
                  href={item === "Pricing" ? "#pricing" : "#"}
                  className="px-3 py-2 text-base font-medium text-foreground/70 hover:text-foreground hover:bg-muted rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t">
              {user ? (
                <div className="flex flex-col space-y-3">
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="default" className="w-full justify-center">
                      Dashboard
                    </Button>
                  </Link>
                  <div className="flex justify-center">
                    <UserProfile />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="default" className="w-full justify-center">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Spacer element to prevent content from being hidden under the fixed header */}
      <div className="h-16 md:h-20" aria-hidden="true"></div>
    </>
  )
}

