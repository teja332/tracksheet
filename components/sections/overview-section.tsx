"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AnimatedCard from "@/components/ui/AnimatedCard"
import DashboardGrid from "@/components/dashboard/DashboardGrid"
import SectionFadeSlide from "@/components/transitions/SectionFadeSlide"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface OverviewSectionProps {
  studentId: string
}

interface OverviewData {
  growthScoreIndex: number
  academicGpa: number
  codingProblems: number
  achievements: number
  performanceTrend: Array<{ month: string; gpa: number; attendance: number }>
  holisticProfile: Array<{ category: string; value: number }>
  recommendations: Array<{ title: string; reason: string; type: string }>
}

export default function OverviewSection({ studentId }: OverviewSectionProps) {
  const [overview, setOverview] = useState<OverviewData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    if (!studentId) return
    let active = true
    const load = async () => {
      setIsLoading(true)
      setLoadError(null)
      try {
        const response = await fetch(
          `/api/ml/${encodeURIComponent(studentId)}/insights?section=overview`,
          { credentials: "include" }
        )
        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data.error || "Failed to load overview data")
        }
        const data = await response.json()
        if (active) {
          setOverview(data.overview || null)
        }
      } catch (err) {
        if (active) {
          setLoadError(err instanceof Error ? err.message : "Failed to load overview data")
        }
      } finally {
        if (active) setIsLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [studentId])

  const performanceData = overview?.performanceTrend || []
  const radarData = overview?.holisticProfile || []
  const recommendations = overview?.recommendations || []

  return (
    <SectionFadeSlide>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-slate-900 gradient-text">Overview</h2>

        {loadError ? (
          <div className="text-sm text-rose-600">{loadError}</div>
        ) : null}

        {/* Stat Cards */}
        <DashboardGrid columns={4}>
          <AnimatedCard glassy>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-slate-500">Growth Score Index</p>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2">
                  {isLoading ? "..." : overview?.growthScoreIndex?.toFixed(1) || "-"}
                </h3>
                <p className="text-xs text-slate-500 mt-1">ML-driven score</p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-sky-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard glassy>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-slate-500">Academic GPA</p>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2">
                  {isLoading ? "..." : overview?.academicGpa?.toFixed(2) || "-"}
                </h3>
                <p className="text-xs text-slate-500 mt-1">Out of 10</p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard glassy>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-slate-500">Coding Problems</p>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2">
                  {isLoading ? "..." : overview?.codingProblems ?? "-"}
                </h3>
                <p className="text-xs text-slate-500 mt-1">From platform activity</p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard glassy>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-slate-500">Achievements</p>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2">
                  {isLoading ? "..." : overview?.achievements ?? "-"}
                </h3>
                <p className="text-xs text-slate-500 mt-1">Certifications + activities</p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-rose-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </AnimatedCard>
        </DashboardGrid>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-sm border border-slate-200/80">
          <CardHeader>
            <CardTitle className="text-slate-900">Performance Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ borderRadius: 12, backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }} />
                <Legend />
                <Line type="monotone" dataKey="gpa" stroke="#6366f1" strokeWidth={2} name="GPA" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="attendance" stroke="#22c55e" strokeWidth={2} name="Attendance %" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-sm border border-slate-200/80">
          <CardHeader>
            <CardTitle className="text-slate-900">Holistic Profile (360° View)</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="category" tick={{ fill: "#64748b", fontSize: 12 }} />
                <PolarRadiusAxis tick={{ fill: "#64748b" }} />
                <Radar name="Performance" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.35} />
                <Tooltip contentStyle={{ borderRadius: 12, backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card className="glass-sm border border-slate-200/80">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            AI-Powered Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 md:space-y-0 md:grid md:grid-cols-3 md:gap-4">
          {recommendations.length ? (
            recommendations.map((item, idx) => (
              <div key={`${item.title}-${idx}`} className="bg-sky-50 border border-sky-100 p-4 rounded-xl">
                <p className="text-sm font-semibold text-sky-800">{item.title}</p>
                <p className="text-xs text-sky-700 mt-1">{item.reason}</p>
              </div>
            ))
          ) : (
            <div className="text-sm text-slate-500">No recommendations available yet.</div>
          )}
        </CardContent>
      </Card>
      </div>
    </SectionFadeSlide>
  )
}
