"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface CoCurricularSectionProps {
  studentId: string
  cocirculars?: { categories: Array<{ category: string; entries: string[] }> }
}

export default function CoCurricularSection({ studentId, cocirculars }: CoCurricularSectionProps) {
  const normalize = (value: string) => value.toLowerCase().replace(/\s+/g, " ").trim()

  const categories = cocirculars?.categories || []
  const categoryMap = new Map(categories.map((item) => [normalize(item.category), item.entries]))

  const seminars = categoryMap.get("seminars attended") || []
  const hackathons = categoryMap.get("hackathons") || []
  const events = categoryMap.get("events") || []
  const clubs = categoryMap.get("club memberships") || []

  const remaining = categories.filter((item) => {
    const key = normalize(item.category)
    return key !== "seminars attended" && key !== "hackathons" && key !== "events" && key !== "club memberships"
  })

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-slate-900 gradient-text">
        Co-Curricular Activities
      </h2>

      {!categories.length ? (
        <Card className="glass-sm border border-slate-200/80">
          <CardContent className="py-6 text-sm text-slate-500">
            No co-curricular records available for this student.
          </CardContent>
        </Card>
      ) : null}

      {/* Seminars */}
      <Card className="glass-sm border border-slate-200/80">
        <CardHeader>
          <CardTitle className="text-slate-900">Seminars Attended</CardTitle>
        </CardHeader>
        <CardContent>
          {seminars.length ? (
            <ul className="space-y-2 text-sm text-slate-600">
              {seminars.map((entry, idx) => (
                <li key={`seminar-${idx}`} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  {entry}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No seminar records.</p>
          )}
        </CardContent>
      </Card>

      {/* Hackathons */}
      <Card className="glass-sm border border-slate-200/80">
        <CardHeader>
          <CardTitle className="text-slate-900">Hackathons</CardTitle>
        </CardHeader>
        <CardContent>
          {hackathons.length ? (
            <ul className="space-y-2 text-sm text-slate-600">
              {hackathons.map((entry, idx) => (
                <li key={`hackathon-${idx}`} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  {entry}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No hackathon records.</p>
          )}
        </CardContent>
      </Card>

      {/* Events */}
      <Card className="glass-sm border border-slate-200/80">
        <CardHeader>
          <CardTitle className="text-slate-900">Events</CardTitle>
        </CardHeader>
        <CardContent>
          {events.length ? (
            <ul className="space-y-2 text-sm text-slate-600">
              {events.map((entry, idx) => (
                <li key={`event-${idx}`} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  {entry}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No event records.</p>
          )}
        </CardContent>
      </Card>

      {/* Clubs */}
      <Card className="glass-sm border border-slate-200/80">
        <CardHeader>
          <CardTitle className="text-slate-900">Club Memberships</CardTitle>
        </CardHeader>
        <CardContent>
          {clubs.length ? (
            <ul className="space-y-2 text-sm text-slate-600">
              {clubs.map((entry, idx) => (
                <li key={`club-${idx}`} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  {entry}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No club records.</p>
          )}
        </CardContent>
      </Card>

      {remaining.length ? (
        <Card className="glass-sm border border-slate-200/80">
          <CardHeader>
            <CardTitle className="text-slate-900">Other Co-Curriculars</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {remaining.map((item) => (
              <div key={item.category} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <p className="text-slate-900 font-semibold mb-2">{item.category}</p>
                {item.entries.length ? (
                  <ul className="text-sm text-slate-600 space-y-1">
                    {item.entries.map((entry, idx) => (
                      <li key={`${item.category}-other-${idx}`}>• {entry}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500">No entries</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
