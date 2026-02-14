"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
import { useNotifications } from "@/contexts/NotificationContext"

interface AddStudentModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function AddStudentModal({ onClose, onSuccess }: AddStudentModalProps) {
  const { addNotification } = useNotifications()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    // Profile fields
    fullName: "",
    rollNumber: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    year: "",
    branch: "",
    section: "",
    parentName: "",
    parentPhone: "",
    leetcode: "",
    codeforces: "",
    hackerrank: "",
    codechef: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.fullName || !formData.rollNumber || !formData.email) {
      addNotification({
        type: "error",
        title: "Missing Required Fields",
        message: "Please fill in required fields (Name, Roll Number, Email)",
        action: undefined,
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/student/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || "Failed to add student")
      }

      const data = await response.json()

      // Add to notification center with overlay
      addNotification({
        type: "success",
        title: "Student Added Successfully",
        message: `${formData.fullName} (${formData.rollNumber}) has been added to the system`,
        action: undefined,
      })

      onSuccess()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add student"
      
      // Add error to notification center
      addNotification({
        type: "error",
        title: "Failed to Add Student",
        message: errorMessage,
        action: undefined,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(15, 23, 42, 0.3)",
        backdropFilter: "blur(6px)",
        zIndex: 9999,
        overflow: "auto",
      }}
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "600px",
            borderRadius: "var(--radius-xl)",
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          }}
          className="glass-lg"
        >
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-200/80 pb-4">
            <CardTitle style={{ color: "var(--foreground)", fontSize: "18px", fontWeight: 600 }}>
              Add Student
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              style={{
                borderRadius: "50%",
                color: "var(--muted-foreground)",
                padding: "8px",
              }}
            >
              <X size={20} />
            </Button>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <span className="font-semibold">Login Credentials:</span> A user account will be created automatically with the email as username and password.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Profile Information */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Profile Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      name="fullName"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">
                      Roll Number *
                    </label>
                    <Input
                      type="text"
                      name="rollNumber"
                      placeholder="CSE24001"
                      value={formData.rollNumber}
                      onChange={handleInputChange}
                      required
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">
                      Email *
                    </label>
                    <Input
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">
                      Phone
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">
                      Date of Birth
                    </label>
                    <Input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">
                      Address
                    </label>
                    <Input
                      type="text"
                      name="address"
                      placeholder="123 Main St"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">
                      Year
                    </label>
                    <Input
                      type="text"
                      name="year"
                      placeholder="1"
                      value={formData.year}
                      onChange={handleInputChange}
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">
                      Branch
                    </label>
                    <Input
                      type="text"
                      name="branch"
                      placeholder="CSE"
                      value={formData.branch}
                      onChange={handleInputChange}
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">
                      Section
                    </label>
                    <Input
                      type="text"
                      name="section"
                      placeholder="A"
                      value={formData.section}
                      onChange={handleInputChange}
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">
                      Parent Name
                    </label>
                    <Input
                      type="text"
                      name="parentName"
                      placeholder="Jane Doe"
                      value={formData.parentName}
                      onChange={handleInputChange}
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">
                      Parent Phone
                    </label>
                    <Input
                      type="tel"
                      name="parentPhone"
                      placeholder="9876543211"
                      value={formData.parentPhone}
                      onChange={handleInputChange}
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* Online Platforms */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Online Platforms</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">
                      LeetCode Username
                    </label>
                    <Input
                      type="text"
                      name="leetcode"
                      placeholder="username_here"
                      value={formData.leetcode}
                      onChange={handleInputChange}
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">
                      CodeForces Username
                    </label>
                    <Input
                      type="text"
                      name="codeforces"
                      placeholder="username_here"
                      value={formData.codeforces}
                      onChange={handleInputChange}
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">
                      HackerRank Username
                    </label>
                    <Input
                      type="text"
                      name="hackerrank"
                      placeholder="username_here"
                      value={formData.hackerrank}
                      onChange={handleInputChange}
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">
                      CodeChef Username
                    </label>
                    <Input
                      type="text"
                      name="codechef"
                      placeholder="username_here"
                      value={formData.codechef}
                      onChange={handleInputChange}
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-slate-200/80">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 text-slate-700 border-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-sky-600 hover:bg-sky-700 text-white"
                >
                  {isSubmitting ? "Adding..." : "Add Student"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
