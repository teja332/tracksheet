"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ExtraCurricularSectionProps {
  studentId: string
  ecirculars?: { categories: Array<{ category: string; entries: string[] }> }
}

export default function ExtraCurricularSection({ studentId, ecirculars }: ExtraCurricularSectionProps) {
  const normalize = (value: string) => value.toLowerCase().replace(/\s+/g, " ").trim()

  const categories = ecirculars?.categories || []
  const categoryMap = new Map(categories.map((item) => [normalize(item.category), item.entries]))

  const sports = categoryMap.get("sports") || []
  const artsAndCulture = categoryMap.get("arts & culture") || []
  const socialService = categoryMap.get("social service") || []
  const fitnessAndWellness = categoryMap.get("fitness & wellness") || []
  const entrepreneurship = categoryMap.get("entrepreneurship & startups") || []
  const literary = categoryMap.get("literary & creative activities") || []
  const nationalService = categoryMap.get("national service / ncc / nss") || []

  const remaining = categories.filter((item) => {
    const key = normalize(item.category)
    return (
      key !== "sports" &&
      key !== "arts & culture" &&
      key !== "social service" &&
      key !== "fitness & wellness" &&
      key !== "entrepreneurship & startups" &&
      key !== "literary & creative activities" &&
      key !== "national service / ncc / nss"
    )
  })

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-slate-900 gradient-text">
        Extra-Curricular Activities
      </h2>

      {!categories.length ? (
        <Card className="glass-sm border border-slate-200/80">
          <CardContent className="py-6 text-sm text-slate-500">
            No extra-curricular records available for this student.
          </CardContent>
        </Card>
      ) : null}

      {/* Sports */}
      <Card className="glass-sm border border-slate-200/80">
        <CardHeader>
          <CardTitle className="text-slate-900">Sports</CardTitle>
        </CardHeader>
        <CardContent>
          {sports.length ? (
            <ul className="space-y-2 text-sm text-slate-600">
              {sports.map((entry, idx) => (
                <li key={`sport-${idx}`} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  {entry}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No sports records.</p>
          )}
        </CardContent>
      </Card>

      {/* Arts & Culture */}
      <Card className="glass-sm border border-slate-200/80">
        <CardHeader>
          <CardTitle className="text-slate-900">Arts & Culture</CardTitle>
        </CardHeader>
        <CardContent>
          {artsAndCulture.length ? (
            <ul className="space-y-2 text-sm text-slate-600">
              {artsAndCulture.map((entry, idx) => (
                <li key={`art-${idx}`} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  {entry}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No arts & culture records.</p>
          )}
        </CardContent>
      </Card>

      {/* Social Service */}
      <Card className="glass-sm border border-slate-200/80">
        <CardHeader>
          <CardTitle className="text-slate-900">Social Service</CardTitle>
        </CardHeader>
        <CardContent>
          {socialService.length ? (
            <ul className="space-y-2 text-sm text-slate-600">
              {socialService.map((entry, idx) => (
                <li key={`service-${idx}`} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  {entry}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No social service records.</p>
          )}
        </CardContent>
      </Card>

      {/* Fitness & Wellness */}
      <Card className="glass-sm border border-slate-200/80">
        <CardHeader>
          <CardTitle className="text-slate-900">Fitness & Wellness</CardTitle>
        </CardHeader>
        <CardContent>
          {fitnessAndWellness.length ? (
            <ul className="space-y-2 text-sm text-slate-600">
              {fitnessAndWellness.map((entry, idx) => (
                <li key={`fitness-${idx}`} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  {entry}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No fitness & wellness records.</p>
          )}
        </CardContent>
      </Card>

      {/* Entrepreneurship & Startups */}
      <Card className="glass-sm border border-slate-200/80">
        <CardHeader>
          <CardTitle className="text-slate-900">Entrepreneurship & Startups</CardTitle>
        </CardHeader>
        <CardContent>
          {entrepreneurship.length ? (
            <ul className="space-y-2 text-sm text-slate-600">
              {entrepreneurship.map((entry, idx) => (
                <li key={`entrepreneur-${idx}`} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  {entry}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No entrepreneurship records.</p>
          )}
        </CardContent>
      </Card>

      {/* Literary & Creative Activities */}
      <Card className="glass-sm border border-slate-200/80">
        <CardHeader>
          <CardTitle className="text-slate-900">Literary & Creative Activities</CardTitle>
        </CardHeader>
        <CardContent>
          {literary.length ? (
            <ul className="space-y-2 text-sm text-slate-600">
              {literary.map((entry, idx) => (
                <li key={`literary-${idx}`} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  {entry}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No literary & creative records.</p>
          )}
        </CardContent>
      </Card>

      {/* National Service / NCC / NSS */}
      <Card className="glass-sm border border-slate-200/80">
        <CardHeader>
          <CardTitle className="text-slate-900">National Service / NCC / NSS</CardTitle>
        </CardHeader>
        <CardContent>
          {nationalService.length ? (
            <ul className="space-y-2 text-sm text-slate-600">
              {nationalService.map((entry, idx) => (
                <li key={`nss-${idx}`} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  {entry}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No national service records.</p>
          )}
        </CardContent>
      </Card>

      {remaining.length ? (
        <Card className="glass-sm border border-slate-200/80">
          <CardHeader>
            <CardTitle className="text-slate-900">Other Extra-Curriculars</CardTitle>
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
