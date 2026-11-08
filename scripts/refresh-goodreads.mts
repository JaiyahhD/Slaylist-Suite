
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { createClient } from "@supabase/supabase-js";
import { parseGoodreadsCsv } from "../src/lib/goodreads/parser";
import { mapGoodreadsRow } from "../src/lib/goodreads/mapper";
import type { Book } from "../src/types/book";
import type { ReadingRecord } from "../src/types/reading";

type Entry = {
  book: Book;
  readingRecord: ReadingRecord | null;
};

type DatabaseRow = {
  id: string;
  book_data: Book;
};

const CSV_PATH = path.resolve("goodreads_library_export.csv");
const JSON_PATH = path.resolve("src/data/goodreads-library.json");
const ENV_PATH = path.resolve(".env.local");

function readEnv() {
  if (!fs.existsSync(ENV_PATH)) {
    throw new Error("Missing .env.local");
  }

  return Object.fromEntries(
    fs.readFileSync(ENV_PATH, "utf8")
      .split(/\r?\n/)
      .filter(line => line.trim() && !line.trim().startsWith("#"))
      .map(line => {
        const i = line.indexOf("=");
        return i < 0 ? [] : [
          line.slice(0, i).trim(),
          line.slice(i + 1).trim().replace(/^["']|["']$/g, "")
        ];
      })
      .filter(pair => pair.length === 2)
  );
}

function mergeBook(incoming: Book, existing?: Book): Book {
  if (!existing) return incoming;

  return {
    ...existing,

    // Goodreads information gets refreshed.
    title: incoming.title,
    authors: incoming.authors,
    isbn10: incoming.isbn10 || existing.isbn10,
    isbn13: incoming.isbn13 || existing.isbn13,
    pageCount: incoming.pageCount || existing.pageCount,
    publicationDate:
      incoming.publicationDate || existing.publicationDate,
    publisher: incoming.publisher || existing.publisher,
    status: incoming.status,
    personalRating:
      incoming.personalRating ?? existing.personalRating,
    goodreadsBookId: incoming.goodreadsBookId,
    dateAdded: incoming.dateAdded || existing.dateAdded,

    // Preserve existing Suite-specific information.
    certifiedSlay:
      existing.certifiedSlay || incoming.certifiedSlay,
    brainChemistry: existing.brainChemistry,
    favorite: existing.favorite,
    genreIds: existing.genreIds || [],
    tropeIds: existing.tropeIds || [],
    tagIds: existing.tagIds || [],
    shelfIds: existing.shelfIds || [],
    formats: existing.formats?.length
      ? existing.formats
      : incoming.formats,
    ownership: existing.ownership || [],
    primaryFormat:
      existing.primaryFormat || incoming.primaryFormat,
    coverUrl: existing.coverUrl || incoming.coverUrl,
    privateNotes:
      existing.privateNotes || incoming.privateNotes,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString()
  };
}

function mergeRecord(
  incoming: ReadingRecord | null,
  existing: ReadingRecord | null
): ReadingRecord | null {
  if (!incoming) return existing;
  if (!existing) return incoming;

  return {
    ...existing,
    finishedAt: incoming.finishedAt || existing.finishedAt,
    rating: incoming.rating ?? existing.rating,
    certifiedSlay:
      existing.certifiedSlay || incoming.certifiedSlay,
    isReread: existing.isReread || incoming.isReread,
    updatedAt: new Date().toISOString()
  };
}

async function main() {
  if (!fs.existsSync(CSV_PATH)) {
    throw new Error(
      "Put goodreads_library_export.csv in the project root."
    );
  }

  if (!fs.existsSync(JSON_PATH)) {
    throw new Error("Existing Goodreads JSON not found.");
  }

  const csv = fs.readFileSync(CSV_PATH, "utf8");
  const parsed = parseGoodreadsCsv(csv);

  if (parsed.errors.length) {
    throw new Error(
      `CSV parsing found ${parsed.errors.length} errors. ` +
      "Import cancelled."
    );
  }

  const incoming = parsed.rows.map(mapGoodreadsRow);

  const ids = incoming.map(entry => entry.book.id);

  if (
    ids.some(id => !id || id === "goodreads-undefined") ||
    new Set(ids).size !== ids.length
  ) {
    throw new Error(
      "Missing or duplicate Goodreads IDs. Import cancelled."
    );
  }

  const oldEntries = JSON.parse(
    fs.readFileSync(JSON_PATH, "utf8")
  ) as Entry[];

  if (!Array.isArray(oldEntries)) {
    throw new Error("Existing JSON is not an array.");
  }

  const env = readEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Supabase environment variables missing.");
  }

  const supabase = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  const rl = readline.createInterface({
    input: stdin,
    output: stdout
  });

  try {
    console.log("\nTHE SLAYLIST SUITE — GOODREADS REFRESH");
    console.log(`CSV books: ${incoming.length}`);
    console.log(`Previous JSON books: ${oldEntries.length}`);

    const email = await rl.question("\nSupabase email: ");
    const password = await rl.question(
      "Password (visible in terminal): "
    );

    const { data: auth, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password
      });

    if (authError || !auth.user) {
      throw new Error(authError?.message || "Sign-in failed.");
    }

    const ownerId = auth.user.id;
    const existingDb: DatabaseRow[] = [];
    const pageSize = 500;

    for (let from = 0; ; from += pageSize) {
      const { data, error } = await supabase
        .from("slaybase_books")
        .select("id,book_data")
        .eq("owner_id", ownerId)
        .order("id", { ascending: true })
        .range(from, from + pageSize - 1);

      if (error) throw error;

      const batch = (data || []) as DatabaseRow[];
      existingDb.push(...batch);

      if (batch.length < pageSize) break;
    }

    const dbById = new Map(
      existingDb.map(row => [row.id, row.book_data])
    );

    const oldById = new Map(
      oldEntries.map(entry => [entry.book.id, entry])
    );

    const updatedEntries: Entry[] = incoming.map(mapped => {
      const old = oldById.get(mapped.book.id);
      const dbBook = dbById.get(mapped.book.id);

      return {
        book: mergeBook(
          mapped.book,
          dbBook || old?.book
        ),
        readingRecord: mergeRecord(
          mapped.readingRecord,
          old?.readingRecord || null
        )
      };
    });

    // Keep existing JSON books absent from the CSV,
    // including manually added books.
    const importedIds = new Set(
      updatedEntries.map(entry => entry.book.id)
    );

    for (const old of oldEntries) {
      if (!importedIds.has(old.book.id)) {
        updatedEntries.push(old);
        importedIds.add(old.book.id);
      }
    }

    const newBooks = incoming.filter(
      entry => !dbById.has(entry.book.id)
    ).length;

    const matchingBooks = incoming.length - newBooks;

    console.log("\nPREVIEW");
    console.log(`Existing Supabase books: ${existingDb.length}`);
    console.log(`Matching Goodreads books: ${matchingBooks}`);
    console.log(`New Goodreads books: ${newBooks}`);
    console.log(`Final JSON entries: ${updatedEntries.length}`);
    console.log("No books will be deleted.");
    console.log("No reading_records rows will be changed.");
    console.log("Existing custom Slaybase fields will be preserved.");

    const answer = await rl.question(
      "\nType REFRESH to continue: "
    );

    if (answer !== "REFRESH") {
      console.log("Cancelled. No changes made.");
      return;
    }

    const backup = `${JSON_PATH}.backup-${Date.now()}`;

    fs.copyFileSync(JSON_PATH, backup);
    console.log(`\nJSON backup created: ${backup}`);

    // Preserve database-only manual books in the JSON archive.
    for (const row of existingDb) {
      if (!importedIds.has(row.id)) {
        updatedEntries.push({
          book: row.book_data,
          readingRecord: null
        });
        importedIds.add(row.id);
      }
    }

    const rows = updatedEntries.map(entry => ({
      id: entry.book.id,
      owner_id: ownerId,
      book_data: entry.book
    }));

    // Stable IDs + upsert prevent duplicate primary keys.
    for (let i = 0; i < rows.length; i += 50) {
      const batch = rows.slice(i, i + 50);

      const { error } = await supabase
        .from("slaybase_books")
        .upsert(batch, {
          onConflict: "id",
          ignoreDuplicates: false
        });

      if (error) {
        throw new Error(
          `Supabase batch ${Math.floor(i / 50) + 1}: ` +
          error.message
        );
      }

      console.log(
        `Synced ${Math.min(i + 50, rows.length)}/${rows.length}`
      );
    }

    fs.writeFileSync(
      JSON_PATH,
      JSON.stringify(updatedEntries, null, 2) + "\n",
      "utf8"
    );

    const { count, error: countError } = await supabase
      .from("slaybase_books")
      .select("id", { count: "exact", head: true })
      .eq("owner_id", ownerId);

    if (countError) throw countError;

    console.log("\nGOODREADS REFRESH COMPLETE!");
    console.log(`Supabase books visible: ${count}`);
    console.log(`JSON books: ${updatedEntries.length}`);
    console.log("Reading records were not modified.");
    console.log("Original JSON backup was retained.");

  } finally {
    await supabase.auth.signOut().catch(() => {});
    rl.close();
  }
}

main().catch(error => {
  console.error("\nREFRESH FAILED:", error.message);
  process.exitCode = 1;
});
