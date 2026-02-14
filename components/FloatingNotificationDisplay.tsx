"use client"

import React, { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNotifications } from "@/contexts/NotificationContext"
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from "lucide-react"

interface FloatingNotificationItem {
  id: string
  type: string
  title: string
  message: string
  isVisible: boolean
}

export default function FloatingNotificationDisplay() {
  const { notifications } = useNotifications()
  const [floatingNotifications, setFloatingNotifications] = useState<FloatingNotificationItem[]>([])
  const [isMounted, setIsMounted] = useState(false)
  const processedIdsRef = useRef<Set<string>>(new Set())
  const initialLoadRef = useRef(true)

  // Set mounted flag on client side
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    // On first load, mark all existing notifications as already shown
    if (initialLoadRef.current) {
      notifications.forEach((n) => {
        processedIdsRef.current.add(n.id)
      })
      initialLoadRef.current = false
      return
    }

    // Find new notifications that haven't been shown as floating overlay yet
    const newNotifications = notifications.filter((n) => !processedIdsRef.current.has(n.id))

    newNotifications.forEach((notification) => {
      // Mark this notification as processed
      processedIdsRef.current.add(notification.id)

      const floatingItem: FloatingNotificationItem = {
        id: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        isVisible: true,
      }

      setFloatingNotifications((prev) => [...prev, floatingItem])

      // Auto-hide after 3 seconds
      const hideTimeout = setTimeout(() => {
        setFloatingNotifications((prev) =>
          prev.map((n) => (n.id === notification.id ? { ...n, isVisible: false } : n))
        )
      }, 3000)

      // Remove from floating after hide animation
      const removeTimeout = setTimeout(() => {
        setFloatingNotifications((prev) => prev.filter((n) => n.id !== notification.id))
      }, 3500)

      return () => {
        clearTimeout(hideTimeout)
        clearTimeout(removeTimeout)
      }
    })
  }, [notifications, isMounted])

  // Return empty during SSR
  if (!isMounted) {
    return null
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-8 h-8 text-green-600" />
      case "error":
        return <AlertCircle className="w-8 h-8 text-red-600" />
      case "warning":
        return <AlertTriangle className="w-8 h-8 text-yellow-600" />
      case "info":
      default:
        return <Info className="w-8 h-8 text-blue-600" />
    }
  }

  const getGradient = (type: string) => {
    switch (type) {
      case "success":
        return "from-green-50 to-green-100 border-green-300"
      case "error":
        return "from-red-50 to-red-100 border-red-300"
      case "warning":
        return "from-yellow-50 to-yellow-100 border-yellow-300"
      case "info":
      default:
        return "from-blue-50 to-blue-100 border-blue-300"
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 pointer-events-none z-[9999] flex items-start justify-center pt-6">
      <AnimatePresence>
        {floatingNotifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: notification.isVisible ? 1 : 0, y: notification.isVisible ? 0 : -30, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="pointer-events-auto"
          >
            <div
              className={`max-w-md w-full mx-4 rounded-2xl border-2 bg-gradient-to-r ${getGradient(
                notification.type
              )} shadow-2xl p-6 flex items-start gap-4`}
            >
              <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-slate-900">{notification.title}</h3>
                <p className="text-sm text-slate-700 mt-1 line-clamp-3">{notification.message}</p>
              </div>
              <button
                className="flex-shrink-0 p-1 hover:bg-white/50 rounded-lg transition-colors"
                onClick={() => {
                  setFloatingNotifications((prev) =>
                    prev.map((n) => (n.id === notification.id ? { ...n, isVisible: false } : n))
                  )
                  setTimeout(() => {
                    setFloatingNotifications((prev) => prev.filter((n) => n.id !== notification.id))
                  }, 300)
                }}
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
