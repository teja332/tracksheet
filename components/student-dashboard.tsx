"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import StudentSidebar from "./student-sidebar";
import TopBar from "./ui/TopBar";
import OverviewSection from "./sections/overview-section";
import ProfileSection from "./sections/profile-section";
import AcademicSection from "./sections/academic-section";
import CoCurricularSection from "./sections/co-curricular-section";
import ExtraCurricularSection from "./sections/extra-curricular-section";
import OnlinePlatformsSection from "./sections/online-platforms-section";
import OverallAnalysisSection from "./sections/overall-analysis-section";
import AlertsSection from "./sections/alerts-section";

interface StudentDashboardProps {
  rollNumber: string;
  onLogout: () => void;
  userName?: string;
  userEmail?: string;
}

export default function StudentDashboard({
  rollNumber,
  onLogout,
  userName = "Student",
  userEmail = "student@tracksheet.edu",
}: StudentDashboardProps) {
  const [activeSection, setActiveSection] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [studentData, setStudentData] = useState<{
    profile: {
      fullName: string;
      email: string;
      phone: string;
      dob: string;
      address: string;
      rollNumber: string;
      year: string;
      branch: string;
      section: string;
      parentName: string;
      parentPhone: string;
      leetcode?: string;
      codeforces?: string;
      hackerrank?: string;
      codechef?: string;
    };
    academics: { subjects: Array<{ name: string; score: string | number }> };
    cocirculars: { categories: Array<{ category: string; entries: string[] }> };
    ecirculars: { categories: Array<{ category: string; entries: string[] }> };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!rollNumber) return;
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const response = await fetch(
          `/api/student/${encodeURIComponent(rollNumber)}`,
          { credentials: "include" }
        );
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error || "Failed to load student data");
        }
        const data = await response.json();
        if (isMounted) {
          setStudentData(data);
        }
      } catch (err) {
        if (isMounted) {
          setLoadError(
            err instanceof Error ? err.message : "Failed to load student data"
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [rollNumber]);

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };



  const handleProfileClick = () => {
    setActiveSection("profile");
  };

  const handleDashboardClick = () => {
    setActiveSection("overview");
  };

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewSection studentId={rollNumber} />;
      case "profile":
        return (
          <ProfileSection
            studentId={rollNumber}
            profile={studentData?.profile}
          />
        );
      case "academic":
        return (
          <AcademicSection
            studentId={rollNumber}
            academics={studentData?.academics}
          />
        );
      case "cocircular":
        return (
          <CoCurricularSection
            studentId={rollNumber}
            cocirculars={studentData?.cocirculars}
          />
        );
      case "extracircular":
        return (
          <ExtraCurricularSection
            studentId={rollNumber}
            ecirculars={studentData?.ecirculars}
          />
        );
      case "platforms":
        return (
          <OnlinePlatformsSection
            studentId={rollNumber}
            profile={studentData?.profile}
          />
        );
      case "analysis":
        return <OverallAnalysisSection studentId={rollNumber} />;
      case "alerts":
        return <AlertsSection studentId={rollNumber} />;
      default:
        return <OverviewSection studentId={rollNumber} />;
    }
  };

  return (
    <div className="flex h-screen">
      <StudentSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        searchQuery={searchQuery}
      />
      <div className="flex-1 flex flex-col">
        {/* TopBar with integrated navigation */}
        <TopBar
          userName={studentData?.profile?.fullName || userName}
          userEmail={studentData?.profile?.email || userEmail}
          onSearch={handleSearch}
          onLogout={onLogout}
          onProfileClick={handleProfileClick}
          onDashboardClick={handleDashboardClick}
        />



        {/* Animated section content */}
        <div className="flex-1 overflow-auto p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.99 }}
              transition={{
                duration: 0.28,
                ease: [0.19, 0.79, 0.29, 1],
              }}
              className="will-change-transform"
              style={{ backfaceVisibility: "hidden" }}
            >
              {isLoading ? (
                <div className="text-sm text-slate-500">Loading data...</div>
              ) : loadError ? (
                <div className="text-sm text-rose-600">{loadError}</div>
              ) : (
                renderSection()
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
