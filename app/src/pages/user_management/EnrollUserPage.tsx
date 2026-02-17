import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { ArrowLeft, Check, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect as useEffectReact } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Import types
import {
  AccountFormData,
  ProfileFormData,
  StudentFormData,
  roleLabels,
} from "./users";

// Import new sub-components
import { StepOneAccount } from "./components/enrollment/StepOneAccount";
import { StepTwoRoleSelection } from "./components/enrollment/StepTwoRoleSelection";
import { StepThreeProfileDetails } from "./components/enrollment/StepThreeProfileDetails";

export function EnrollUserPage() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const match = location.match(/\/users\/([^\/]+)\/edit/);
  const editingUserId = match ? match[1] : null;
  const { toast } = useToast();

  const isSuperAdmin = user?.role === "super_admin";
  const isAdmin = user?.role === "admin";

  const [currentStep, setCurrentStep] = useState(1);
  const [createdUserId, setCreatedUserId] = useState<string | null>(null);

  // State Group 1: Account Credentials
  const [accountData, setAccountData] = useState<AccountFormData>({
    firstName: "",
    lastName: "",
    userId: "",
    email: "",
    password: "",
  });

  // State Group 2: Profile & Role
  const [profileData, setProfileData] = useState<ProfileFormData>({
    role: "student",
    subRoles: [],
    department: "",
    phone: "",
    status: "active",
  });

  // State Group 3: Student Details
  const [studentData, setStudentData] = useState<StudentFormData>({
    universityId: "",
    dateOfBirth: "",
    gender: "",
    currentClass: "",
    semester: "",
    guardianName: "",
    guardianContact: "",
    guardianRelationship: "",
  });

  const [avatarUpload, setAvatarUpload] = useState<string | null>(null);
  const [newDocuments, setNewDocuments] = useState<any[]>([]);

  // Load user data if editing
  useEffectReact(() => {
    const fetchUserForEdit = async () => {
      if (editingUserId) {
        try {
          const response = await import("@/lib/api").then((m) =>
            m.userApi.get(`/users/${editingUserId}`),
          );
          const userToEdit = response.data;
          if (userToEdit) {
            const nameParts = (userToEdit.username || "").split(" ");

            setAccountData({
              firstName: nameParts[0] || "",
              lastName: nameParts.slice(1).join(" ") || "",
              userId: userToEdit.username || "",
              email: userToEdit.primaryEmail || "",
              password: "", // Password usually not returned
            });

            setProfileData({
              role: userToEdit.role || "student",
              subRoles: userToEdit.subRoles || [],
              department: userToEdit.department || "",
              phone: userToEdit.phone || "",
              status: userToEdit.status || "active",
            });

            if (userToEdit.role === "student") {
              setStudentData({
                universityId: userToEdit.universityId || "",
                dateOfBirth: userToEdit.dateOfBirth || "",
                gender: userToEdit.gender || "",
                currentClass: userToEdit.currentClass || "",
                semester: userToEdit.semester || "",
                guardianName: userToEdit.guardianName || "",
                guardianContact: userToEdit.guardianContact || "",
                guardianRelationship: userToEdit.guardianRelationship || "",
              });
            }
          }
        } catch (err) {
          console.error("Failed to load user for editing", err);
          toast({ title: "Failed to load user data", variant: "destructive" });
        }
      }
    };
    fetchUserForEdit();
  }, [editingUserId]);

  const handleNextStep = async () => {
    // Validate Step 1
    if (!accountData.firstName.trim())
      return toast({ title: "First Name is required", variant: "destructive" });
    if (!accountData.lastName.trim())
      return toast({ title: "Last Name is required", variant: "destructive" });
    if (!accountData.userId.trim())
      return toast({ title: "User ID is required", variant: "destructive" });
    if (!accountData.email.trim())
      return toast({ title: "Email is required", variant: "destructive" });

    if (!accountData.password.trim() || accountData.password.length < 6) {
      if (!editingUserId) {
        return toast({
          title: "Password must be at least 6 characters",
          variant: "destructive",
        });
      }
    }

    try {
      if (!editingUserId && !createdUserId) {
        // Create user in Step 1
        const { userApi: api } = await import("@/lib/api");
        const payload = {
          username: accountData.userId,
          primaryEmail: accountData.email,
          givenName: accountData.firstName,
          familyName: accountData.lastName,
          password: accountData.password,
        };

        const response = await api.post("/users", payload);
        const newUser = response.data;

        if (newUser && newUser.id) {
          setCreatedUserId(newUser.id);
          toast({ title: "User created successfully", description: "Proceed to complete profile." });
        }
      }

      setCurrentStep(2);
    } catch (err: any) {
      console.error("Failed to create user:", err);
      toast({
        title: "Failed to create user",
        description: err.response?.data?.message || err.message || "Could not create user",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    // Validate Step 3
    if (!profileData.department && profileData.role !== "super_admin") {
      return toast({
        title: "Please select a Department",
        variant: "destructive",
      });
    }
    if (!profileData.phone.trim()) {
      return toast({
        title: "Phone number is required",
        variant: "destructive",
      });
    }

    if (profileData.role === "student") {
      if (
        !studentData.dateOfBirth ||
        !studentData.gender ||
        !studentData.currentClass ||
        !studentData.semester ||
        !studentData.guardianName.trim() ||
        !studentData.guardianContact.trim() ||
        !studentData.guardianRelationship.trim()
      ) {
        return toast({
          title: "Please fill in all student details",
          variant: "destructive",
        });
      }
    }

    const fullName = `${accountData.firstName.trim()} ${accountData.lastName.trim()}`;

    const payload = {
      // Basic info is already created, but we send updates if needed
      name: fullName,
      role: profileData.role,
      department: profileData.department,
      phone: profileData.phone,
      status: profileData.status,
      ...studentData,
      subRoles: profileData.subRoles,
    };

    try {
      const { userApi: api } = await import("@/lib/api");
      const targetUserId = editingUserId || createdUserId;

      if (targetUserId) {
        if (!accountData.password) delete (payload as any).password;
        await api.put(`/users/${targetUserId}`, payload);
        toast({ title: "User profile updated successfully" });
        setLocation("/users");
      } else {
        toast({ title: "Error: User ID missing", variant: "destructive" });
      }
    } catch (err: any) {
      console.error("Failed to save user details:", err);
      toast({
        title: "Operation failed",
        description:
          err.response?.data?.message || err.message || "Could not save user details",
        variant: "destructive",
      });
    }
  };

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
                <CardTitle>Step 1: Account Setup</CardTitle>
                <CardDescription>
                  Enter the user's primary login credentials and name.
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                  Next Step <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {currentStep === 2 && (
            <Card className="animate-in slide-in-from-right-4 duration-300">
              <CardHeader>
                <CardTitle>Step 2: Role Selection</CardTitle>
                <CardDescription>
                  Assign a role and upload a profile picture.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StepTwoRoleSelection
                  profileData={profileData}
                  setProfileData={setProfileData}
                  isSuperAdmin={isSuperAdmin}
                />
              </CardContent>
              <CardFooter className="flex justify-between border-t p-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button
                  onClick={handleNextStep}
                  className="gap-2 min-w-[120px]"
                >
                  Next Step <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
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

              <div className="flex justify-between pt-6 border-t bg-background/50 backdrop-blur-sm sticky bottom-0 z-10 p-4 rounded-lg border shadow-sm">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button onClick={handleSave} className="gap-2 min-w-[150px]">
                  <Check className="h-4 w-4" />{" "}
                  {editingUserId ? "Update User" : "Complete Enrollment"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
