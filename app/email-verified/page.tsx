"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EmailVerifiedPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/sign-in"); 
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">✅ Email Verified</h1>
        <p className="text-lg">Your email has been verified successfully.</p>
        <p className="text-sm mt-2">Redirecting...</p>
      </div>
    </main>
  );
}
