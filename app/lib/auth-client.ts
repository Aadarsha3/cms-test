import * as client from "openid-client";

// Core OIDC configurations from environment variables
const issuer = new URL(import.meta.env.VITE_AUTH_SERVER_URL || "http://localhost:8001");
const clientId = import.meta.env.VITE_OIDC_CLIENT_ID || "react-client";
const redirectUri = import.meta.env.VITE_OIDC_REDIRECT_URI;

let configCache: client.Configuration | undefined = undefined;

/**
 * Discovers OIDC server metadata and builds the client configuration.
 * Results are cached to avoid redundant network calls.
 */
export async function getAuthConfig(): Promise<client.Configuration> {
    if (configCache) return configCache;

    configCache = await client.discovery(
        issuer,
        clientId,
        {
            authorization_signed_response_alg: "ES256",
            id_token_signed_response_alg: "ES256",
        },
        undefined,
        {
            execute: [client.allowInsecureRequests],
            algorithm: "oidc",
        }
    );

    return configCache;
}

/**
 * Initiates the PKCE Authorization Code flow.
 * Persists PKCE state using provided setters before redirecting to the issuer.
 */
export async function authCodeFlow(
    onSetState: (state: string) => void,
    onSetCodeVerifier: (codeVerifier: string) => void
) {
    const config = await getAuthConfig();
    const scope = "openid email profile";
    
    // Generate PKCE code verifier and challenge
    const code_verifier = client.randomPKCECodeVerifier();
    onSetCodeVerifier(code_verifier);
    
    const code_challenge = await client.calculatePKCECodeChallenge(code_verifier);
    const state = client.randomState();
    onSetState(state);

    const parameters: Record<string, string> = {
        redirect_uri: redirectUri,
        scope,
        code_challenge,
        code_challenge_method: "S256",
        state,
    };

    const authorizationUrl = client.buildAuthorizationUrl(config, parameters);
    window.location.href = authorizationUrl.href;
}

/**
 * Exchanges an authorization code for OIDC tokens.
 * Validates state and PKCE verifier during the grant.
 */
export async function tokenExchange(
    captureUrl: () => URL,
    expectedState: string,
    codeVerifier: string
): Promise<client.TokenEndpointResponse> {
    const config = await getAuthConfig();

    return await client.authorizationCodeGrant(config, captureUrl(), {
        pkceCodeVerifier: codeVerifier,
        expectedState: expectedState,
    });
}

/**
 * Fetches user profile information from the OIDC UserInfo endpoint.
 */
export async function fetchProfile(accessToken: string, subject: string) {
    const config = await getAuthConfig();
    return await client.fetchUserInfo(config, accessToken, subject);
}

/**
 * Terminates the user session by redirecting to the server's end_session_endpoint.
 */
export async function signOutRedirect(idTokenHint?: string) {
    const config = await getAuthConfig();
    const endSessionEndpoint = config.serverMetadata().end_session_endpoint;

    if (!endSessionEndpoint) {
        console.warn("[Auth] End session endpoint not found. Clearing local session only.");
        window.location.href = window.location.origin;
        return;
    }

    const logoutUrl = new URL(endSessionEndpoint);
    if (idTokenHint) {
        logoutUrl.searchParams.set("id_token_hint", idTokenHint);
    }
    
    logoutUrl.searchParams.set("client_id", clientId);
    logoutUrl.searchParams.set("post_logout_redirect_uri", window.location.origin);

    window.location.href = logoutUrl.href;
}
