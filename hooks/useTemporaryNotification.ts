"use client"

import { useNotifications } from "@/contexts/NotificationContext"
import { useEffect } from "react"

export const useTemporaryNotification = () => {
  const { addNotification, removeNotification } = useNotifications()

  const showTemporaryNotification = (
    type: "success" | "error" | "info" | "warning",
    title: string,
    message: string,
    duration: number = 3000
  ) => {
    const id = `${Date.now()}-${Math.random()}`
    
    addNotification({
      id,
      type,
      title,
      message,
      action: undefined,
    })

    // Auto-remove after duration
    setTimeout(() => {
      removeNotification(id)
    }, duration)

    return id
  }

  return { showTemporaryNotification }
}
