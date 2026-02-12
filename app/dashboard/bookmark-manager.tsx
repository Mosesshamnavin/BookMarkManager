"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Trash2, Globe, ExternalLink, Search } from "lucide-react";

type Bookmark = {
  id: string;
  created_at: string;
  user_id: string;
  url: string;
  title: string;
};

export default function BookmarkManager({
  initialBookmarks,
  userId,
}: {
  initialBookmarks: Bookmark[];
  userId: string;
}) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");

  const supabase = createClient();

  useEffect(() => {
    // Set up real-time subscription
    const channel = supabase
      .channel("bookmarks-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setBookmarks((prev) => [payload.new as Bookmark, ...prev]);
          } else if (payload.eventType === "DELETE") {
            setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id));
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !title) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("bookmarks")
        .insert([{ url, title, user_id: userId }]);

      if (error) throw error;

      setUrl("");
      setTitle("");
    } catch (error) {
      console.error("Error adding bookmark:", error);
      alert("Failed to add bookmark");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("bookmarks").delete().eq("id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting bookmark:", error);
      alert("Failed to delete bookmark");
    }
  };

  const filteredBookmarks = bookmarks.filter(
    (b) =>
      b.title.toLowerCase().includes(filter.toLowerCase()) ||
      b.url.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      {/* Add Form */}
      <form onSubmit={handleAdd} className="card bg-slate-800/50 p-6 space-y-4">
        <div className="flex items-center gap-2 text-blue-400 mb-2">
          <Plus size={20} />
          <h2 className="font-semibold">Add New Bookmark</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Title (e.g. Google)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
            required
          />
          <input
            type="url"
            placeholder="URL (https://...)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="input-field"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full md:w-auto"
        >
          {loading ? "Adding..." : "Add Bookmark"}
        </button>
      </form>

      {/* Search/Filter */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          size={18}
        />
        <input
          type="text"
          placeholder="Search your bookmarks..."
          className="input-field pl-10"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {/* List */}
      <div className="grid gap-4">
        {filteredBookmarks.length === 0 ? (
          <div className="text-center py-12 card border-dashed border-white/10">
            <Globe className="mx-auto text-slate-600 mb-3" size={40} />
            <p className="text-slate-500">
              No bookmarks found. Start by adding one!
            </p>
          </div>
        ) : (
          filteredBookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="card group flex items-center justify-between p-4 bg-slate-900/40"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="bg-blue-500/10 p-2.5 rounded-xl border border-blue-500/20 text-blue-400 shrink-0">
                  <Globe size={20} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold truncate text-slate-100">
                    {bookmark.title}
                  </h3>
                  <p className="text-sm text-slate-500 truncate">
                    {bookmark.url}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                  <ExternalLink size={18} />
                </a>
                <button
                  onClick={() => handleDelete(bookmark.id)}
                  className="p-2 hover:bg-red-500/10 rounded-lg text-slate-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
