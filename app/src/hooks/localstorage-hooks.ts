import { useLocalStorage, useMediaQuery } from "@uidotdev/usehooks";
import type {
    IDToken,
    TokenEndpointResponse,
    UserInfoResponse,
} from "oauth4webapi";

export const useAuthState = () => useLocalStorage<string>("auth:state");

export const useCodeVerifier = () =>
    useLocalStorage<string>("auth:code_verifier");

export type Auth = {
    tokens: TokenEndpointResponse;
    userinfo: IDToken & UserInfoResponse;
};
export const useTokens = () => useLocalStorage<Auth | undefined>("auth:tokens");

export type ThemeName = "dark" | "light";
export const useThemeStorage = () => {
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    return useLocalStorage<ThemeName>(
        "theme",
        prefersDarkMode ? "dark" : "light"
    );
};
