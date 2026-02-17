import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { useAuthCodeFlow } from "@/hooks/auth-hooks";

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const onLogin = useAuthCodeFlow();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  const quickLogin = async (role: string) => {
    handleSubmit({ preventDefault: () => { } } as React.FormEvent);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#E3F2FD] p-4">
      {/* The "Big Box" Container */}
      <Card className="overflow-hidden shadow-2xl w-full max-w-5xl grid md:grid-cols-2 border-none ring-1 ring-gray-200">

        {/* Left Side - Image Box */}
        <div className="relative hidden md:flex flex-col items-center justify-center p-8 bg-gray-50 border-r border-gray-100">
          <div className="w-full max-w-sm">
            <img
              src="/login-illustration.png"
              alt="Campus Life"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Right Side - Login Form Box */}
        <div className="flex flex-col justify-center p-8 md:p-12 bg-white">
          <div className="w-full max-w-sm mx-auto space-y-8">
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="mb-2">
                <img
                  src="/logo.png"
                  alt="MetaHorizon College"
                  className="h-12 w-auto object-contain"
                />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                Welcome back
              </h1>
              <p className="text-sm text-gray-500">
                Sign in to your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full h-11 transition-all shadow-lg shadow-black/5 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Redirecting to Login..." : "Log In"}
                </Button>
              </div>
            </form>


          </div>
        </div>
      </Card>
    </div>
  );
}

