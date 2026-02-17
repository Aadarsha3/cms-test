import { useIsClient } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useTokenExchange } from "~/hooks/auth-hooks";
import { useTokens } from "~/hooks/localstorage-hooks";

export default function Callback() {
  const getTokenResponse = useTokenExchange();
  const navigate = useNavigate();
  const isClient = useIsClient();
  const [, setTokens] = useTokens();
  const [error, setError] = useState<any>(undefined);

  useEffect(() => {
    isClient &&
      getTokenResponse().then((response) => {
        if (response.tokens) {
          setTokens(response);
          navigate("/dashboard");
        }
      });
  }, [isClient]);

  return error ? (
    <div> {error} </div>
  ) : (
    <div>Waiting for Authentication...</div>
  );
}
