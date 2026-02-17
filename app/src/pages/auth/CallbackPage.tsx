import { useEffect, useRef } from "react";
import { useTokenExchange } from "@/hooks/auth-hooks";
import { useAuth, type AuthUser, type UserRole } from "@/lib/auth-context";
import { useLocation, useRoute } from "wouter";
import { Loader2 } from "lucide-react";
import { jwtDecode } from "jwt-decode";

export function CallbackPage() {
    const exchangeToken = useTokenExchange();
    const { setAuthUser } = useAuth();
    const [, setLocation] = useLocation();
    const [match, params] = useRoute("/login/oauth2/code/react-client");
    const processedRef = useRef(false);

    useEffect(() => {
        // Prevent double execution in strict mode
        if (processedRef.current) return;
        processedRef.current = true;

        const handleCallback = async () => {
            try {
                const { tokens, userinfo } = await exchangeToken();
                console.log("User Info from OIDC:", userinfo);

                if (tokens.access_token) {
                    localStorage.setItem("access_token", tokens.access_token);
                }
                if (tokens.id_token) {
                    localStorage.setItem("id_token", tokens.id_token);
                }

                const email = userinfo.email as string;
                let role: UserRole = "student"; // Default fallback
                let department = "General";

                // Decode Access Token to find roles
                if (tokens.access_token) {
                    try {
                        const decoded: any = jwtDecode(tokens.access_token);
                        console.log("Decoded Access Token:", decoded);

                        // Look for roles in common locations
                        // 1. realm_access.roles (Keycloak)
                        // 2. roles (Simple JWT)
                        // 3. resource_access.client.roles

                        let foundRoles: string[] = [];

                        if (decoded.realm_access?.roles) {
                            foundRoles = decoded.realm_access.roles;
                        } else if (Array.isArray(decoded.roles)) {
                            foundRoles = decoded.roles;
                        } else if (decoded.resource_access?.["react-client"]?.roles) {
                            foundRoles = decoded.resource_access["react-client"].roles;
                        }

                        // Map found roles to system roles
                        // Priority: Super Admin > Admin > Staff > Teacher > Student
                        const validRoles: UserRole[] = ["super_admin", "admin", "staff", "teacher", "student"];

                        // Normalize found roles to lowercase for comparison
                        const normalizedFoundRoles = foundRoles.map(r => r.toLowerCase());
                        const matchedRole = validRoles.find(r => normalizedFoundRoles.includes(r));

                        if (matchedRole) {
                            role = matchedRole;
                        }

                    } catch (e) {
                        console.error("Failed to decode token for roles:", e);
                    }
                }

                // Construct AuthUser object
                const user: AuthUser = {
                    id: userinfo.sub || "unknown",
                    name: (userinfo.name as string) || (userinfo.preferred_username as string) || (userinfo.given_name as string) || (userinfo.nickname as string) || (userinfo.email as string) || "User",
                    email: email || "unknown@example.com",
                    role: role,
                    department: department,
                    avatarUrl: (userinfo.picture as string) || undefined,
                    // Add default values for required fields to avoid type errors
                    User_Id: "OIDC_" + (userinfo.sub?.substring(0, 8) || "USER"),
                };

                setAuthUser(user);

                // Redirect to dashboard
                setLocation("/dashboard");
            } catch (error) {
                console.error("Token exchange failed", error);
                // Handle error (maybe redirect back to login with error param)
                setLocation("/login?error=auth_failed");
            }
        };

        handleCallback();
    }, [exchangeToken, setAuthUser, setLocation]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h2 className="text-xl font-semibold">Authenticating...</h2>
            <p className="text-muted-foreground">Please wait while we log you in.</p>
        </div>
    );
}
