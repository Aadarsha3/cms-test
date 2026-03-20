import * as React from "react";
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { dashboardApi } from "@/lib/api";
import {
  ArrowLeft,
  Loader2,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Heart,
} from "lucide-react";
import { useLocation, useRoute } from "wouter";
import { useToast } from "@/hooks/use-toast";

import { StudentDetail } from "../user.types";

interface InfoFieldProps {
  label: string;
  value: any;
  icon?: any;
}

const InfoField = ({
  label,
  value,
  icon: Icon,
}: InfoFieldProps) => (
  <div className="space-y-2">
    <Label className="flex items-center gap-2">
      {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      {label}
    </Label>
    <p className="text-sm font-medium py-2 break-all">{value || "N/A"}</p>
  </div>
);

export function StudentDetailsPage() {
  const [, params] = useRoute("/student/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const studentId = params?.id;

  useEffect(() => {
    const fetchStudent = async () => {
      if (!studentId) return;
      setLoading(true);
      try {
        const response = await dashboardApi.get<StudentDetail>(`/students/${studentId}`);
        setStudent(response.data);
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
              />
              <InfoField
                label="Email Address"
                value={student.email}
                icon={Mail}
              />
              <InfoField
                label="Phone Number"
                value={student.phoneNumber}
                icon={Phone}
              />
              <InfoField
                label="Date of Birth"
                value={student.dateOfBirth}
                icon={Calendar}
              />
              <InfoField
                label="Gender"
                value={student.gender}
                icon={User}
              />
              <InfoField
                label="Address"
                value={student.presentAddress}
                icon={MapPin}
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
              />
              <InfoField
                label="Contact Number"
                value={student.guardianPhoneNumber}
                icon={Phone}
              />
              <InfoField
                label="Relationship"
                value={student.guardianRelation}
                icon={Heart}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
