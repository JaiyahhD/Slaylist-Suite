
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Category = "genres" | "tropes" | "tags";

type TagItem = {
  category: Category;
  name: string;
  book_count: number;
};

const CATEGORIES: { key: Category; label: string }[] = [
  { key: "genres", label: "♡ Genres" },
  { key: "tropes", label: "★ Tropes" },
  { key: "tags", label: "✦ Custom Tags" }
];

export default function TagVaultPage() {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [category, setCategory] = useState<Category>("genres");
  const [items, setItems] = useState<TagItem[]>([]);
  const [search, setSearch] = useState("");
  const [newName, setNewName] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [replacement, setReplacement] = useState("");
  const [message, setMessage] = useState("");

  const loadInventory = useCallback(async () => {
    const { data, error } = await supabase.rpc(
      "slaybase_tag_inventory"
    );

    if (error) throw error;

    setItems((data || []) as TagItem[]);
  }, []);

  useEffect(() => {
    let active = true;

    async function initialize() {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (!active) return;

        if (error || !data.user) {
          router.replace("/admin");
          return;
        }

        const { data: ownerBooks, error: ownerError } =
          await supabase
            .from("slaybase_books")
            .select("id")
            .eq("owner_id", data.user.id)
            .limit(1);

        if (ownerError || !ownerBooks?.length) {
          throw new Error("Owner access required.");
        }

        const { data: inventory, error: inventoryError } =
          await supabase.rpc("slaybase_tag_inventory");

        if (inventoryError) throw inventoryError;

        if (!active) return;

        setItems((inventory || []) as TagItem[]);
        setAuthorized(true);
      } catch (error) {
        if (active) {
          setMessage(
            error instanceof Error
              ? error.message
              : "Could not load the Tag Vault."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    initialize();

    return () => {
      active = false;
    };
  }, [router]);

  const visible = useMemo(() => {
    return items.filter(
      item =>
        item.category === category &&
        item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, category, search]);

  async function runAction(
    action: "add" | "rename" | "delete",
    name: string,
    newValue?: string
  ) {
    const oldName = name.trim();
    const nextName = newValue?.trim() || "";

    if (!oldName) {
      setMessage("Enter a name first.");
      return;
    }

    if (action === "rename" && !nextName) {
      setMessage("Enter the new name.");
      return;
    }

    if (action === "rename" &&
        oldName.toLowerCase() === nextName.toLowerCase()) {
      setMessage("Choose a different name.");
      return;
    }

    if (action === "delete") {
      const confirmed = window.confirm(
        `Delete "${oldName}" from every book that uses it? ` +
        "This will not delete any books."
      );
      if (!confirmed) return;
    }

    if (action === "rename") {
      const confirmed = window.confirm(
        `Rename "${oldName}" to "${nextName}" ` +
        "across all matching books?"
      );
      if (!confirmed) return;
    }

    setBusy(true);
    setMessage("");

    try {
      const { data: affected, error } = await supabase.rpc(
        "slaybase_manage_tag",
        {
          p_action: action,
          p_category: category,
          p_name: oldName,
          p_new_name: action === "rename" ? nextName : null
        }
      );

      if (error) throw error;

      await loadInventory();

      setEditing(null);
      setReplacement("");
      setNewName("");

      if (action === "add") {
        setMessage(`♡ "${oldName}" added to your Tag Vault.`);
      } else {
        setMessage(
          `♡ Done! ${affected ?? 0} book(s) updated.`
        );
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <p className="muted">Unlocking The Tag Vault…</p>;
  }

  if (!authorized) {
    return (
      <section>
        <h1 className="page-title">Backstage Access Only ♡</h1>
        <p role="alert">{message || "Owner access required."}</p>
        <Link href="/admin">Return to Admin Sign In</Link>
      </section>
    );
  }

  return (
    <section className="tag-vault">
      <Link href="/admin/studio" className="muted">
        ← Back to Admin Studio
      </Link>

      <p className="eyebrow" style={{ marginTop: 28 }}>
        SLAYLIST FM · OWNER CONTROL ROOM
      </p>

      <h1 className="page-title">♡ The Tag Vault</h1>

      <p className="muted">
        Your genres, tropes, and custom tags — all in one place.
        Rename once, update every matching book.
      </p>

      <div className="tag-vault-tabs">
        {CATEGORIES.map(item => (
          <button
            type="button"
            key={item.key}
            className={category === item.key ? "active" : ""}
            onClick={() => {
              setCategory(item.key);
              setEditing(null);
              setSearch("");
              setMessage("");
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="tag-vault-panel">
        <h2>Add a New {category === "tags" ? "Tag" :
          category === "genres" ? "Genre" : "Trope"}</h2>

        <form
          className="tag-vault-form"
          onSubmit={event => {
            event.preventDefault();
            runAction("add", newName);
          }}
        >
          <input
            value={newName}
            onChange={event => setNewName(event.target.value)}
            placeholder={`New ${category.slice(0, -1)} name...`}
            maxLength={100}
            required
          />
          <button disabled={busy} type="submit">
            + Add
          </button>
        </form>
      </div>

      <div className="tag-vault-panel">
        <div className="tag-vault-heading">
          <h2>Saved {category}</h2>
          <span>{visible.length} shown</span>
        </div>

        <input
          className="tag-vault-search"
          type="search"
          placeholder="Search your Tag Vault..."
          value={search}
          onChange={event => setSearch(event.target.value)}
        />

        {visible.length === 0 ? (
          <p className="muted">
            No matching tags yet. Add your first one above!
          </p>
        ) : (
          <div className="tag-vault-list">
            {visible.map(item => (
              <div
                className="tag-vault-item"
                key={`${item.category}:${item.name}`}
              >
                {editing === item.name ? (
                  <>
                    <input
                      value={replacement}
                      onChange={event =>
                        setReplacement(event.target.value)
                      }
                      maxLength={100}
                      aria-label={`Rename ${item.name}`}
                    />

                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        runAction(
                          "rename",
                          item.name,
                          replacement
                        )
                      }
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditing(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <div className="tag-vault-item-name">
                      <strong>{item.name}</strong>
                      <small>
                        {item.book_count}{" "}
                        {item.book_count === 1 ? "book" : "books"}
                      </small>
                    </div>

                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => {
                        setEditing(item.name);
                        setReplacement(item.name);
                      }}
                    >
                      Rename
                    </button>

                    <button
                      type="button"
                      className="tag-vault-delete"
                      disabled={busy}
                      onClick={() =>
                        runAction("delete", item.name)
                      }
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {message && (
        <p role="status" className="tag-vault-message">
          {message}
        </p>
      )}
    </section>
  );
}
