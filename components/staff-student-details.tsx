"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import StaffEditModal from "./staff-edit-modal"
import OverallAnalysisSection from "./sections/overall-analysis-section"

interface StaffStudentDetailsProps {
  studentId: string
  onBack?: () => void
}

export default function StaffStudentDetails({ studentId, onBack }: StaffStudentDetailsProps) {
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [studentData, setStudentData] = useState<{
    profile: {
      fullName: string
      email: string
      phone: string
      dob: string
      address: string
      rollNumber: string
      year: string
      branch: string
      section: string
      parentName: string
      parentPhone: string
      leetcode?: string
      codeforces?: string
      hackerrank?: string
      codechef?: string
    }
    academics: { subjects: Array<{ name: string; score: string | number }> }
    cocirculars: { categories: Array<{ category: string; entries: string[] }> }
    ecirculars: { categories: Array<{ category: string; entries: string[] }> }
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      setIsLoading(true)
      setLoadError(null)
      try {
        const response = await fetch(`/api/student/${encodeURIComponent(studentId)}`, { credentials: "include" })
        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data.error || "Failed to load student data")
        }
        const data = await response.json()
        if (isMounted) {
          setStudentData(data)
        }
      } catch (err) {
        if (isMounted) {
          setLoadError(err instanceof Error ? err.message : "Failed to load student data")
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    load()
    return () => {
      isMounted = false
    }
  }, [studentId])

  const editPayload = useMemo(() => {
    if (!studentData) return null

    const academicFields: Record<string, string | number> = {}
    studentData.academics.subjects.forEach((subject) => {
      academicFields[subject.name] = subject.score
    })

    const toCategoryMap = (categories: Array<{ category: string; entries: string[] }>) => {
      const result: Record<string, string> = {}
      categories.forEach((item) => {
        result[item.category] = item.entries.join("\n")
      })
      return result
    }

    return {
      profile: studentData.profile,
      academic: academicFields,
      cocircular: toCategoryMap(studentData.cocirculars.categories),
      extracircular: toCategoryMap(studentData.ecirculars.categories),
      platforms: {
        leetcode: studentData.profile.leetcode || "",
        codeforces: studentData.profile.codeforces || "",
        hackerrank: studentData.profile.hackerrank || "",
        codechef: studentData.profile.codechef || "",
      },
    }
  }, [studentData])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {onBack && (
          <Button variant="outline" onClick={onBack} className="text-slate-700 border-slate-300 bg-white/70 hover:bg-slate-100">
            <ArrowLeft size={20} />
            Back
          </Button>
        )}
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {studentData?.profile.fullName || "Student"}
          </h2>
          <p className="text-slate-500">{studentData?.profile.email || ""}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-sm text-slate-500">Loading student data...</div>
      ) : loadError ? (
        <div className="text-sm text-rose-600">{loadError}</div>
      ) : null}

      {/* Profile section */}
      <Card className="glass-sm border border-slate-200/80">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-slate-900">Profile Details</CardTitle>
          <Button size="sm" onClick={() => setEditingSection("profile")} className="bg-sky-600 hover:bg-sky-700">
            Edit
          </Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-500">Date of Birth</p>
            <p className="text-slate-900 font-semibold">{studentData?.profile.dob || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Phone</p>
            <p className="text-slate-900 font-semibold">{studentData?.profile.phone || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Address</p>
            <p className="text-slate-900 font-semibold">{studentData?.profile.address || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Parent Name</p>
            <p className="text-slate-900 font-semibold">{studentData?.profile.parentName || "-"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Academic section */}
      <Card className="glass-sm border border-slate-200/80">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-slate-900">Academic Details</CardTitle>
          <Button size="sm" onClick={() => setEditingSection("academic")} className="bg-sky-600 hover:bg-sky-700">
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentData?.academics.subjects.slice(0, 6).map((subject) => (
              <div key={subject.name} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-sm text-slate-600">{subject.name}</p>
                <p className="text-2xl font-bold text-sky-600">{String(subject.score)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Co-Curricular section */}
      <Card className="glass-sm border border-slate-200/80">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-slate-900">Co-Curricular Activities</CardTitle>
          <Button size="sm" onClick={() => setEditingSection("cocircular")} className="bg-sky-600 hover:bg-sky-700">
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-slate-600 mb-2">
              Categories: {studentData?.cocirculars.categories.length || 0}
            </p>
            <p className="text-sm text-slate-600">
              Entries: {studentData?.cocirculars.categories.reduce((sum, item) => sum + item.entries.length, 0) || 0}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Extra-Curricular section */}
      <Card className="glass-sm border border-slate-200/80">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-slate-900">Extra-Curricular Activities</CardTitle>
          <Button
            size="sm"
            onClick={() => setEditingSection("extracircular")}
            className="bg-sky-600 hover:bg-sky-700"
          >
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-slate-600 mb-2">
              Categories: {studentData?.ecirculars.categories.length || 0}
            </p>
            <p className="text-sm text-slate-600">
              Entries: {studentData?.ecirculars.categories.reduce((sum, item) => sum + item.entries.length, 0) || 0}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Online Platforms section */}
      <Card className="glass-sm border border-slate-200/80">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-slate-900">Online Platforms</CardTitle>
          <Button size="sm" onClick={() => setEditingSection("platforms")} className="bg-sky-600 hover:bg-sky-700">
            Edit Usernames
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {studentData?.profile.leetcode && studentData.profile.leetcode !== "username_here" ? (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <p className="text-sm font-semibold text-slate-700">LeetCode</p>
                <p className="text-xs text-slate-500">@{studentData.profile.leetcode}</p>
              </div>
            ) : null}
            {studentData?.profile.codeforces && studentData.profile.codeforces !== "username_here" ? (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <p className="text-sm font-semibold text-slate-700">CodeForces</p>
                <p className="text-xs text-slate-500">@{studentData.profile.codeforces}</p>
              </div>
            ) : null}
            {studentData?.profile.hackerrank && studentData.profile.hackerrank !== "username_here" ? (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <p className="text-sm font-semibold text-slate-700">HackerRank</p>
                <p className="text-xs text-slate-500">@{studentData.profile.hackerrank}</p>
              </div>
            ) : null}
            {studentData?.profile.codechef && studentData.profile.codechef !== "username_here" ? (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <p className="text-sm font-semibold text-slate-700">CodeChef</p>
                <p className="text-xs text-slate-500">@{studentData.profile.codechef}</p>
              </div>
            ) : null}
            {(!studentData?.profile.leetcode || studentData.profile.leetcode === "username_here") &&
             (!studentData?.profile.codeforces || studentData.profile.codeforces === "username_here") &&
             (!studentData?.profile.hackerrank || studentData.profile.hackerrank === "username_here") &&
             (!studentData?.profile.codechef || studentData.profile.codechef === "username_here") ? (
              <div className="text-sm text-slate-500">
                No platform usernames configured yet.
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <OverallAnalysisSection studentId={studentId} />

      {editingSection && editPayload && (
        <StaffEditModal
          section={editingSection}
          studentData={editPayload}
          studentId={studentId}
          onClose={() => setEditingSection(null)}
          onSaveSuccess={() => {
            // Reload student data after successful save
            window.location.reload();
          }}
        />
      )}
    </div>
  )
}
