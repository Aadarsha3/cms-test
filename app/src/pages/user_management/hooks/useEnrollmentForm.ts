import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import {
    AccountFormData,
    ProfileFormData,
    StudentFormData,
} from "../users";

// Default initial states
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

    const [currentStep, setCurrentStep] = useState(1);
    const [createdUserId, setCreatedUserId] = useState<string | null>(null);

    // Form States
    const [accountData, setAccountData] = useState<AccountFormData>(initialAccountData);
    const [profileData, setProfileData] = useState<ProfileFormData>(initialProfileData);
    const [studentData, setStudentData] = useState<StudentFormData>(initialStudentData);

    // Uploads
    const [avatarUpload, setAvatarUpload] = useState<string | null>(null);
    const [newDocuments, setNewDocuments] = useState<any[]>([]);

    // 1. Fetch user data if in "Edit Mode"
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
    }, [editingUserId, toast]);


    // 2. Handle Logic for Next Step
    const handleNextStep = async () => {
        if (currentStep === 1) {
            // Validate Step 1
            if (!accountData.firstName.trim())
                return toast({ title: "First Name is required", variant: "destructive" });
            if (!accountData.lastName.trim())
                return toast({ title: "Last Name is required", variant: "destructive" });
            if (!accountData.userId.trim())
                return toast({ title: "User ID is required", variant: "destructive" });
            if (!accountData.email.trim())
                return toast({ title: "Email is required", variant: "destructive" });

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(accountData.email.trim())) {
                return toast({
                    title: "Invalid Email Format",
                    description: "Please enter a valid email address.",
                    variant: "destructive",
                });
            }

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
                        toast({
                            title: "User created successfully",
                            description: "Proceed to complete profile.",
                        });
                    }
                }

                setCurrentStep(2);
            } catch (err: any) {
                console.error("Failed to create user:", err);
                toast({
                    title: "Failed to create user",
                    description:
                        err.response?.data?.message || err.message || "Could not create user",
                    variant: "destructive",
                });
            }
        } else if (currentStep === 2) {
            if (!profileData.role) {
                return toast({ title: "Please select a role", variant: "destructive" });
            }

            const targetUserId = editingUserId || createdUserId;
            if (!targetUserId) {
                return toast({
                    title: "Error: User ID missing",
                    description: "Cannot assign role without user ID.",
                    variant: "destructive",
                });
            }

            try {
                const { userApi: api } = await import("@/lib/api");
                // Convert role to uppercase for authority (e.g., student -> STUDENT)
                const authority = profileData.role.toUpperCase();

                await api.post(`/users/${targetUserId}/authorities`, {
                    authority: authority,
                });

                toast({ title: "Role assigned successfully" });
                setCurrentStep(3);
            } catch (err: any) {
                console.error("Failed to assign role:", err);
                toast({
                    title: "Failed to assign role",
                    description:
                        err.response?.data?.message ||
                        err.message ||
                        "Could not assign role to user",
                    variant: "destructive",
                });
            }
        }
    };


    // 3. Handle Saving Final Details
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
        setLocation
    };
}
