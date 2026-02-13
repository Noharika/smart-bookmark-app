"use client";
import { supabase } from "../lib/supabase";

export default function AuthButton() {
  const signInWithGitHub = async () => {
    const redirectTo =
      typeof window !== "undefined" ? window.location.origin : "http://localhost:3008";

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: 'http://localhost:3008/auth/callback' }, // <-- ensures Supabase sends the browser back to :3007
    });

    if (error) {
      console.error("GitHub OAuth error:", error);
      alert(error.message);
    } else {
      console.log("OAuth start URL:", data?.url);
    }
  };

  return (
    <button onClick={signInWithGitHub} className="rounded bg-blue-600 px-3 py-2 text-white">
      Sign in with Google
    </button>
  );
}