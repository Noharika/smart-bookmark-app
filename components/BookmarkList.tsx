"use client";

import { supabase } from "../lib/supabase";
import { Bookmark } from "../types";
import { useEffect, useState } from "react";

export default function BookmarkList() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async (uid: string) => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });
    if (!error && data) setBookmarks(data as Bookmark[]);
  };

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const init = async () => {
      const { data } = await supabase.auth.getUser();
      const uid = data.user?.id ?? null;
      setUserId(uid);

      if (uid) {
        await fetchBookmarks(uid);

        channel = supabase
          .channel(`bookmarks-${uid}`)
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "bookmarks", filter: `user_id=eq.${uid}` },
            async () => fetchBookmarks(uid)
          )
          .subscribe();
      }
      setLoading(false);
    };

    init();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const onDelete = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
    if (userId) fetchBookmarks(userId);
  };

  if (loading) return <p className="text-sm text-gray-500">Loading bookmarks...</p>;
  if (!userId) return <p className="text-sm text-gray-500">Sign in to see your bookmarks.</p>;
  if (bookmarks.length === 0) return <p className="text-sm text-gray-500">No bookmarks yet. Add one!</p>;

  return (
    <ul className="divide-y divide-gray-200 dark:divide-gray-800 rounded-md border border-gray-200 dark:border-gray-800">
      {bookmarks.map((b) => (
        <li key={b.id} className="flex items-center justify-between p-3">
          <div>
            <a
              href={b.url}
              target="_blank"
              className="font-medium text-blue-600 hover:underline"
              rel="noreferrer"
            >
              {b.title}
            </a>
            <p className="text-xs text-gray-500">{b.url}</p>
          </div>
          <button
            onClick={() => onDelete(b.id)}
            className="rounded-md bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}