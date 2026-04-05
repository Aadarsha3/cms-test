import { useLocalStorage, useMediaQuery } from "@uidotdev/usehooks";
import type {
  IDToken,
  TokenEndpointResponse,
  UserInfoResponse,
} from "oauth4webapi";

// Storage hooks for OIDC State and PKCE Code Verifier.

export const useAuthState = () => useLocalStorage<string | undefined>("auth:state", undefined);
export const useCodeVerifier = () => useLocalStorage<string | undefined>("auth:code_verifier", undefined);

export type Auth = {
  tokens: TokenEndpointResponse;
  userinfo: IDToken & UserInfoResponse;
};

export const useTokens = () => useLocalStorage<Auth | undefined>("auth:tokens", undefined);
export type ThemeName = "light" | "dark";
export const useThemeStorage = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  return useLocalStorage<ThemeName>(
    "theme",
    prefersDarkMode ? "dark" : "light"
  );
};
