"use client"

import { useSetCurrentUser } from "@/hooks/useSetCurrentUser"

export default function UserInitializer() {
  useSetCurrentUser()
  return null
}
