"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "./ui/button"
import { useTheme } from "./theme-provider"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="w-9 h-9"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform" />
      ) : (
        <Moon className="h-4 w-4 rotate-90 scale-100 transition-transform" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
