import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import {
    AccountFormData,
    ProfileFormData,
    StudentFormData,
    StaffRequest,
    roleLabels,
} from "@/pages/users/user.types";

const initialAccountData: AccountFormData = {
    firstName: "",
    lastName: "",
    userId: "",
    email: "",
    password: "",
    joinDate: new Date().toISOString().split('T')[0],
};

const initialProfileData: ProfileFormData = {
    role: "",
    subRoles: [],
    phone: "",
    status: "active",
};

const initialStudentData: StudentFormData = {
    dateOfBirth: "",
    gender: "",
    presentAddress: "",
    phoneNumber: "",
    guardianName: "",
    guardianPhoneNumber: "",
    guardianRelation: "",
};

export function useEnrollmentForm() {
    const { toast } = useToast();
    const [location, setLocation] = useLocation();

    // Parse editing ID from URL
    const match = location.match(/\/users\/([^\/]+)\/edit/);
    const editingUserId = match ? match[1] : null;

    const searchParams = new URLSearchParams(window.location.search);
    const context = searchParams.get("context");

    const allowedRoles = useMemo(() => {
        if (context === "student") return ["student"];
        if (context === "staff") return ["staff", "admin", "teacher"];
        return ["student", "teacher", "staff", "admin"];
    }, [context]);

    const [currentStep, setCurrentStep] = useState(1);
    const [createdUserId, setCreatedUserId] = useState<string | null>(null);

    // Form States
    const [accountData, setAccountData] = useState<AccountFormData>(initialAccountData);
    const [profileData, setProfileData] = useState<ProfileFormData>(() => {
        let initialRole = "";
        let initialGroup = undefined;

        if (context === "student") {
            initialRole = "student";
            // Group will be auto-assigned after fetching from API
        } else if (context === "staff") {
            initialRole = "";
            initialGroup = undefined;
        }

        return {
            ...initialProfileData,
            role: initialRole,
            group: initialGroup,
        };
    });
    const [studentData, setStudentData] = useState<StudentFormData>(initialStudentData);

    // Uploads
    const [avatarUpload, setAvatarUpload] = useState<string | null>(null);
    const [newDocuments, setNewDocuments] = useState<any[]>([]);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
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
                            password: "",
                            joinDate: (typeof userToEdit.createdAt === 'string' ? userToEdit.createdAt.split('T')[0] :
                                Array.isArray(userToEdit.createdDate) ? `${userToEdit.createdDate[0]}-${String(userToEdit.createdDate[1]).padStart(2, '0')}-${String(userToEdit.createdDate[2]).padStart(2, '0')}` :
                                    new Date().toISOString().split('T')[0]),
                        });

                        setProfileData({
                            role: userToEdit.role || "student",
                            subRoles: userToEdit.subRoles || [],
                            phone: userToEdit.phone || "",
                            status: userToEdit.status || "active",
                        });

                        if (userToEdit.role === "student") {
                            setStudentData({
                                dateOfBirth: userToEdit.dateOfBirth || "",
                                gender: userToEdit.gender || "",
                                presentAddress: userToEdit.presentAddress || "",
                                phoneNumber: userToEdit.phone || userToEdit.phoneNumber || "",
                                guardianName: userToEdit.guardianName || "",
                                guardianPhoneNumber: userToEdit.guardianPhoneNumber || userToEdit.guardianContact || "",
                                guardianRelation: userToEdit.guardianRelation || userToEdit.guardianRelationship || "",
                            });
                        }
                    }
                } catch (err) {
                    console.error("Failed to load user for editing", err);
                    setError("Failed to load user data");
                }
            }
        };
        fetchUserForEdit();
    }, [editingUserId]);

    const handleNextStep = async () => {
        setError(null);
        if (currentStep === 1) {
            if (!accountData.firstName.trim())
                return setError("First Name is required");
            if (!accountData.lastName.trim())
                return setError("Last Name is required");
            if (!accountData.userId.trim())
                return setError("User ID is required");
            if (!accountData.email.trim())
                return setError("Email is required");

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(accountData.email.trim())) {
                return setError("Invalid Email Format: Please enter a valid email address.");
            }

            if (!accountData.password.trim() || accountData.password.length < 6) {
                if (!editingUserId) {
                    return setError("Password must be at least 6 characters");
                }
            }

            try {
                if (!editingUserId && !createdUserId) {
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
                        toast({
                            title: "User created successfully",
                            description: "Proceed to complete profile.",
                        });
                    }
                }

                setCurrentStep(2);
            } catch (err: any) {
                console.error("Failed to create user:", err);
                const serverMessage = err.response?.data?.detail || err.message;
                setError(serverMessage);
            }
        } else if (currentStep === 2) {
            // For student context, skip group assignment — student creation is handled in handleSave
            if (context === "student") {
                setCurrentStep(3);
                return;
            }

            if (!profileData.role) {
                return setError("Please select a group");
            }

            const targetUserId = editingUserId || createdUserId;
            if (!targetUserId) {
                return setError("Error: User ID missing. Cannot assign group without user ID.");
            }

            try {
                const { userApi: api } = await import("@/lib/api");

                // Ensure hydration: fallback to ID if object is missing but role exists
                const groupObject = profileData.group || { id: profileData.role, name: profileData.role };

                console.log("[DEBUG] Assigning Group:", {
                    userId: targetUserId,
                    group: groupObject,
                    rawRole: profileData.role
                });

                // Assign the user to the selected group via POST with groupId in the path
                console.log("[DEBUG] POST /users/" + targetUserId + "/groups/" + groupObject.id);
                await api.post(`/users/${targetUserId}/groups/${groupObject.id}`);

                toast({ title: "Group assigned successfully" });
                setCurrentStep(3);
            } catch (err: any) {
                console.error("Failed to assign group:", err);
                setError(err.response?.data?.message || err.message || "Could not assign group to user");
            }
        }
    };

    const handleSave = async () => {
        setError(null);
        if (!profileData.phone.trim()) {
            return setError("Phone number is required");
        }

        const isStudent = context === "student" || profileData.role === "student";

        if (isStudent) {
            if (
                !studentData.dateOfBirth ||
                !studentData.gender ||
                !studentData.presentAddress.trim() ||
                !studentData.guardianName.trim() ||
                !studentData.guardianPhoneNumber.trim() ||
                !studentData.guardianRelation.trim()
            ) {
                return setError("Please fill in all student details");
            }
        }

        const fullName = `${accountData.firstName.trim()} ${accountData.lastName.trim()}`;

        try {
            const { userApi: api, dashboardApi } = await import("@/lib/api");
            const targetUserId = editingUserId || createdUserId;

            if (!targetUserId) {
                return setError("Error: User ID missing");
            }

            if (isStudent && !editingUserId) {
                // Use POST /api/v1/students to create the student and finish enrollment
                const studentPayload = {
                    userId: targetUserId,
                    fullName: fullName,
                    email: accountData.email.trim(),
                    dateOfBirth: studentData.dateOfBirth,
                    phoneNumber: profileData.phone,
                    presentAddress: studentData.presentAddress,
                    gender: studentData.gender,
                    guardianName: studentData.guardianName,
                    guardianPhoneNumber: studentData.guardianPhoneNumber,
                    guardianRelation: studentData.guardianRelation,
                };

                console.log("[DEBUG] POST /students payload:", studentPayload);
                const res = await dashboardApi.post("/students", studentPayload);
                const newId = res.data.id || targetUserId;

                toast({ title: "Student enrolled successfully" });
                setLocation(`/student/${newId}`);
            } else if ((context === "staff" || ["staff", "admin", "teacher"].includes(profileData.role)) && !editingUserId) {
                // Use POST /api/v1/staffs to create the staff and finish enrollment
                const staffPayload: StaffRequest = {
                    userId: targetUserId,
                    fullName: fullName,
                    email: accountData.email.trim(),
                    dateOfBirth: studentData.dateOfBirth,
                    gender: studentData.gender,
                    address: studentData.presentAddress,
                    phoneNumber: profileData.phone,
                    designation: profileData.group?.name || (roleLabels[profileData.role] || profileData.role),
                    joinDate: accountData.joinDate,
                };

                console.log("[DEBUG] POST /staffs payload:", staffPayload);
                const res = await dashboardApi.post("/staffs", staffPayload);
                const newId = res.data.id || targetUserId;

                toast({ title: "Staff enrolled successfully" });
                setLocation(`/staff/${newId}`);
            } else {
                // Staff / edit flow
                const payload = {
                    name: fullName,
                    role: profileData.role,
                    phone: profileData.phone,
                    status: profileData.status,
                    subRoles: profileData.subRoles,
                    dateOfBirth: studentData.dateOfBirth,
                    gender: studentData.gender,
                    presentAddress: studentData.presentAddress,
                    joinedAt: accountData.joinDate,
                };

                if (!accountData.password) delete (payload as any).password;

                await api.put(`/users/${targetUserId}`, payload);
                toast({ title: "User profile updated successfully" });

                if (context === "staff" || ["staff", "admin", "teacher"].includes(profileData.role)) {
                    setLocation("/staff");
                } else {
                    setLocation("/dashboard");
                }
            }
        } catch (err: any) {
            console.error("Failed to save user details:", err);
            setError(err.response?.data?.message || err.message || "Could not save user details");
        }
    };

    const goBack = () => {
        if (editingUserId) {
            if (context === "student") setLocation(`/student/${editingUserId}`);
            else if (context === "staff") setLocation(`/staff/${editingUserId}`);
            else setLocation(`/users/${editingUserId}`);
        } else if (context === "student") setLocation("/students");
        else if (context === "staff") setLocation("/staff");
        else setLocation("/dashboard");
    };

    return {
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
        location,
        setLocation,
        error,
        setError,
        allowedRoles,
        goBack,
        context
    };
}
