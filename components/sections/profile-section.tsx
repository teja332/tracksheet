"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ProfileSectionProps {
  studentId: string
  profile?: {
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
  }
}

export default function ProfileSection({ studentId, profile }: ProfileSectionProps) {
  const profileData = profile || {
    fullName: "Rahul Kumar",
    email: "rahul@example.com",
    phone: "9876543210",
    dob: "2003-05-15",
    address: "123 Main St, City",
    parentName: "Mr. Kumar",
    parentPhone: "9876543211",
    rollNumber: "CSE-2021-001",
    year: "3",
    branch: "Computer Science & Engineering",
    section: "A",
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-slate-900 gradient-text">Profile</h2>

      <Card className="glass-sm border border-slate-200/80">
        <CardHeader>
          <CardTitle className="text-slate-900">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-slate-500">Full Name</p>
            <p className="text-lg font-semibold text-slate-900">{profileData.fullName}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Email</p>
            <p className="text-lg font-semibold text-slate-900">{profileData.email}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Phone</p>
            <p className="text-lg font-semibold text-slate-900">{profileData.phone}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Date of Birth</p>
            <p className="text-lg font-semibold text-slate-900">{profileData.dob}</p>
          </div>
          <div className="col-span-1 md:col-span-2">
            <p className="text-sm text-slate-500">Address</p>
            <p className="text-lg font-semibold text-slate-900">{profileData.address}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-sm border border-slate-200/80">
        <CardHeader>
          <CardTitle className="text-slate-900">Academic Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-slate-500">Roll Number</p>
            <p className="text-lg font-semibold text-slate-900">{profileData.rollNumber}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Year</p>
            <p className="text-lg font-semibold text-slate-900">Year {profileData.year}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Branch</p>
            <p className="text-lg font-semibold text-slate-900">{profileData.branch}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Section</p>
            <p className="text-lg font-semibold text-slate-900">{profileData.section}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-sm border border-slate-200/80">
        <CardHeader>
          <CardTitle className="text-slate-900">Parent/Guardian Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-slate-500">Parent Name</p>
            <p className="text-lg font-semibold text-slate-900">{profileData.parentName}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Parent Phone</p>
            <p className="text-lg font-semibold text-slate-900">{profileData.parentPhone}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
