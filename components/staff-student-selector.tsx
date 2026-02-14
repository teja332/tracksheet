"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Upload, Plus } from "lucide-react"
import AddStudentModal from "./add-student-modal"
import { useNotifications } from "@/contexts/NotificationContext"

interface StaffStudentSelectorProps {
  onSelectStudent: (studentId: string) => void
  searchQuery?: string
}

export default function StaffStudentSelector({ onSelectStudent, searchQuery = "" }: StaffStudentSelectorProps) {
  const { addNotification } = useNotifications()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [year, setYear] = useState("")
  const [branch, setBranch] = useState("")
  const [section, setSection] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [isUploadingExcel, setIsUploadingExcel] = useState(false)
  const [students, setStudents] = useState<
    Array<{
      rollNumber: string
      fullName: string
      email: string
      year: string
      section: string
      branch: string
    }>
  >([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      setIsLoading(true)
      setLoadError(null)
      try {
        const response = await fetch("/api/staff/assigned", { credentials: "include" })
        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data.error || "Failed to load students")
        }
        const data = await response.json()
        if (isMounted) {
          setStudents(data.students || [])
        }
      } catch (err) {
        if (isMounted) {
          setLoadError(err instanceof Error ? err.message : "Failed to load students")
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
  }, [])

  const searchLower = searchQuery.toLowerCase()
  const filteredStudents = students.filter(
    (student) =>
      (!year || student.year === year) &&
      (!branch || student.branch.toLowerCase() === branch.toLowerCase()) &&
      (!section || student.section.toLowerCase() === section.toLowerCase()) &&
      (!searchQuery || 
        student.fullName.toLowerCase().includes(searchLower) ||
        student.rollNumber.toLowerCase().includes(searchLower) ||
        student.email.toLowerCase().includes(searchLower)
      ),
  )

  const handleAddStudentSuccess = () => {
    // Reload students list after adding new student
    setIsLoading(true)
    fetch("/api/staff/assigned", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setStudents(data.students || []))
      .catch(() => setLoadError("Failed to reload students"))
      .finally(() => setIsLoading(false))
  }

  const handleExcelFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const fileName = file.name.toLowerCase()
    const validExtensions = [".xlsx", ".xls", ".csv"]
    const isValidFile = validExtensions.some((ext) => fileName.endsWith(ext))

    if (!isValidFile) {
      addNotification({
        type: "error",
        title: "Invalid File Type",
        message: "Please upload only Excel files (.xlsx, .xls, or .csv)",
        action: undefined,
      })
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      return
    }

    setIsUploadingExcel(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/student/upload-excel", {
        method: "POST",
        body: formData,
        credentials: "include",
      })

      const result = await response.json()

      if (!response.ok) {
        const errorMsg = result.error || "Failed to upload Excel file"
        
        addNotification({
          type: "error",
          title: "Excel Upload Failed",
          message: errorMsg,
          action: undefined,
        })
        return
      }

      // Add success notification
      addNotification({
        type: "success",
        title: "Excel Import Successful",
        message: `Successfully imported ${result.successCount} student(s)${result.errorCount > 0 ? ` with ${result.errorCount} error(s)` : ""}`,
        action: undefined,
      })

      // Reload students list
      handleAddStudentSuccess()

      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to upload Excel file"
      
      addNotification({
        type: "error",
        title: "Excel Upload Error",
        message: errorMsg,
        action: undefined,
      })
    } finally {
      setIsUploadingExcel(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filter Students Container */}
        <div className="lg:col-span-2">
          <Card className="glass-sm border border-slate-200/80 h-full">
            <CardHeader>
              <CardTitle className="text-slate-900">Filter Students</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">Year</label>
                  <Input
                    placeholder="e.g., 1, 2, 3, 4"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">Branch</label>
                  <Input
                    placeholder="e.g., CSE, ECE"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">Section</label>
                  <Input
                    placeholder="e.g., A, B, C"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Student Details Container */}
        <div>
          <Card className="glass-sm border border-slate-200/80 h-full">
            <CardHeader>
              <CardTitle className="text-slate-900">Add Student Details</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button
                onClick={() => setShowAddModal(true)}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white rounded-lg flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Add Manually
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingExcel}
                variant="outline"
                className="w-full text-slate-700 border-slate-300 hover:bg-slate-100 rounded-lg flex items-center justify-center gap-2"
              >
                <Upload size={18} />
                {isUploadingExcel ? "Uploading..." : "Add Excel"}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleExcelFileSelect}
                className="hidden"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="glass-sm border border-slate-200/80">
        <CardHeader>
          <CardTitle className="text-slate-900">Students ({filteredStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-sm text-slate-500">Loading students...</div>
          ) : loadError ? (
            <div className="text-sm text-rose-600">{loadError}</div>
          ) : (
            <div className="space-y-2">
              {filteredStudents.map((student) => (
                <Button
                  key={student.rollNumber}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3 bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-900"
                  onClick={() => onSelectStudent(student.rollNumber)}
                >
                  <div>
                    <p className="font-semibold text-slate-900">{student.fullName}</p>
                    <p className="text-sm text-slate-600">
                      {student.year}Y | {student.branch} | Section {student.section}
                    </p>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showAddModal && (
        <AddStudentModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false)
            handleAddStudentSuccess()
          }}
        />
      )}
    </div>
  )
}
