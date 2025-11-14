"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Only redirect after auth loading is complete AND user is definitely null
    if (!loading && !user && !isRedirecting) {
      setIsRedirecting(true);
      // Small delay to ensure Firebase auth state has fully initialized
      const timer = setTimeout(() => {
        router.push("/auth/login");
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [user, loading, router, isRedirecting]);

  // Show loading while auth is initializing or while redirecting
  if (loading || (!user && isRedirecting)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  // Don't render anything if no user (prevents flash of content before redirect)
  if (!user) {
    return null;
  }

  return <>{children}</>;
}
