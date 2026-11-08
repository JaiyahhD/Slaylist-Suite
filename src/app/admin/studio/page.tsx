
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminStudio() {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let active = true;

    async function verifyOwner() {
      const { data: auth, error: authError } =
        await supabase.auth.getUser();

      if (!active) return;

      if (authError || !auth.user) {
        router.replace("/admin");
        return;
      }

      const { data: books, error } = await supabase
        .from("slaybase_books")
        .select("id")
        .eq("owner_id", auth.user.id)
        .limit(1);

      if (!active) return;

      setAuthorized(!error && !!books?.length);
      setChecking(false);
    }

    void verifyOwner();

    return () => {
      active = false;
    };
  }, [router]);

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/");
  }

  if (checking) {
    return (
      <p className="muted">
        Verifying backstage access…
      </p>
    );
  }

  if (!authorized) {
    return (
      <section>
        <h1 className="page-title">
          Access Restricted ♡
        </h1>

        <p className="muted">
          This area is reserved for the Slaylist Suite owner.
        </p>

        <button type="button" onClick={signOut}>
          Sign Out
        </button>
      </section>
    );
  }

  return (
    <section className="admin-studio">
      <p className="eyebrow">
        OWNER ACCESS · THE CONTROL ROOM
      </p>

      <h1 className="page-title">
        ♡ Admin Studio
      </h1>

      <p className="muted">
        Welcome backstage. Your Slaylist Suite, your rules.
      </p>

      <div className="admin-studio-grid">

        {/* MANAGE SLAYBASE */}
        <Link href="/slaybase" className="book-card">
          <h2>💿 Manage Slaybase</h2>
          <p className="muted">
            Browse your entire book collection and
            open individual Backstage Passes.
          </p>
        </Link>

        {/* ADD NEW BOOK */}
        <Link href="/admin/books/new" className="book-card">
          <h2>💗 Add New Book</h2>
          <p className="muted">
            Add a new book directly to The Slaybase,
            upload its cover, and organize its details.
          </p>
        </Link>

        {/* EDIT BOOKS */}
        <Link href="/slaybase" className="book-card">
          <h2>♡ Edit Books</h2>
          <p className="muted">
            Choose a book to update its cover,
            description, rating, reading status,
            genres, tropes, and custom tags.
          </p>
        </Link>

        {/* THE TAG VAULT */}
        <Link href="/admin/tags" className="book-card">
          <h2>✦ The Tag Vault</h2>
          <p className="muted">
            Create, rename, and organize your
            genres, tropes, and custom tags
            in one dedicated space.
          </p>
        </Link>

        {/* BOOKWAVES MANAGEMENT */}
        <Link href="/bookwave" className="book-card">
          <h2>🎧 Manage Bookwaves</h2>
          <p className="muted">
            Head to your soundtrack station to create,
            edit, and manage your book-inspired
            Spotify playlists and artwork.
          </p>
          <span className="admin-card-action">
            Open Soundtrack Station ♫
          </span>
        </Link>

      </div>

      <button
        type="button"
        onClick={signOut}
        style={{
          marginTop: 30,
          padding: "12px 22px",
          background: "#211820",
          color: "#ffd6e9",
          border: "1px solid #ff4fa366",
          borderRadius: 12,
          cursor: "pointer",
        }}
      >
        Sign Out ♡
      </button>
    </section>
  );
}
