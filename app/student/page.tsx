"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StudentDashboard from "@/components/student-dashboard";

export default function StudentPage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    rollNumber: string;
    email: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verify authentication and role
    fetch("/api/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (!data.userId || data.role !== "student") {
          // Not authenticated or wrong role
          router.replace("/login");
          return;
        }
        setUser({
          rollNumber: data.rollNumber || "",
          email: data.email || "",
        });
        setLoading(false);
      })
      .catch(() => {
        router.replace("/login");
      });
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <StudentDashboard
      rollNumber={user.rollNumber}
      userEmail={user.email}
      onLogout={handleLogout}
    />
  );
}
