"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StaffDashboard from "@/components/staff-dashboard";

export default function StaffPage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    staffId: string;
    email: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verify authentication and role
    fetch("/api/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (!data.userId || data.role !== "staff") {
          // Not authenticated or wrong role
          router.replace("/login");
          return;
        }
        setUser({
          staffId: data.staffId || "",
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
    <StaffDashboard
      staffId={user.staffId}
      userEmail={user.email}
      onLogout={handleLogout}
    />
  );
}
