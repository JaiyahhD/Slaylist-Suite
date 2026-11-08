
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function checkSession() {
      const { data } = await supabase.auth.getUser();

      if (active) {
        setChecking(false);

        if (data.user) {
          router.replace("/admin/studio");
        }
      }
    }

    checkSession();

    return () => {
      active = false;
    };
  }, [router]);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) throw loginError;

      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        throw new Error("Could not verify your account.");
      }

      const { data: ownerBook, error: ownerError } =
        await supabase
          .from("slaybase_books")
          .select("id")
          .eq("owner_id", userData.user.id)
          .limit(1);

      if (ownerError || !ownerBook?.length) {
        await supabase.auth.signOut();
        throw new Error("This account is not authorized as the Suite owner.");
      }

      router.replace("/admin/studio");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Sign-in failed."
      );
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return <p className="muted">Checking your Suite access…</p>;
  }

  return (
    <section style={{ maxWidth: 480, margin: "50px auto" }}>
      <p className="eyebrow">THE SLAYLIST SUITE · PRIVATE ACCESS</p>

      <h1 className="page-title">♡ Admin Sign In</h1>

      <p className="muted">
        The backstage entrance is reserved for the Suite owner.
      </p>

      <form
        onSubmit={handleLogin}
        style={{
          display: "grid",
          gap: 16,
          marginTop: 28,
          padding: 28,
          background: "#161016",
          border: "1px solid #ff4fa355",
          borderRadius: 18,
        }}
      >
        <label>
          Email
          <input
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", marginTop: 8 }}
          />
        </label>

        <label>
          Password
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", marginTop: 8 }}
          />
        </label>

        {error && (
          <p role="alert" style={{ color: "#ff92bb" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "14px 20px",
            borderRadius: 12,
            border: 0,
            background: "#ff4fa3",
            color: "#170710",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          {loading ? "Unlocking…" : "Unlock My Suite ♡"}
        </button>
      </form>

      <p style={{ marginTop: 20 }}>
        <Link href="/" className="muted">
          ← Back to The Suite
        </Link>
      </p>
    </section>
  );
}
