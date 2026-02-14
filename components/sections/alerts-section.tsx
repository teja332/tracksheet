"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, TrendingDown, Clock, Target } from "lucide-react"

interface AlertsSectionProps {
  studentId: string
}

interface AlertItem {
  id: number
  type: string
  title: string
  message: string
  severity: string
  date: string
}

interface AlertsInsights {
  summary: { high: number; medium: number; low: number }
  recent: AlertItem[]
  earlyIntervention: { insights: string[] }
}

export default function AlertsSection({ studentId }: AlertsSectionProps) {
  const [insights, setInsights] = useState<AlertsInsights | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    if (!studentId) return
    let active = true
    const load = async () => {
      setLoadError(null)
      try {
        const response = await fetch(
          `/api/ml/${encodeURIComponent(studentId)}/insights?section=alerts`,
          { credentials: "include" }
        )
        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data.error || "Failed to load alerts")
        }
        const data = await response.json()
        if (active) {
          setInsights(data.alerts || null)
        }
      } catch (err) {
        if (active) {
          setLoadError(err instanceof Error ? err.message : "Failed to load alerts")
        }
      }
    }
    load()
    return () => {
      active = false
    }
  }, [studentId])

  const alerts = insights?.recent || []

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "border-l-4 border-rose-500 bg-rose-50"
      case "medium":
        return "border-l-4 border-amber-500 bg-amber-50"
      case "low":
        return "border-l-4 border-emerald-500 bg-emerald-50"
      default:
        return "border-l-4 border-sky-500 bg-sky-50"
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-rose-100 text-rose-700 border border-rose-200"
      case "medium":
        return "bg-amber-100 text-amber-700 border border-amber-200"
      case "low":
        return "bg-emerald-100 text-emerald-700 border border-emerald-200"
      default:
        return "bg-sky-100 text-sky-700 border border-sky-200"
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-slate-900 gradient-text">Alerts & Notifications</h2>

      {loadError ? (
        <div className="text-sm text-rose-600">{loadError}</div>
      ) : null}

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-sm border border-slate-200/80">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-rose-600">
                {insights?.summary.high ?? 0}
              </div>
              <p className="text-slate-500 text-sm mt-2">High Priority</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-sm border border-slate-200/80">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">
                {insights?.summary.medium ?? 0}
              </div>
              <p className="text-slate-500 text-sm mt-2">Medium Priority</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-sm border border-slate-200/80">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">
                {insights?.summary.low ?? 0}
              </div>
              <p className="text-slate-500 text-sm mt-2">Low Priority</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <Card className="glass-sm border border-slate-200/80">
        <CardHeader>
          <CardTitle className="text-slate-900">Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {alerts.map((alert) => {
            const Icon =
              alert.severity === "high"
                ? AlertCircle
                : alert.severity === "medium"
                  ? Clock
                  : alert.severity === "low"
                    ? TrendingDown
                    : Target
            const severityColorMap: {[key: string]: {bg: string, text: string, textSecondary: string, icon: string}} = {
              high: {bg: "bg-rose-50", text: "text-rose-900", textSecondary: "text-rose-800", icon: "text-rose-500"},
              medium: {bg: "bg-amber-50", text: "text-amber-900", textSecondary: "text-amber-800", icon: "text-amber-500"},
              low: {bg: "bg-emerald-50", text: "text-emerald-900", textSecondary: "text-emerald-800", icon: "text-emerald-500"},
              default: {bg: "bg-sky-50", text: "text-sky-900", textSecondary: "text-sky-800", icon: "text-sky-500"}
            }
            const colors = severityColorMap[alert.severity] || severityColorMap.default
            const borderColorMap: {[key: string]: string} = {
              high: "border-rose-100",
              medium: "border-amber-100",
              low: "border-emerald-100",
              default: "border-sky-100"
            }
            const borderColor = borderColorMap[alert.severity] || borderColorMap.default
            return (
              <div key={alert.id} className={`p-4 rounded-xl flex items-start gap-3 ${getSeverityColor(alert.severity)} ${borderColor}`}>
                <div className={`${colors.bg} rounded-full p-2 flex-shrink-0`}>
                  <Icon className={`${colors.icon}`} size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`${colors.text} font-semibold`}>{alert.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded ${getSeverityBadge(alert.severity)}`}>
                      {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                    </span>
                  </div>
                  <p className={`${colors.textSecondary} text-sm mb-2`}>{alert.message}</p>
                  <p className="text-slate-500 text-xs">{alert.date}</p>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* AI Early Intervention */}
      <Card className="glass-sm border border-slate-200/80">
        <CardHeader>
          <CardTitle className="text-slate-900">AI Early Intervention System</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-sky-50 p-4 rounded-xl border border-sky-200 border-l-4 border-l-sky-500">
            <h4 className="text-sky-900 font-semibold mb-2">System Analysis</h4>
            <p className="text-sky-800 text-sm mb-3">
              Our AI system has identified patterns in your academic performance and engagement metrics.
            </p>
            <ul className="text-sky-800 space-y-2 text-sm">
              {(insights?.earlyIntervention.insights || []).map((item, idx) => (
                <li key={`${item}-${idx}`}>• {item}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
