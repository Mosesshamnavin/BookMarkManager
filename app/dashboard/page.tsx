import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Bookmark, LogOut, User } from "lucide-react";
import BookmarkManager from "@/app/dashboard/bookmark-manager";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch initial bookmarks
  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("*")
    .order("created_at", { ascending: false });

  const handleSignOut = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-white/5 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-500 p-1.5 rounded-lg text-white">
              <Bookmark size={20} />
            </div>
            <span className="font-bold tracking-tight">MarkIt</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 text-sm">
              <User size={14} className="text-slate-400" />
              <span className="text-slate-200">{user.email}</span>
            </div>
            <form action={handleSignOut}>
              <button className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 p-2 rounded-lg hover:bg-white/5">
                <LogOut size={18} />
                <span className="sr-only md:not-sr-only text-sm font-medium">
                  Log out
                </span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 space-y-8 animate-fade-in">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Your Bookmarks</h1>
          <p className="text-slate-400">
            Manage and organize your saved links in real-time.
          </p>
        </div>

        <BookmarkManager initialBookmarks={bookmarks || []} userId={user.id} />
      </main>
    </div>
  );
}
