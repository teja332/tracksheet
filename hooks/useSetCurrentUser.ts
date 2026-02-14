"use client"

import { useEffect } from "react"
import { useNotifications } from "@/contexts/NotificationContext"
import { jwtDecode } from "jwt-decode"

export const useSetCurrentUser = () => {
  const { setCurrentUserId } = useNotifications()

  useEffect(() => {
    // Get the token from cookies
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop()?.split(";").shift()
      return null
    }

    try {
      const token = getCookie("auth")
      if (token) {
        const decoded: any = jwtDecode(token)
        const userId = decoded.email || decoded.sub || decoded.id
        if (userId) {
          setCurrentUserId(userId)
        }
      } else {
        // No token found, clear user ID
        setCurrentUserId(null)
      }
    } catch (error) {
      console.error("Failed to decode token:", error)
      setCurrentUserId(null)
    }
  }, [setCurrentUserId])
}
