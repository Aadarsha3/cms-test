import { useEffect, useRef } from 'react';
import { useTokenExchange } from '@/hooks/auth-hooks';
import { useAuth, type AuthUser, type UserRole } from '@/lib/auth-context';
import { useLocation } from 'wouter';
import { jwtDecode } from 'jwt-decode';
import { CallbackView } from './CallbackView';

const VALID_ROLES: UserRole[] = ['admin', 'staff', 'teacher', 'student'];

function extractRoleFromToken(accessToken: string): UserRole {
    try {
        const decoded: any = jwtDecode(accessToken);

        // Collect roles from all common Keycloak/OIDC locations
        const candidates: string[] =
            decoded.realm_access?.roles ??
            (Array.isArray(decoded.roles) ? decoded.roles : []) ??
            decoded.resource_access?.['react-client']?.roles ??
            [];

        // Normalise and pick highest-priority match
        const normalised = candidates.map((r: string) => r.toLowerCase());
        return VALID_ROLES.find((r) => normalised.includes(r)) ?? 'student';
    } catch (e) {
        console.error('[CallbackPage] Failed to decode access token:', e);
        return 'student';
    }
}

export function CallbackPage() {
    const exchangeToken = useTokenExchange();
    const { setAuthUser } = useAuth();
    const [, setLocation] = useLocation();
    const processedRef = useRef(false);

    useEffect(() => {
        // Guard against React Strict Mode double-invoke
        if (processedRef.current) return;
        processedRef.current = true;

        async function handleCallback() {
            try {
                const { tokens, userinfo } = await exchangeToken();

                // Persist tokens
                if (tokens.access_token) localStorage.setItem('access_token', tokens.access_token);
                if (tokens.id_token) localStorage.setItem('id_token', tokens.id_token);
                if (tokens.refresh_token) localStorage.setItem('refresh_token', tokens.refresh_token);

                const role = tokens.access_token
                    ? extractRoleFromToken(tokens.access_token)
                    : 'student';

                const user: AuthUser = {
                    id: (userinfo.sub as string) ?? 'unknown',
                    name:
                        (userinfo.name as string) ??
                        (userinfo.preferred_username as string) ??
                        (userinfo.given_name as string) ??
                        (userinfo.email as string) ??
                        'User',
                    email: (userinfo.email as string) ?? 'unknown@example.com',
                    role,
                    avatarUrl: (userinfo.picture as string) ?? undefined,
                    User_Id: `OIDC_${((userinfo.sub as string) ?? '').substring(0, 8)}`,
                };

                setAuthUser(user);
                setLocation('/dashboard');
            } catch (error) {
                console.error('[CallbackPage] Token exchange failed:', error);
                setLocation('/login?error=auth_failed');
            }
        }

        handleCallback();
    }, [exchangeToken, setAuthUser, setLocation]);

    return <CallbackView />;
}