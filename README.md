# Slaylist FM — clean rebuild starter (Phase A)

This is a **separate development project**, not a drop-in replacement for your live site. It includes the six-destination navigation, Spotify-inspired shell, Slaybase with Current Rotation at the top, Certified Slays filter, About Me, and Goodreads-based monthly/annual/all-time reporting. The original Goodreads JSON is preserved.

## Start on Windows (VS Code PowerShell)
1. Extract into a **new** folder, e.g. `Slaylist-FM-Rebuild`. Do not overwrite `Slaylist-Suite`.
2. Copy your own `.env.local` privately from the original project into this folder. Never upload it.
3. `npm.cmd install`
4. `npm.cmd run dev`
5. Open the localhost URL printed by Next.js.

## Important current limitations
- **Slaybase is read-only in this starter.** Existing Goodreads history powers the pages; Supabase editing is the next milestone, after confirming the actual database schema and authorization rules. Never expose a service-role key in the browser.
- **ReadSync form and API** are preserved from the supplied Phase 2 source; the user's later GitHub ReadSync fixes may be newer. Before using it in production, merge the latest `src/app/api/readsync/route.ts` from the current working project.
- **Bookwave** is a placeholder; original components and legacy page code are included for safe migration.
- **Reports** use the Goodreads JSON snapshot, not a live CSV uploader or merged Supabase records. Date-less records are excluded from month/year views. Counts may differ from your final reconciled reports.
- Certified Slay tagging/editing and admin auth are **not implemented yet**; do not deploy publicly as a replacement.
- The previous pages are retained as text reference under `src/app/legacy-reference/` to avoid accidental data/function loss.

## Next build milestones
1. Verify Supabase tables and existing auth; create a secure editable library layer and certified-slay toggle.
2. Deduplicate Supabase/Goodreads by ISBN, normalized title+author, and reading instance; validate totals.
3. Migrate latest ReadSync route and Bookwave playlist/player integrations.
4. Test full build, accessibility, and Netlify preview before production deployment.

Never run SQL drops or replace your live project as part of this starter.
