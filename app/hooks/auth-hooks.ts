import { useCallback } from 'react';
import { type IDToken } from "oauth4webapi";
import { authCodeFlow, tokenExchange } from "@/lib/auth-client";
import { useAuthState, useCodeVerifier } from "./localstorage-hooks";
import { jwtDecode } from "jwt-decode";

/**
 * Returns a function that initiates the PKCE authorization code flow.
 * Calling it redirects the browser to the OIDC provider.
 */
export function useAuthCodeFlow() {
  const [, setState] = useAuthState();
  const [, setCodeVerifier] = useCodeVerifier();

  return useCallback(async () => {
    // Passes the storage setters to our OIDC client library
    await authCodeFlow(
        (s) => setState(s), 
        (cv) => setCodeVerifier(cv)
    );
  }, [setState, setCodeVerifier]);
}

/**
 * Returns a function that completes the authorization code exchange.
 * Call this once on the callback page.
 */
export function useTokenExchange() {
  const [code_verifier, setCodeVerifier] = useCodeVerifier();
  const [state, setState] = useAuthState();

  return useCallback(async () => {
    // Ensure we have current state/verifier before attempting exchange
    const tokens = await tokenExchange(
      () => new URL(window.location.href),
      state || "",
      code_verifier || ""
    );

    // Safely extract claims from id_token if it exists in response
    const claims = tokens.id_token ? jwtDecode<IDToken>(tokens.id_token) : {} as IDToken;
    const userinfo = claims;

    // Clean up PKCE storage after successful exchange
    setState(undefined);
    setCodeVerifier(undefined);

    return { tokens, userinfo };
  }, [state, code_verifier, setState, setCodeVerifier]);
}
