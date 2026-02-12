import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Bookmark } from "lucide-react";
import AuthButton from "@/app/login/auth-button";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full animate-fade-in space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-4 bg-blue-500 rounded-2xl text-white shadow-2xl shadow-blue-500/40 mb-4">
            <Bookmark size={40} />
          </div>
          <h2 className="text-3xl font-bold">Welcome back</h2>
          <p className="text-slate-400">
            Please sign in with your Google account to continue.
          </p>
        </div>

        <div className="card space-y-6">
          <AuthButton />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#1e293b] px-2 text-slate-500">
                Secure Authentication
              </span>
            </div>
          </div>

          <p className="text-center text-xs text-slate-500 leading-relaxed">
            By signing in, you agree to our Terms of Service and Privacy Policy.
            We only request access to your basic profile information.
          </p>
        </div>
      </div>
    </div>
  );
}
