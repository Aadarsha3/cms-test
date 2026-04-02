import * as React from "react";
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/core/layout/MainLayout";
import { InfoField } from "@/components/common/InfoField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { useTheme } from "@/lib/theme-context";
import { dashboardApi, userApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  ArrowLeft,
  Loader2,
  User,
  Mail,
  Phone,
  Calendar,
  CalendarIcon,
  MapPin,
  Heart,
  Trash2,
  Edit,
  Save,
} from "lucide-react";
import { useLocation, useRoute } from "wouter";
import { useToast } from "@/hooks/use-toast";

import { StudentDetail } from "@/pages/sidebar/user/user.types";

export function StudentDetailsPage() {
  const { theme } = useTheme();
  const { hasPermission } = useAuth();
  const [, params] = useRoute("/student/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<StudentDetail>>({});
  const [saving, setSaving] = useState(false);

  const studentId = params?.id;
  const canEdit = hasPermission("users_edit");

  useEffect(() => {
    const fetchStudent = async () => {
      if (!studentId) return;
      setLoading(true);
      try {
        const response = await dashboardApi.get<StudentDetail>(`/students/${studentId}`);
        const data = response.data;

        // Fix Spring Boot LocalDate array serialization
        if (Array.isArray(data.dateOfBirth)) {
          const [y, m, d] = data.dateOfBirth;
          data.dateOfBirth = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        }

        // Fetch associated user account to get the human-readable username
        if (data.userId) {
          try {
            const userResponse = await userApi.get(`/users/${data.userId}`);
            if (userResponse.data && userResponse.data.username) {
              data.username = userResponse.data.username;
            }
          } catch (userErr) {
            console.warn("Could not fetch user account details for username:", userErr);
          }
        }

        setStudent(data);
        setEditFormData(data);
      } catch (err: any) {
        console.error("Failed to fetch student details:", err?.response?.data || err);
        const detailedError =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.response?.data?.detail ||
          (typeof err.response?.data === 'string' ? err.response.data : null) ||
          err.message ||
          "Failed to fetch student details";

        setError(detailedError);
        toast({
          title: "Error fetching profile",
          description: detailedError,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId, toast]);

  const goBack = () => {
    setLocation("/students");
  };

  const getInitials = (name: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleDelete = async () => {
    if (!studentId) return;
    if (confirm("Are you sure you want to delete this student? This action cannot be undone.")) {
      try {
        await dashboardApi.delete(`/students/${studentId}`, { data: {} });
        toast({ title: "Student deleted successfully" });
        setLocation("/students");
      } catch (err: any) {
        console.error("Failed to delete student:", err);
        toast({
          title: "Delete failed",
          description: err.message || "Could not delete student.",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = () => {
    if (student) {
      setEditFormData(student);
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (!studentId || !editFormData || !student) return;

    // Validate email format
    if (editFormData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editFormData.email)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address (e.g. name@example.com).",
          variant: "destructive",
        });
        return;
      }
    }

    setSaving(true);
    try {
      // Build JSON Patch (RFC 6902) array from changed fields
      const editableFields: (keyof StudentDetail)[] = [
        "fullName", "email", "phoneNumber", "dateOfBirth",
        "gender", "presentAddress", "guardianName",
        "guardianPhoneNumber", "guardianRelation",
      ];

      const patchOps: { op: string; path: string; value: any }[] = [];
      for (const field of editableFields) {
        if (editFormData[field] !== undefined && editFormData[field] !== student[field]) {
          patchOps.push({ op: "replace", path: `/${field}`, value: editFormData[field] });
        }
      }

      if (patchOps.length === 0) {
        setIsEditing(false);
        return;
      }

      console.log("[DEBUG] PATCH /students/" + studentId, patchOps);
      const response = await dashboardApi.patch(`/students/${studentId}`, patchOps);
      const data = response.data || { ...student, ...editFormData };

      // Format dateOfBirth if it comes back as an array from Spring Boot
      if (Array.isArray(data.dateOfBirth)) {
        const [y, m, d] = data.dateOfBirth;
        data.dateOfBirth = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      }

      setStudent(data as StudentDetail);
      setIsEditing(false);
      toast({ title: "Success", description: "Student details updated successfully." });
    } catch (err: any) {
      console.error("Failed to update student:", err);
      toast({
        title: "Update failed",
        description: err.response?.data?.detail || err.message || "Could not update student",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditFormData(student || {});
    setIsEditing(false);
  };

  if (loading) {
    return (
      <MainLayout title="Student Details">
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </MainLayout>
    );
  }

  if (error || !student) {
    return (
      <MainLayout title="Student Details">
        <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
          <p className="text-muted-foreground">{error || "Student not found"}</p>
          <Button onClick={goBack}>Back to Student Management</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Student Details">
      <div className="max-w-4xl mx-auto space-y-6 pb-10">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={goBack}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Student Management
          </Button>

          {canEdit && (
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={saving}
                    className="gap-2"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEdit}
                    className="gap-2 shadow-sm"
                  >
                    <Edit className="h-4 w-4" /> Edit Profile
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    className="gap-2 shadow-sm"
                  >
                    <Trash2 className="h-4 w-4" /> Delete Student
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Profile Header Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-2xl">
                    {getInitials(student.fullName || "")}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-semibold">{student.fullName}</h2>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-3 mt-1 mb-3">
                  <p className="text-muted-foreground">
                    {student.username || student.userId || student.id}
                  </p>
                </div>
                <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
                  <Badge variant="secondary" className="bg-muted text-muted-foreground">
                    Student
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <InfoField
                label="Full Name"
                value={student.fullName}
                icon={User}
                isEditable
                isEditing={isEditing}
                fieldKey="fullName"
                editFormData={editFormData}
                setEditFormData={setEditFormData}
              />
              <InfoField
                label="Email Address"
                value={student.email}
                icon={Mail}
                isEditable
                isEditing={isEditing}
                fieldKey="email"
                editFormData={editFormData}
                setEditFormData={setEditFormData}
                inputType="email"
              />
              <InfoField
                label="Phone Number"
                value={student.phoneNumber}
                icon={Phone}
                isEditable
                isEditing={isEditing}
                fieldKey="phoneNumber"
                editFormData={editFormData}
                setEditFormData={setEditFormData}
                numericOnly
              />
              {/* Date of Birth — popover calendar, same as enrollment form */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Date of Birth
                </Label>
                {isEditing ? (
                  <Popover>
                    <div className="relative">
                      <Input
                        placeholder="yyyy-mm-dd"
                        value={(editFormData.dateOfBirth as string) || ""}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          let formatted = value;
                          if (value.length > 4) formatted = `${value.slice(0, 4)}-${value.slice(4)}`;
                          if (value.length > 6) formatted = `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
                          setEditFormData({ ...editFormData, dateOfBirth: formatted });
                        }}
                        maxLength={10}
                        className="h-9 pr-10 w-full"
                      />
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                          aria-label="Open calendar"
                        >
                          <CalendarIcon
                            className="h-4 w-4 text-muted-foreground"
                            color={theme === "dark" ? "#ffffff" : undefined}
                          />
                        </button>
                      </PopoverTrigger>
                    </div>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarPicker
                        mode="single"
                        selected={
                          editFormData.dateOfBirth && !isNaN(Date.parse(editFormData.dateOfBirth as string))
                            ? new Date(editFormData.dateOfBirth as string)
                            : undefined
                        }
                        defaultMonth={
                          editFormData.dateOfBirth && !isNaN(Date.parse(editFormData.dateOfBirth as string))
                            ? new Date(editFormData.dateOfBirth as string)
                            : undefined
                        }
                        onSelect={(date) =>
                          setEditFormData({
                            ...editFormData,
                            dateOfBirth: date ? date.toISOString().split("T")[0] : "",
                          })
                        }
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                ) : (
                  <p className="text-sm font-medium py-2">{student.dateOfBirth || "N/A"}</p>
                )}
              </div>
              <InfoField
                label="Gender"
                value={student.gender}
                icon={User}
                isEditable
                isEditing={isEditing}
                fieldKey="gender"
                editFormData={editFormData}
                setEditFormData={setEditFormData}
                options={[
                  { label: "Male", value: "Male" },
                  { label: "Female", value: "Female" },
                  { label: "Other", value: "Other" }
                ]}
              />
              <InfoField
                label="Address"
                value={student.presentAddress}
                icon={MapPin}
                isEditable
                isEditing={isEditing}
                fieldKey="presentAddress"
                editFormData={editFormData}
                setEditFormData={setEditFormData}
              />
            </div>
          </CardContent>
        </Card>

        {/* Guardian Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Guardian Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <InfoField
                label="Guardian Name"
                value={student.guardianName}
                icon={User}
                isEditable
                isEditing={isEditing}
                fieldKey="guardianName"
                editFormData={editFormData}
                setEditFormData={setEditFormData}
              />
              <InfoField
                label="Contact Number"
                value={student.guardianPhoneNumber}
                icon={Phone}
                isEditable
                isEditing={isEditing}
                fieldKey="guardianPhoneNumber"
                editFormData={editFormData}
                setEditFormData={setEditFormData}
                numericOnly
              />
              <InfoField
                label="Relationship"
                value={student.guardianRelation}
                icon={Heart}
                isEditable
                isEditing={isEditing}
                fieldKey="guardianRelation"
                editFormData={editFormData}
                setEditFormData={setEditFormData}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
