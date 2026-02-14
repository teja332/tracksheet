"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginPage from "@/components/login-page";

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    // Check if already logged in
    fetch("/api/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.userId) {
          // Already logged in, redirect to appropriate dashboard
          if (data.role === "student") {
            router.replace("/student");
          } else if (data.role === "staff") {
            router.replace("/staff");
          }
        }
      })
      .catch(() => {
        // Not logged in, stay on login page
      });
  }, [router]);

  const handleLogin = (payload: {
    role: "student" | "staff";
    rollNumber?: string;
    staffId?: string;
    email: string;
  }) => {
    // Use window.location to force full page reload with new auth cookie
    if (payload.role === "student") {
      window.location.href = "/student";
    } else {
      window.location.href = "/staff";
    }
  };

  return <LoginPage onLogin={handleLogin} />;
}
