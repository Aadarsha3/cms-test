import { useCallback } from 'react';
import { authCodeFlow, tokenExchange, userInfo } from '@/lib/auth-client';
import { jwtDecode } from 'jwt-decode';

/**
 * Returns a stable function that initiates the PKCE authorization code flow.
 * Calling it redirects the browser to the OIDC provider.
 */
export function useAuthCodeFlow() {
  return useCallback(async () => {
    const setState = (state: string) => localStorage.setItem('oauth_state', state);
    const setCodeVerifier = (cv: string) => localStorage.setItem('oauth_code_verifier', cv);
    await authCodeFlow(setState, setCodeVerifier);
  }, []);
}

/**
 * Returns a stable function that completes the authorization code exchange
 * and fetches the OIDC UserInfo. Call this once on the callback page.
 */
export function useTokenExchange() {
  return useCallback(async () => {
    const params = new URLSearchParams(window.location.search);

    // Prefer the state/verifier saved during the auth flow; fall back to URL
    const state =
      localStorage.getItem('oauth_state') ?? params.get('state') ?? '';
    const codeVerifier = localStorage.getItem('oauth_code_verifier') ?? '';

    const tokens = await tokenExchange(
      () => new URL(window.location.href),
      state,
      codeVerifier
    );

    // Clean up PKCE storage immediately after successful exchange
    localStorage.removeItem('oauth_state');
    localStorage.removeItem('oauth_code_verifier');

    let userinfo: Record<string, unknown> = {};
    if (tokens.access_token) {
      try {
        const decoded: any = jwtDecode(tokens.access_token);
        userinfo = await userInfo(tokens.access_token, decoded.sub);
      } catch (e) {
        console.error('[useTokenExchange] Failed to fetch userInfo:', e);
      }
    }

    return { tokens, userinfo };
  }, []);
}