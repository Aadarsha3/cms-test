import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuthCodeFlow } from "@/hooks/auth-hooks";
import { LoginView } from "./LoginView";

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const onLogin = useAuthCodeFlow();

  useEffect(() => {
    const expired = localStorage.getItem('sessionExpired');
    if (expired === 'true') {
      localStorage.removeItem('sessionExpired');
      setIsLoading(true);
      onLogin().catch((err) => {
        console.error("Auto-reauth failed:", err);
        setIsLoading(false);
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsLoading(true);
    try {
      await onLogin();
    } catch (error) {
      console.error("Login failed", error);
      toast({
        title: "Sign in failed",
        description: "Could not initiate login flow.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return <LoginView isLoading={isLoading} handleSubmit={handleSubmit} />;
}
