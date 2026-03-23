import * as React from "react";
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { dashboardApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  ArrowLeft,
  Loader2,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Heart,
  Trash2,
  Edit,
  Save,
} from "lucide-react";
import { useLocation, useRoute } from "wouter";
import { useToast } from "@/hooks/use-toast";

import { StudentDetail } from "../user.types";

interface InfoFieldProps {
  label: string;
  value: any;
  icon?: any;
  isEditable?: boolean;
  isEditing?: boolean;
  fieldKey?: string;
  editFormData?: Partial<StudentDetail>;
  setEditFormData?: (data: any) => void;
}

const InfoField = ({
  label,
  value,
  icon: Icon,
  isEditable = false,
  isEditing = false,
  fieldKey = "",
  editFormData = {},
  setEditFormData,
}: InfoFieldProps) => (
  <div className="space-y-2">
    <Label className="flex items-center gap-2">
      {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      {label}
    </Label>
    {isEditable && isEditing && setEditFormData ? (
      <Input
        className="h-9"
        value={(editFormData[fieldKey as keyof StudentDetail] as string) || ""}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setEditFormData({ ...editFormData, [fieldKey]: e.target.value })
        }
      />
    ) : (
      <p className="text-sm font-medium py-2 break-all">{value || "N/A"}</p>
    )}
  </div>
);

export function StudentDetailsPage() {
  const { user: currentUser } = useAuth();
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
  const canEdit = currentUser?.role === "super_admin" || currentUser?.role === "admin";

  useEffect(() => {
    const fetchStudent = async () => {
      if (!studentId) return;
      setLoading(true);
      try {
        const response = await dashboardApi.get<StudentDetail>(`/students/${studentId}`);
        setStudent(response.data);
        setEditFormData(response.data);
      } catch (err: any) {
        console.error("Failed to fetch student details:", err);
        setError(err.message || "Failed to fetch student details");
        toast({
          title: "Error",
          description: "Could not load student details.",
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
        await dashboardApi.delete(`/students/${studentId}`);
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
    if (!studentId || !editFormData) return;
    setSaving(true);
    try {
      await dashboardApi.put(`/students/${studentId}`, editFormData);
      setStudent({ ...student, ...editFormData } as StudentDetail);
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
                <p className="text-muted-foreground">{student.email}</p>
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
              />
              <InfoField
                label="Date of Birth"
                value={student.dateOfBirth}
                icon={Calendar}
                isEditable
                isEditing={isEditing}
                fieldKey="dateOfBirth"
                editFormData={editFormData}
                setEditFormData={setEditFormData}
              />
              <InfoField
                label="Gender"
                value={student.gender}
                icon={User}
                isEditable
                isEditing={isEditing}
                fieldKey="gender"
                editFormData={editFormData}
                setEditFormData={setEditFormData}
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
