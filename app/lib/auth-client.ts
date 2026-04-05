import * as client from "openid-client";

const server = new URL(import.meta.env.VITE_AUTH_SERVER_URL); // Authorization Server's Issuer Identifier
const clientId = import.meta.env.VITE_OIDC_CLIENT_ID; // Client identifier at the Authorization Server
// const clientSecret = 'secret'; // Client Secret

let config: client.Configuration | undefined = undefined;

export async function getAuthConfig() {
    if (config) return config;

    return (config = await client.discovery(
        server,
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
    ));
}

export async function authCodeFlow(
    setState: (state: string) => void,
    setCodeVerifier: (codeVerifier: string) => void
) {
    const config = await getAuthConfig();

    /**
     * Value used in the authorization request as the redirect_uri parameter, this
     * is typically pre-registered at the Authorization Server.
     */
    const redirect_uri = import.meta.env.VITE_OIDC_REDIRECT_URI;
    const scope = "openid email profile"; // Scope of the access request
    /**
     * PKCE: The following MUST be generated for every redirect to the
     * authorization_endpoint. You must store the code_verifier and state in the
     * end-user session such that it can be recovered as the user gets redirected
     * from the authorization server back to your application.
     */
    const code_verifier = client.randomPKCECodeVerifier();
    setCodeVerifier(code_verifier);
    let code_challenge: string =
        await client.calculatePKCECodeChallenge(code_verifier);

    let parameters: Record<string, string> = {
        redirect_uri,
        scope,
        code_challenge,
        code_challenge_method: "S256",
    };

    const state = client.randomState();
    setState(state);
    parameters.state = state;

    let redirectTo: URL = client.buildAuthorizationUrl(config, parameters);

    // now redirect the user to redirectTo.href
    console.log("redirecting to", redirectTo.href);
    window.location.href = redirectTo.href;
}

export async function tokenExchange(
    getCurrentUrl: (...args: any) => URL,
    state: string,
    code_verifier: string
) {
    const config = await getAuthConfig();

    let tokens: client.TokenEndpointResponse =
        await client.authorizationCodeGrant(config, getCurrentUrl(), {
            pkceCodeVerifier: code_verifier,
            expectedState: state,
        });

    console.log("Token Endpoint Response", tokens);
    return tokens;
}

export async function userInfo(access_token: string, sub: string) {
    const config = await getAuthConfig();
    let userInfo = await client.fetchUserInfo(config, access_token, sub);
    console.log("UserInfo Response", userInfo);
    return userInfo;
}

export async function signOutRedirect(id_token?: string) {
    const config = await getAuthConfig();
    const endSessionEndpoint = config.serverMetadata().end_session_endpoint;

    if (!endSessionEndpoint) {
        console.warn("No end_session_endpoint found in discovery document");
        return;
    }

    let url = new URL(endSessionEndpoint);
    if (id_token) {
        url.searchParams.set("id_token_hint", id_token);
    }
    
    // Add client_id requirement for modern Keycloak/Spring AS logout compliance
    url.searchParams.set("client_id", clientId);

    // Redirect back to the React app after successful backend logout.
    // This MUST match exactly the registered URL in the backend client config.
    url.searchParams.set("post_logout_redirect_uri", window.location.origin);

    console.log("Redirecting to logout:", url.href);
    window.location.href = url.href;
}
