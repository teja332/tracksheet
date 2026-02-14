"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { X, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface StaffEditModalProps {
  section: string;
  studentData: any;
  studentId: string;
  onClose: () => void;
  onSaveSuccess?: () => void;
}

export default function StaffEditModal({
  section,
  studentData,
  studentId,
  onClose,
  onSaveSuccess,
}: StaffEditModalProps) {
  const [formData, setFormData] = useState(studentData[section] || {});
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const { toast } = useToast();

  // Track if data has changed
  const hasChanges = JSON.stringify(formData) !== JSON.stringify(studentData[section] || {});

  // Update form data when studentData or section changes
  useEffect(() => {
    setFormData(studentData[section] || {});
  }, [studentData, section]);

  // Disable body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleSave = async () => {
    if (!hasChanges) {
      toast({
        description: "No changes to save",
        variant: "default",
      });
      onClose();
      return;
    }

    // Show confirmation if changes exist
    const confirmed = window.confirm(
      `Are you sure you want to save changes to ${section}?`
    );
    if (!confirmed) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/student/${encodeURIComponent(studentId)}/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ section, data: formData }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || "Failed to save changes");
      }

      toast({
        description: `${section} updated successfully`,
        variant: "default",
      });
      onSaveSuccess?.();
      onClose();
    } catch (err) {
      toast({
        description: err instanceof Error ? err.message : "Failed to save changes",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${section} data? This action cannot be undone.`
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/student/${encodeURIComponent(studentId)}/${section}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || "Failed to delete data");
      }

      toast({
        description: `${section} deleted successfully`,
        variant: "default",
      });
      onSaveSuccess?.();
      onClose();
    } catch (err) {
      toast({
        description: err instanceof Error ? err.message : "Failed to delete data",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowConfirmDelete(false);
    }
  };

  const renderFormFields = () => {
    const renderInput = (label: string, value: any, onChange: (val: any) => void, type: string = "text") => (
      <div key={label}>
        <label
          style={{
            fontSize: "14px",
            fontWeight: 500,
            color: "var(--muted-foreground)",
            display: "block",
            marginBottom: "8px",
          }}
        >
          {label}
        </label>
        <Input
          type={type}
          value={String(value || "")}
          onChange={(e) => onChange(type === "number" ? parseFloat(e.target.value) || 0 : e.target.value)}
          style={{
            backgroundColor: "var(--input)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
            borderRadius: "var(--radius-xl)",
            padding: "8px 12px",
            fontSize: "14px",
          }}
        />
      </div>
    );

    switch (section) {
      case "profile":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {renderInput(
              "Full Name",
              formData.fullName || "",
              (val) => setFormData({ ...formData, fullName: val })
            )}
            {renderInput(
              "Email",
              formData.email || "",
              (val) => setFormData({ ...formData, email: val })
            )}
            {renderInput(
              "Phone",
              formData.phone || "",
              (val) => setFormData({ ...formData, phone: val })
            )}
            {renderInput(
              "Date of Birth",
              formData.dob || "",
              (val) => setFormData({ ...formData, dob: val })
            )}
            {renderInput(
              "Address",
              formData.address || "",
              (val) => setFormData({ ...formData, address: val })
            )}
            {renderInput(
              "Year",
              formData.year || "",
              (val) => setFormData({ ...formData, year: val })
            )}
            {renderInput(
              "Branch",
              formData.branch || "",
              (val) => setFormData({ ...formData, branch: val })
            )}
            {renderInput(
              "Section",
              formData.section || "",
              (val) => setFormData({ ...formData, section: val })
            )}
            {renderInput(
              "Parent Name",
              formData.parentName || "",
              (val) => setFormData({ ...formData, parentName: val })
            )}
            {renderInput(
              "Parent Phone",
              formData.parentPhone || "",
              (val) => setFormData({ ...formData, parentPhone: val })
            )}
          </div>
        );
      case "academic":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {Object.entries(formData).map(([subject, score]) =>
              renderInput(
                subject.charAt(0).toUpperCase() + subject.slice(1),
                score,
                (val) => setFormData({ ...formData, [subject]: val }),
                "number"
              )
            )}
          </div>
        );
      case "cocircular":
      case "extracircular":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {Object.entries(formData).map(([category, entries]) =>
              renderInput(
                category.charAt(0).toUpperCase() + category.slice(1),
                entries,
                (val) => setFormData({ ...formData, [category]: val })
              )
            )}
          </div>
        );
      case "platforms":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {renderInput(
              "LeetCode",
              formData.leetcode || "",
              (val) => setFormData({ ...formData, leetcode: val })
            )}
            {renderInput(
              "CodeForces",
              formData.codeforces || "",
              (val) => setFormData({ ...formData, codeforces: val })
            )}
            {renderInput(
              "HackerRank",
              formData.hackerrank || "",
              (val) => setFormData({ ...formData, hackerrank: val })
            )}
            {renderInput(
              "CodeChef",
              formData.codechef || "",
              (val) => setFormData({ ...formData, codechef: val })
            )}
          </div>
        );
      default:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {Object.entries(formData).map(([key, value]) =>
              renderInput(
                key.charAt(0).toUpperCase() + key.slice(1),
                value,
                (val) => setFormData({ ...formData, [key]: val })
              )
            )}
          </div>
        );
    }
  };

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
        overflow: "hidden",
      }}
    >
      <Card
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          top: "80px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "448px",
          maxHeight: "calc(100vh - 100px)",
          overflowY: "auto",
          borderRadius: "var(--radius-xl)",
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          zIndex: 10000,
        }}
        className="glass-lg"
      >
        <CardHeader
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            backgroundColor: "var(--card)",
            zIndex: 10,
            padding: "16px",
            borderBottomColor: "var(--border)",
            borderBottomWidth: "1px",
            backdropFilter: "blur(10px)",
          }}
        >
          <CardTitle
            style={{
              color: "var(--foreground)",
              textTransform: "capitalize",
              fontSize: "16px",
              fontWeight: 600,
            }}
          >
            Edit {section}
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
        <CardContent
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            padding: "16px",
          }}
        >
          {renderFormFields()}

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "16px",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSaving || isDeleting}
              style={{
                flex: 1,
                minWidth: "100px",
                borderRadius: "var(--radius-xl)",
                borderColor: "var(--border)",
                backgroundColor: "var(--card)",
                color: "var(--foreground)",
                padding: "10px 16px",
                fontSize: "14px",
                opacity: isSaving || isDeleting ? 0.5 : 1,
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || isSaving || isDeleting}
              style={{
                flex: 1,
                minWidth: "100px",
                borderRadius: "var(--radius-xl)",
                backgroundColor: !hasChanges ? "#9ca3af" : "var(--primary)",
                color: "var(--primary-foreground)",
                padding: "10px 16px",
                fontSize: "14px",
                opacity: isSaving || isDeleting ? 0.5 : 1,
                cursor: !hasChanges ? "not-allowed" : "pointer",
              }}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              onClick={() => setShowConfirmDelete(true)}
              disabled={isSaving || isDeleting}
              style={{
                flex: 1,
                minWidth: "100px",
                borderRadius: "var(--radius-xl)",
                backgroundColor: "#ef4444",
                color: "white",
                padding: "10px 16px",
                fontSize: "14px",
                opacity: isSaving || isDeleting ? 0.5 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <Trash2 size={16} />
              Delete
            </Button>
          </div>

          {/* Delete confirmation dialog */}
          {showConfirmDelete && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(15, 23, 42, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10001,
              }}
              onClick={() => setShowConfirmDelete(false)}
            >
              <Card
                onClick={(e) => e.stopPropagation()}
                style={{
                  maxWidth: "400px",
                  padding: "24px",
                }}
              >
                <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "12px" }}>
                  Confirm Delete
                </h3>
                <p style={{ color: "var(--muted-foreground)", marginBottom: "20px" }}>
                  Are you sure you want to delete {section} data? This action cannot be undone.
                </p>
                <div style={{ display: "flex", gap: "12px" }}>
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirmDelete(false)}
                    disabled={isDeleting}
                    style={{
                      flex: 1,
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    style={{
                      flex: 1,
                      backgroundColor: "#ef4444",
                      color: "white",
                    }}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
