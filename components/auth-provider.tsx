"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

function getCookie(name: string) {
  if (typeof document === "undefined") return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift()
  return null
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const token = getCookie("access_token")

      if (token) {
        // Logged in
        if (pathname === "/admin/login") {
          router.push("/admin")
        }
      } else {
        // Not logged in
        if (pathname?.startsWith("/admin") && pathname !== "/admin/login") {
          router.push("/admin/login")
        }
      }
      setLoading(false)
    }

    checkAuth()
    // Optional: could add an interval or event listener for cookie changes
  }, [pathname, router])

  if (loading && pathname?.startsWith("/admin")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
