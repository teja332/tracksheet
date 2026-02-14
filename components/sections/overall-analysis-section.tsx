"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { TrendingUp, AlertTriangle, Briefcase } from "lucide-react"

interface OverallAnalysisSectionProps {
  studentId: string
}

interface OverallInsights {
  predictiveData: Array<{
    metric: string
    value: number
    confidence: number
    trend: string
    description: string
  }>
  radarData: Array<{ category: string; value: number }>
  academicData: Array<{ category: string; score: number }>
  activitiesData: Array<{ name: string; value: number }>
  performanceData: Array<{ month: string; academic: number; activities: number; platforms: number }>
  recommendations: Array<{ title: string; reason: string; type: string }>
}

export default function OverallAnalysisSection({ studentId }: OverallAnalysisSectionProps) {
  const [insights, setInsights] = useState<OverallInsights | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    if (!studentId) return
    let active = true
    const load = async () => {
      setLoadError(null)
      try {
        const response = await fetch(
          `/api/ml/${encodeURIComponent(studentId)}/insights?section=overall`,
          { credentials: "include" }
        )
        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data.error || "Failed to load overall analysis")
        }
        const data = await response.json()
        if (active) {
          setInsights(data.overall || null)
        }
      } catch (err) {
        if (active) {
          setLoadError(err instanceof Error ? err.message : "Failed to load overall analysis")
        }
      }
    }
    load()
    return () => {
      active = false
    }
  }, [studentId])

  const academicData = insights?.academicData || []
  const activitiesData = insights?.activitiesData || []
  const performanceData = insights?.performanceData || []
  const predictiveData = insights?.predictiveData || []
  const radarData = insights?.radarData || []
  const recommendations = insights?.recommendations || []
  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-slate-900 gradient-text">Overall Analysis</h2>

      {loadError ? (
        <div className="text-sm text-rose-600">{loadError}</div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {predictiveData.map((item, index) => {
          const Icon =
            item.metric === "Next Semester GPA"
              ? TrendingUp
              : item.metric === "Dropout Risk Score"
                ? AlertTriangle
                : Briefcase
          return (
            <Card key={index} className="glass-sm border border-slate-200/80">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-slate-500 text-sm mb-1">{item.metric}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-sky-600">{item.value}</span>
                      {item.metric === "Next Semester GPA" && <span className="text-slate-500">/10</span>}
                      {item.metric === "Dropout Risk Score" && <span className="text-slate-500">%</span>}
                      {item.metric === "Career Readiness Index" && <span className="text-slate-500">/100</span>}
                    </div>
                  </div>
                  <Icon className="text-sky-500" size={24} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Confidence</span>
                    <span className="text-slate-600">{item.confidence}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-sky-500 h-2 rounded-full" style={{ width: `${item.confidence}%` }}></div>
                  </div>
                  <p className="text-slate-600 text-xs mt-3">{item.description}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="glass-sm border border-slate-200/80">
        <CardHeader>
          <CardTitle className="text-slate-900">Holistic Profile (360° View)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="category" stroke="#64748b" />
              <PolarRadiusAxis stroke="#64748b" />
              <Radar name="Score" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.35} />
              <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Academic Performance */}
      <Card className="glass-sm border border-slate-200/80">
        <CardHeader>
          <CardTitle className="text-slate-900">Academic Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={academicData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="category" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12 }} />
              <Bar dataKey="score" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Activities Distribution */}
      <Card className="glass-sm border border-slate-200/80">
        <CardHeader>
          <CardTitle className="text-slate-900">Activities Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={activitiesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {activitiesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Trend */}
      <Card className="glass-sm border border-slate-200/80">
        <CardHeader>
          <CardTitle className="text-slate-900">Performance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12 }} />
              <Legend />
              <Line type="monotone" dataKey="academic" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="activities" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="platforms" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="glass-sm border border-slate-200/80">
        <CardHeader>
          <CardTitle className="text-slate-900">Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg border-l-4 border-blue-500">
            <h4 className="text-slate-900 font-semibold mb-2">Individual Recommendations</h4>
            {recommendations.length ? (
              <ul className="text-slate-600 space-y-2 text-sm">
                {recommendations.map((item, idx) => (
                  <li key={`${item.title}-${idx}`}>• {item.title}: {item.reason}</li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-slate-500">No recommendations available yet.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
