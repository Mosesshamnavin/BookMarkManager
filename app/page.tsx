import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Bookmark, Github, Chrome, Globe, Shield } from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="bg-blue-500 p-2 rounded-xl text-white shadow-lg shadow-blue-500/30">
            <Bookmark size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">MarkIt</span>
        </div>
        <Link href="/login" className="btn-secondary">
          Sign In
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="animate-fade-in space-y-8 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full text-sm font-medium border border-blue-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Real-time Bookmark Manager
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-b from-white to-slate-400">
            Save everything.
            <br />
            Organize better.
          </h1>

          <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
            A premium bookmark manager built with Next.js and Supabase. Sync
            across tabs in real-time and keep your links secure and private.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/login" className="btn-primary text-lg px-8 py-3">
              Get Started for Free
            </Link>
            <a
              href="https://github.com"
              className="btn-secondary text-lg px-8 py-3"
            >
              <Github size={20} />
              View Source
            </a>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mt-32 px-4">
          <FeatureCard
            icon={<Chrome className="text-blue-400" />}
            title="Access Anywhere"
            description="Manage your bookmarks from any browser or device with ease."
          />
          <FeatureCard
            icon={<Globe className="text-indigo-400" />}
            title="Real-time Sync"
            description="Add a bookmark in one tab, see it immediately in all others."
          />
          <FeatureCard
            icon={<Shield className="text-emerald-400" />}
            title="Privacy First"
            description="Your bookmarks are encrypted and only accessible by you."
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-slate-500 text-sm">
        <p>© 2024 MarkIt. Built with passion and Next.js.</p>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="card text-left space-y-4">
      <div className="bg-slate-800 w-12 h-12 rounded-xl flex items-center justify-center border border-white/10">
        {icon}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}
