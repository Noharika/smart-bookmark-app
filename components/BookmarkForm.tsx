"use client";

import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";

export default function BookmarkForm() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
    const { data: authSub } = supabase.auth.onAuthStateChange((_e, session) =>
      setUserId(session?.user.id ?? null)
    );
    return () => authSub.subscription.unsubscribe();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!userId) return setError("Please sign in first");
    if (!url.trim() || !title.trim()) return setError("Both URL and Title are required");

    setSubmitting(true);
    try {
      const { error } = await supabase.from("bookmarks").insert({
        url,
        title,
        user_id: userId, // RLS requires this match auth.uid()
      });
      if (error) throw error;
      setUrl("");
      setTitle("");
    } catch (err: any) {
      setError(err.message ?? "Failed to add bookmark");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-wrap gap-2">
      <input
        type="url"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="min-w-[260px] flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:bg-gray-900 dark:border-gray-700"
        required
      />
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="min-w-[160px] flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:bg-gray-900 dark:border-gray-700"
        required
      />
      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50"
      >
        {submitting ? "Adding..." : "Add"}
      </button>
      {error && <p className="basis-full text-sm text-red-600">{error}</p>}
    </form>
  );
}