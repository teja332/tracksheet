"use client";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { NotificationProvider } from "@/contexts/NotificationContext";
import FloatingNotificationDisplay from "@/components/FloatingNotificationDisplay";
import UserInitializer from "@/components/UserInitializer";

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  // TopBar and AnnouncementBox are designed to be used within specific pages
  // rather than globally in layout, since dashboards have their own headers
  return (
    <NotificationProvider>
      <UserInitializer />
      <FloatingNotificationDisplay />
      <main className="min-h-screen">{children}</main>
      <Toaster />
    </NotificationProvider>
  );
}
