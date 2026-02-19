import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { ArrowLeft, Check, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { StepOneAccount } from "./components/enrollment/StepOneAccount";
import { StepTwoRoleSelection } from "./components/enrollment/StepTwoRoleSelection";
import { StepThreeProfileDetails } from "./components/enrollment/StepThreeProfileDetails";
import { useEnrollmentForm } from "./hooks/useEnrollmentForm";

export function EnrollUserPage() {
  const { user } = useAuth();

  const isSuperAdmin = user?.role === "super_admin";
  const isAdmin = user?.role === "admin";

  const {
    currentStep,
    setCurrentStep,
    editingUserId,
    createdUserId,
    accountData,
    setAccountData,
    profileData,
    setProfileData,
    studentData,
    setStudentData,
    avatarUpload,
    setAvatarUpload,
    newDocuments,
    setNewDocuments,
    handleNextStep,
    handleSave,
    setLocation,
    error
  } = useEnrollmentForm();

  return (
    <MainLayout title="Enroll New User">
      <div className="max-w-3xl mx-auto space-y-8 pb-20">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/users")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {editingUserId ? "Edit User" : "Enroll New User"}
            </h1>
            <p className="text-muted-foreground">
              {editingUserId
                ? "Update user details."
                : "Complete the steps to add a new user."}
            </p>
          </div>
        </div>

        {/* Wizard Steps Indicator */}
        <div className="flex items-center justify-between relative px-10">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-muted/50 -z-10" />

          <div className="relative flex flex-col items-center gap-2">
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${currentStep >= 1 ? "border-primary bg-background text-primary" : "border-muted-foreground bg-background text-muted-foreground"}`}
            >
              <span className="font-bold">1</span>
            </div>
            <span
              className={`text-sm font-medium bg-background px-2 ${currentStep >= 1 ? "text-primary" : "text-muted-foreground"}`}
            >
              Account
            </span>
          </div>

          <div className="relative flex flex-col items-center gap-2">
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${currentStep >= 2 ? "border-primary bg-background text-primary" : "border-muted-foreground bg-background text-muted-foreground"}`}
            >
              <span className="font-bold">2</span>
            </div>
            <span
              className={`text-sm font-medium bg-background px-2 ${currentStep >= 2 ? "text-primary" : "text-muted-foreground"}`}
            >
              Role
            </span>
          </div>

          <div className="relative flex flex-col items-center gap-2">
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${currentStep >= 3 ? "border-primary bg-background text-primary" : "border-muted-foreground bg-background text-muted-foreground"}`}
            >
              <span className="font-bold">3</span>
            </div>
            <span
              className={`text-sm font-medium bg-background px-2 ${currentStep >= 3 ? "text-primary" : "text-muted-foreground"}`}
            >
              Details
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {currentStep === 1 && (
            <Card className="animate-in slide-in-from-right-4 duration-300">
              <CardHeader>
                <CardTitle>Account Setup</CardTitle>
                <CardDescription>
                  Enter the user's primary login credentials and name.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <StepOneAccount
                  data={accountData}
                  setData={setAccountData}
                  editingUserId={editingUserId}
                />
              </CardContent>
              <CardFooter className="flex justify-end border-t p-6">
                <Button
                  onClick={handleNextStep}
                  className="gap-2 min-w-[120px]"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {currentStep === 2 && (
            <Card className="animate-in slide-in-from-right-4 duration-300">
              <CardHeader>
                <CardTitle>Role Selection</CardTitle>
                <CardDescription>
                  Assign a primary role for the new user.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <StepTwoRoleSelection
                  profileData={profileData}
                  setProfileData={setProfileData}
                  isSuperAdmin={isSuperAdmin}
                />
              </CardContent>
              <CardFooter className="flex justify-end border-t p-6">
                <Button
                  onClick={handleNextStep}
                  className="gap-2 min-w-[120px]"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="bg-card border rounded-lg overflow-hidden">
                <div className="p-6">
                  <StepThreeProfileDetails
                    profileData={profileData}
                    setProfileData={setProfileData}
                    studentData={studentData}
                    setStudentData={setStudentData}
                    documents={newDocuments}
                    setDocuments={setNewDocuments}
                    isAdmin={isAdmin}
                    userDepartment={user?.department}
                    userFullName={`${accountData.firstName} ${accountData.lastName}`}
                    avatarUpload={avatarUpload}
                    setAvatarUpload={setAvatarUpload}
                  />
                </div>

                <div className="flex justify-end p-6 border-t bg-muted/30 backdrop-blur-sm">
                  <Button onClick={handleSave} className="gap-2 min-w-[150px]">
                    <Check className="h-4 w-4" />{" "}
                    {editingUserId ? "Update User" : "Complete Enrollment"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ErrorToast error={error} />
    </MainLayout>
  );
}

function ErrorToast({ error }: { error: string | null }) {
  const [show, setShow] = useState(false);
  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      setContent(error);
      const timer = setTimeout(() => setShow(true), 10);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
      const timer = setTimeout(() => setContent(null), 300);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (!content) return null;

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 md:bottom-8 md:right-8 md:left-auto z-50 w-auto md:w-full md:max-w-sm transition-all duration-500 ease-in-out transform ${show
        ? "translate-x-0 opacity-100"
        : "translate-x-full opacity-0"
        }`}
    >
      <div className="bg-destructive text-destructive-foreground px-4 py-3 rounded-lg shadow-2xl border border-destructive/20 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold tracking-wide">{content}</p>
      </div>
    </div>
  );
}
