import { type IDToken } from "oauth4webapi";
import { authCodeFlow, tokenExchange } from "@/lib/auth-client";
import { useAuthState, useCodeVerifier } from "./localstorage-hooks";

export function useAuthCodeFlow() {
    const [, setState] = useAuthState();
    const [, setCodeVerifier] = useCodeVerifier();

    return async () => {
        await authCodeFlow(setState, setCodeVerifier);
    };
}

export function useTokenExchange() {
    const [code_verifier] = useCodeVerifier();
    const [state] = useAuthState();

    return async () => {
        const tokens = await tokenExchange(
            () => new URL(window.location.href),
            state,
            code_verifier
        );

        const claims: IDToken = (tokens.claims as any)?.();
        const userinfo = claims;
        // const userinfo = await userInfo(tokens.access_token, claims?.sub);

        return { tokens, userinfo };
    };
}
