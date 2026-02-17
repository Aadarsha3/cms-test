import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface UserRecord {
    id: string;
    name: string;
    email: string;
    role: string;
    subRoles?: string[];
    department: string;
    status: "active" | "inactive";
    phone?: string;
    User_Id?: string;
    password?: string; // First-time password set during enrollment
    universityId?: string;
    dateOfBirth?: string;
    gender?: "male" | "female" | "other";
    currentClass?: string;
    semester?: string;
    guardianName?: string;
    guardianContact?: string;
    guardianRelationship?: string;
    enrollmentDate?: string;
    enrolledCourses?: string[]; // Course codes student is enrolled in
    avatarUrl?: string;
    documents?: {
        id: string;
        name: string;
        type: string;
        size: string;
        uploadDate: string;
    }[];
}

const mockUsers: UserRecord[] = [
    {
        id: "1",
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@college.edu",
        role: "super_admin",
        department: "Administration",
        status: "active",
        phone: "+1 555-0101",
        User_Id: "SA2024001",
    },
    {
        id: "12",
        name: "Prof. Alan Turing",
        email: "deptadmin@college.edu",
        role: "admin",
        department: "Computer Science",
        status: "active",
        phone: "+1 555-0110",
        User_Id: "ADM2024002",
    },
    {
        id: "2",
        name: "Prof. Michael Chen",
        email: "michael.chen@college.edu",
        role: "staff",
        department: "Computer Science",
        status: "active",
        phone: "+1 555-0102",
        User_Id: "STF2024001",
    },
    {
        id: "3",
        name: "Emily Parker",
        email: "emily.parker@student.college.edu",
        role: "student",
        department: "Computer Science",
        User_Id: "COL2024001",
        universityId: "UNI2024001",
        dateOfBirth: "2002-05-15",
        gender: "female",
        currentClass: "BCS Year 3",
        semester: "5",
        guardianName: "Robert Parker",
        guardianContact: "+1 555-0150",
        guardianRelationship: "Father",
        enrollmentDate: "2024-09-01",
        status: "active",
        phone: "+1 555-0103",
        enrolledCourses: ["CS101", "CS201", "CS301"], // Enrolled courses
        documents: [
            {
                id: "doc1",
                name: "High School Transcript.pdf",
                type: "application/pdf",
                size: "2.4 MB",
                uploadDate: "2024-08-15",
            },
            {
                id: "doc2",
                name: "ID Proof.jpg",
                type: "image/jpeg",
                size: "1.1 MB",
                uploadDate: "2024-08-20",
            }
        ]
    },
    {
        id: "4",
        name: "Dr. Lisa Wang",
        email: "lisa.wang@college.edu",
        role: "staff",
        department: "Computer Science",
        status: "active",
        phone: "+1 555-0104",
    },
    {
        id: "5",
        name: "James Wilson",
        email: "james.wilson@student.college.edu",
        role: "student",
        department: "Business Administration",
        User_Id: "COL2024002",
        universityId: "UNI2024002",
        dateOfBirth: "2001-08-22",
        gender: "male",
        currentClass: "MBA Year 1",
        semester: "2",
        guardianName: "Mary Wilson",
        guardianContact: "+1 555-0160",
        guardianRelationship: "Mother",
        enrollmentDate: "2024-09-01",
        status: "active",
        enrolledCourses: ["MBA501"], // Enrolled in MBA course only
    },
    {
        id: "6",
        name: "Robert Lee",
        email: "robert.lee@student.college.edu",
        role: "student",
        department: "Mechanical Engineering",
        User_Id: "COL2023015",
        universityId: "UNI2023015",
        dateOfBirth: "2000-11-10",
        gender: "male",
        currentClass: "BME Year 4",
        semester: "7",
        guardianName: "Jennifer Lee",
        guardianContact: "+1 555-0170",
        guardianRelationship: "Mother",
        enrollmentDate: "2023-09-01",
        status: "inactive",
        enrolledCourses: ["ME301"],
    },
    {
        id: "7",
        name: "Alice Williams",
        email: "alice.williams@student.college.edu",
        role: "student",
        department: "Computer Science",
        User_Id: "COL2024003",
        universityId: "UNI2024003",
        dateOfBirth: "2003-03-15",
        gender: "female",
        currentClass: "BCS Year 1",
        semester: "1",
        guardianName: "David Williams",
        guardianContact: "+1 555-0180",
        guardianRelationship: "Father",
        enrollmentDate: "2024-09-01",
        status: "active",
        enrolledCourses: ["CS101"],
        phone: "+1 555-0105",
    },
    {
        id: "8",
        name: "Bob Brown",
        email: "bob.brown@student.college.edu",
        role: "student",
        department: "Computer Science",
        User_Id: "COL2024004",
        universityId: "UNI2024004",
        dateOfBirth: "2002-07-20",
        gender: "male",
        currentClass: "BCS Year 2",
        semester: "3",
        guardianName: "Susan Brown",
        guardianContact: "+1 555-0190",
        guardianRelationship: "Mother",
        enrollmentDate: "2024-09-01",
        status: "active",
        enrolledCourses: ["CS201"],
        phone: "+1 555-0106",
    },
    {
        id: "9",
        name: "Charlie Davis",
        email: "charlie.davis@student.college.edu",
        role: "student",
        department: "Mechanical Engineering",
        User_Id: "COL2024005",
        universityId: "UNI2024005",
        dateOfBirth: "2001-12-05",
        gender: "male",
        currentClass: "BME Year 3",
        semester: "5",
        guardianName: "Michael Davis",
        guardianContact: "+1 555-0200",
        guardianRelationship: "Father",
        enrollmentDate: "2024-09-01",
        status: "active",
        enrolledCourses: ["ME301", "ME302"],
        phone: "+1 555-0107",
    },
    {
        id: "10",
        name: "Diana Evans",
        email: "diana.evans@student.college.edu",
        role: "student",
        department: "Computer Science",
        User_Id: "COL2024006",
        universityId: "UNI2024006",
        dateOfBirth: "2003-09-12",
        gender: "female",
        currentClass: "BCS Year 1",
        semester: "1",
        guardianName: "Karen Evans",
        guardianContact: "+1 555-0210",
        guardianRelationship: "Mother",
        enrollmentDate: "2024-09-01",
        status: "active",
        enrolledCourses: ["CS101"],
        phone: "+1 555-0108",
    },
    {
        id: "11",
        name: "Evan Wright",
        email: "evan.wright@student.college.edu",
        role: "student",
        department: "Business Administration",
        User_Id: "COL2024007",
        universityId: "UNI2024007",
        dateOfBirth: "2000-05-25",
        gender: "male",
        currentClass: "MBA Year 1",
        semester: "1",
        guardianName: "Thomas Wright",
        guardianContact: "+1 555-0220",
        guardianRelationship: "Father",
        enrollmentDate: "2024-09-01",
        status: "active",
        enrolledCourses: ["MBA501", "MBA502"],
        phone: "+1 555-0109",
    },
];

interface UserContextType {
    users: UserRecord[];
    addUser: (user: UserRecord) => void;
    updateUser: (id: string, updates: Partial<UserRecord>) => void;
    deleteUser: (id: string) => void;
    getUser: (id: string) => UserRecord | undefined;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [users, setUsers] = useState<UserRecord[]>(() => {
        try {
            const stored = localStorage.getItem("app_users");
            return stored ? JSON.parse(stored) : mockUsers;
        } catch (e) {
            console.error("Failed to load users from localStorage", e);
            return mockUsers;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem("app_users", JSON.stringify(users));
        } catch (e) {
            console.error("Failed to save users to localStorage", e);
        }
    }, [users]);

    const addUser = (user: UserRecord) => {
        setUsers((prev) => [...prev, user]);
    };

    const updateUser = (id: string, updates: Partial<UserRecord>) => {
        setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
    };

    const deleteUser = (id: string) => {
        setUsers((prev) => prev.filter((u) => u.id !== id));
    };

    const getUser = (id: string) => {
        return users.find((u) => u.id === id);
    };

    return (
        <UserContext.Provider value={{ users, addUser, updateUser, deleteUser, getUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
