import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import {
    AccountFormData,
    ProfileFormData,
    StudentFormData,
} from "../user.types";

const initialAccountData: AccountFormData = {
    firstName: "",
    lastName: "",
    userId: "",
    email: "",
    password: "",
};

const initialProfileData: ProfileFormData = {
    role: "student",
    subRoles: [],
    department: "",
    phone: "",
    status: "active",
};

const initialStudentData: StudentFormData = {
    universityId: "",
    dateOfBirth: "",
    gender: "",
    currentClass: "",
    semester: "",
    guardianName: "",
    guardianContact: "",
    guardianRelationship: "",
};

export function useEnrollmentForm() {
    const { toast } = useToast();
    const [location, setLocation] = useLocation();

    // Parse editing ID from URL
    const match = location.match(/\/users\/([^\/]+)\/edit/);
    const editingUserId = match ? match[1] : null;

    const searchParams = new URLSearchParams(window.location.search);
    const context = searchParams.get("context");

    let allowedRoles = ["student", "teacher", "staff", "admin", "super_admin"];
    if (context === "student") allowedRoles = ["student"];
    else if (context === "teacher") allowedRoles = ["teacher"];
    else if (context === "staff") allowedRoles = ["staff", "admin", "super_admin"];

    const [currentStep, setCurrentStep] = useState(1);
    const [createdUserId, setCreatedUserId] = useState<string | null>(null);

    // Form States
    const [accountData, setAccountData] = useState<AccountFormData>(initialAccountData);
    const [profileData, setProfileData] = useState<ProfileFormData>(() => {
        let initialRole = "student";
        if (context === "student" || context === "teacher" || context === "staff") {
            initialRole = context;
        }
        return {
            ...initialProfileData,
            role: initialRole,
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
                setError(err.response?.data?.message || err.message || "Could not create user");
            }
        } else if (currentStep === 2) {
            if (!profileData.role) {
                return setError("Please select a role");
            }

            const targetUserId = editingUserId || createdUserId;
            if (!targetUserId) {
                return setError("Error: User ID missing. Cannot assign role without user ID.");
            }

            try {
                const { userApi: api } = await import("@/lib/api");
                const authority = profileData.role.toUpperCase();

                await api.post(`/users/${targetUserId}/authorities`, {
                    authority: authority,
                });

                toast({ title: "Role assigned successfully" });
                setCurrentStep(3);
            } catch (err: any) {
                console.error("Failed to assign role:", err);
                setError(err.response?.data?.message || err.message || "Could not assign role to user");
            }
        }
    };

    const handleSave = async () => {
        setError(null);
        if (!profileData.department && profileData.role !== "super_admin") {
            return setError("Please select a Department");
        }
        if (!profileData.phone.trim()) {
            return setError("Phone number is required");
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
                return setError("Please fill in all student details");
            }
        }

        const fullName = `${accountData.firstName.trim()} ${accountData.lastName.trim()}`;

        const payload = {
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
                if (context === "student" || profileData.role === "student") setLocation("/students");
                else if (context === "teacher" || profileData.role === "teacher") setLocation("/teachers");
                else if (context === "staff" || ["staff", "admin", "super_admin"].includes(profileData.role)) setLocation("/staff");
                else setLocation("/dashboard");
            } else {
                setError("Error: User ID missing");
            }
        } catch (err: any) {
            console.error("Failed to save user details:", err);
            setError(err.response?.data?.message || err.message || "Could not save user details");
        }
    };

    const goBack = () => {
        if (editingUserId) setLocation(`/users/${editingUserId}`);
        else if (context === "student") setLocation("/students");
        else if (context === "teacher") setLocation("/teachers");
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
        goBack
    };
}
