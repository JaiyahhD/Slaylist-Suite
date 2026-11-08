
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { createClient } from "@supabase/supabase-js";

const envPath = path.resolve(".env.local");

if (!fs.existsSync(envPath)) {
  throw new Error("Missing .env.local file.");
}

const env = Object.fromEntries(
  fs.readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .filter(line => line.trim() && !line.trim().startsWith("#"))
    .map(line => {
      const index = line.indexOf("=");
      if (index < 0) return [];
      return [
        line.slice(0, index).trim(),
        line.slice(index + 1).trim().replace(/^["']|["']$/g, "")
      ];
    })
    .filter(pair => pair.length === 2)
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  throw new Error("Missing Supabase connection settings.");
}

const filePath = path.resolve("src/data/goodreads-library.json");

if (!fs.existsSync(filePath)) {
  throw new Error("Goodreads library JSON was not found.");
}

const entries = JSON.parse(fs.readFileSync(filePath, "utf8"));

if (!Array.isArray(entries)) {
  throw new Error("Expected an array of Goodreads entries.");
}

const ids = entries.map(entry => entry.book?.id);

if (ids.some(id => !id) || new Set(ids).size !== ids.length) {
  throw new Error("Missing or duplicate Goodreads book IDs.");
}

console.log(`Found ${entries.length} Goodreads books.`);

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const rl = readline.createInterface({ input: stdin, output: stdout });

try {
  console.log("\nSign in using your existing Slaylist Supabase account.");
  const email = await rl.question("Email: ");
  const password = await rl.question("Password (visible in terminal): ");

  const { data: auth, error: authError } =
    await supabase.auth.signInWithPassword({ email, password });

  if (authError || !auth.user) {
    throw new Error(authError?.message || "Sign-in failed.");
  }

  const ownerId = auth.user.id;

  const { data: records, error: recordsError } =
    await supabase
      .from("reading_records")
      .select("book_id,status,finished_at,owner_id")
      .eq("owner_id", ownerId);

  if (recordsError) throw recordsError;

  if (!records?.length) {
    throw new Error(
      "No existing reading records visible for this account. Import stopped."
    );
  }

  const completed = new Set(
    records
      .filter(record =>
        record.status === "completed" && record.finished_at
      )
      .map(record => record.book_id)
  );

  const rows = entries.map(entry => {
    const book = { ...entry.book };

    if (completed.has(book.id)) {
      book.status = "read";
    }

    return {
      id: book.id,
      owner_id: ownerId,
      book_data: book
    };
  });

  console.log(`\nSigned in successfully.`);
  console.log(`${completed.size} completed book IDs found in Supabase.`);
  console.log(`${rows.length} books prepared for import.`);
  console.log("Existing books will not be overwritten.");
  console.log("Reading records and progress will not be modified.");

  const answer = await rl.question(
    "\nType IMPORT to begin, or press Enter to cancel: "
  );

  if (answer !== "IMPORT") {
    console.log("Cancelled. No changes made.");
    process.exit(0);
  }

  const batchSize = 50;
  let processed = 0;

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);

    const { error } = await supabase
      .from("slaybase_books")
      .upsert(batch, {
        onConflict: "id",
        ignoreDuplicates: true
      });

    if (error) {
      throw new Error(
        `Batch ${Math.floor(i / batchSize) + 1} failed: ${error.message}`
      );
    }

    processed += batch.length;
    console.log(`Processed ${processed}/${rows.length}`);
  }

  const { count, error: countError } = await supabase
    .from("slaybase_books")
    .select("id", { count: "exact", head: true })
    .eq("owner_id", ownerId);

  if (countError) throw countError;

  console.log("\nIMPORT REQUESTS COMPLETED!");
  console.log(`Books visible to your account: ${count}`);
  console.log("Check Supabase to confirm the imported rows.");

} catch (error) {
  console.error("\nImport stopped:", error.message);
  process.exitCode = 1;
} finally {
  await supabase.auth.signOut().catch(() => {});
  rl.close();
}
