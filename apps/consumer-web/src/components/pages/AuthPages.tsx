'use client'

import { useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { Loader2 } from "lucide-react";

export function LoginPage({ navigate }: { navigate: (path: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Sign in failed");
        return;
      }
      navigate("/");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!supabaseUrl) {
        setError("Supabase is not configured");
        return;
      }
      // Redirect to Supabase Google OAuth
      const redirectUrl = `${window.location.origin}/auth/callback`;
      window.location.href = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectUrl)}`;
    } catch {
      setError("Google sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteShell showAboveFooterVideo={false} showGlobalFooter={false} navigate={navigate}>
      <section className="bg-cream min-h-[80vh] flex items-center">
        <div className="mx-auto max-w-md w-full px-6 py-20">
          <p className="font-utility text-[11px] text-ember">Account</p>
          <h1 className="mt-4 font-display text-5xl font-bold">Sign in.</h1>

          {error && (
            <p className="mt-4 text-sm text-ember">{error}</p>
          )}

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="mt-8 w-full flex items-center justify-center gap-3 border border-border bg-background px-4 py-3 font-utility text-xs tracking-wider transition-all hover:bg-foreground/5 disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mt-6">
            <div className="h-[1px] flex-1 bg-border" />
            <span className="text-[10px] text-muted-foreground">OR</span>
            <div className="h-[1px] flex-1 bg-border" />
          </div>

          <form className="mt-6 grid gap-4" onSubmit={handleSignIn}>
            <input
              className="border border-border bg-background px-4 py-3"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <input
              className="border border-border bg-background px-4 py-3"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="font-utility bg-ember text-ember-foreground py-3 text-[11px] hover:bg-ink hover:text-background transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 size={14} className="animate-spin" /> Signing in...</> : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground">
            New here? <button onClick={() => navigate("/register")} className="text-ember hover:underline">Create an account</button>
          </p>
        </div>
      </section>
    </SiteShell>
  );
}

export function RegisterPage({ navigate }: { navigate: (path: string) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Sign up failed");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError(null);
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!supabaseUrl) {
        setError("Supabase is not configured");
        return;
      }
      const redirectUrl = `${window.location.origin}/auth/callback`;
      window.location.href = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectUrl)}`;
    } catch {
      setError("Google sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteShell showAboveFooterVideo={false} showGlobalFooter={false} navigate={navigate}>
      <section className="bg-cream min-h-[80vh] flex items-center">
        <div className="mx-auto max-w-md w-full px-6 py-20">
          {success ? (
            <div className="text-center">
              <div className="h-12 w-12 rounded-full border-2 border-teal flex items-center justify-center mx-auto mb-4">
                <span className="text-teal text-xl">&#10003;</span>
              </div>
              <h1 className="font-display text-4xl font-bold">Check your email.</h1>
              <p className="mt-4 text-sm text-muted-foreground">
                We sent you a confirmation link. Click it to verify your account, then sign in.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="mt-6 font-utility bg-ember text-ember-foreground px-6 py-3 text-[11px] hover:bg-ink hover:text-background transition-colors"
              >
                Go to Sign In
              </button>
            </div>
          ) : (
            <>
              <p className="font-utility text-[11px] text-ember">Account</p>
              <h1 className="mt-4 font-display text-5xl font-bold">Create your account.</h1>

              {error && (
                <p className="mt-4 text-sm text-ember">{error}</p>
              )}

              {/* Google Sign Up */}
              <button
                onClick={handleGoogleSignUp}
                disabled={loading}
                className="mt-8 w-full flex items-center justify-center gap-3 border border-border bg-background px-4 py-3 font-utility text-xs tracking-wider transition-all hover:bg-foreground/5 disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              <div className="flex items-center gap-3 mt-6">
                <div className="h-[1px] flex-1 bg-border" />
                <span className="text-[10px] text-muted-foreground">OR</span>
                <div className="h-[1px] flex-1 bg-border" />
              </div>

              <form className="mt-6 grid gap-4" onSubmit={handleSignUp}>
                <input
                  className="border border-border bg-background px-4 py-3"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
                <input
                  className="border border-border bg-background px-4 py-3"
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
                <input
                  className="border border-border bg-background px-4 py-3"
                  placeholder="Password (8+ characters)"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="font-utility bg-ember text-ember-foreground py-3 text-[11px] hover:bg-ink hover:text-background transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <><Loader2 size={14} className="animate-spin" /> Creating account...</> : "Create Account"}
                </button>
              </form>

              <p className="mt-6 text-sm text-muted-foreground">
                Already a member? <button onClick={() => navigate("/login")} className="text-ember hover:underline">Sign in</button>
              </p>
            </>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
