import { useState, useCallback } from "react";
import { authCodeFlow, tokenExchange, userInfo } from "@/lib/auth-client";
import { useLocation } from "wouter";
import { jwtDecode } from "jwt-decode";

export function useAuthCodeFlow() {
  const [loading, setLoading] = useState(false);

  const login = useCallback(async () => {
    setLoading(true);
    try {
      const setState = (state: string) => localStorage.setItem("oauth_state", state);
      const setCodeVerifier = (cv: string) => localStorage.setItem("oauth_code_verifier", cv);
      await authCodeFlow(setState, setCodeVerifier);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }, []);

  return login;
}

export function useTokenExchange() {
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  const exchange = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const stateFromUrl = params.get("state") || "";
      const state = localStorage.getItem("oauth_state") || stateFromUrl;
      const cv = localStorage.getItem("oauth_code_verifier") || "";
      
      const tokens = await tokenExchange(() => new URL(window.location.href), state, cv);
      localStorage.removeItem("oauth_state");
      localStorage.removeItem("oauth_code_verifier");

      // Fetch UserInfo after exchange
      let userinfo: any = {};
      if (tokens.access_token) {
          const decoded: any = jwtDecode(tokens.access_token);
          userinfo = await userInfo(tokens.access_token, decoded.sub);
      }

      return { tokens, userinfo };
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return exchange;
}
