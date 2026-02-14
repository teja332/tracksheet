"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from "react"

export interface Notification {
  id: string
  type: "success" | "error" | "info" | "warning"
  title: string
  message: string
  timestamp: Date
  action?: string
  userId?: string // Store which user created this notification
}

interface NotificationContextType {
  notifications: Notification[]
  currentUserId: string | null
  setCurrentUserId: (userId: string | null) => void
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "userId">) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

const STORAGE_KEY = "tracksheet_notifications"

const saveToLocalStorage = (notifications: Notification[]) => {
  try {
    const serialized = JSON.stringify(
      notifications.map((n) => ({
        ...n,
        timestamp: n.timestamp.toISOString(),
      }))
    )
    localStorage.setItem(STORAGE_KEY, serialized)
  } catch (error) {
    console.error("Failed to save notifications to localStorage:", error)
  }
}

const loadFromLocalStorage = (): Notification[] => {
  try {
    const item = localStorage.getItem(STORAGE_KEY)
    if (!item) return []
    const parsed = JSON.parse(item)
    return parsed.map((n: any) => ({
      ...n,
      timestamp: new Date(n.timestamp),
    }))
  } catch (error) {
    console.error("Failed to load notifications from localStorage:", error)
    return []
  }
}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load current user ID from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("currentUserId")
    if (storedUserId) {
      setCurrentUserId(storedUserId)
    }
  }, [])

  // Load from localStorage on mount
  useEffect(() => {
    const loadedNotifications = loadFromLocalStorage()
    setNotifications(loadedNotifications)
    setIsHydrated(true)
  }, [])

  // Save to localStorage whenever notifications change (after initial hydration)
  useEffect(() => {
    if (isHydrated) {
      saveToLocalStorage(notifications)
    }
  }, [notifications, isHydrated])

  const setCurrentUserIdWithStorage = useCallback((userId: string | null) => {
    if (userId) {
      localStorage.setItem("currentUserId", userId)
    } else {
      localStorage.removeItem("currentUserId")
    }
    setCurrentUserId(userId)
  }, [])

  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "timestamp" | "userId">) => {
      const id = `${Date.now()}-${Math.random()}`
      const newNotification: Notification = {
        ...notification,
        id,
        timestamp: new Date(),
        userId: currentUserId || "anonymous",
      }
      setNotifications((prev) => [newNotification, ...prev])
    },
    [currentUserId]
  )

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  // Filter notifications to show only current user's notifications
  const userNotifications = notifications.filter((n) => n.userId === currentUserId)

  return (
    <NotificationContext.Provider
      value={{
        notifications: userNotifications,
        currentUserId,
        setCurrentUserId: setCurrentUserIdWithStorage,
        addNotification,
        removeNotification,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider")
  }
  return context
}
