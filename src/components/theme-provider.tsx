"use client"

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({ 
  children, 
  defaultTheme = 'system',
  enableSystem = true,
  disableTransitionOnChange = false
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null
    if (storedTheme) {
      setTheme(storedTheme)
      document.documentElement.classList.toggle('dark', storedTheme === 'dark')
    } else if (enableSystem && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
      document.documentElement.classList.add('dark')
    }

    if (disableTransitionOnChange) {
      document.documentElement.classList.add('no-transitions')
    }
  }, [enableSystem, disableTransitionOnChange])

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme)
      localStorage.setItem('theme', newTheme)
      if (newTheme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        document.documentElement.classList.toggle('dark', systemTheme === 'dark')
      } else {
        document.documentElement.classList.toggle('dark', newTheme === 'dark')
      }
    }
  }

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
