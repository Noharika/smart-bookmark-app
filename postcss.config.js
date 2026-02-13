"use client";

import AuthButton from "@/components/AuthButton";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/");
    });
  }, [router]);

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Smart Bookmark App</h1>
      <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
        Sign in with Google to start saving your private bookmarks.
      </p>
      <AuthButton />
    </main>
  );
}