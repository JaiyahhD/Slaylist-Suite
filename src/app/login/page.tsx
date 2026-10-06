"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const { error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }

    router.push("/current-rotation");
    router.refresh();
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-eyebrow">
          THE SLAYLIST SUITE // PRIVATE ACCESS
        </div>

        <h1>Welcome Back, Baddie.</h1>

        <p className="login-subtitle">
          Books. Brains. Bad Decisions. On Repeat.
        </p>

        <form onSubmit={handleLogin} className="login-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "ACCESSING SUITE..." : "ENTER THE SUITE ✦"}
          </button>
        </form>

        <p className="login-security">
          🔐 OWNER ACCESS ONLY
        </p>
      </section>
    </main>
  );
}