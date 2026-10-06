/* =========================================================
   THE SLAYLIST SUITE
   Organization Types

   Defines how books are categorized, tagged, shelved,
   filtered, and discovered throughout Slaybase.
   ========================================================= */

export type ShelfType =
  | "system"
  | "custom";

export interface Shelf {
  id: string;

  name: string;

  slug: string;

  description?: string;

  type: ShelfType;

  icon?: string;

  bookIds: string[];

  createdAt: string;

  updatedAt: string;
}


/* =========================================================
   TAGS

   Flexible labels I can attach to basically anything.
   Examples:
   - Black author
   - Kindle owned
   - BookTok made me do it
   - need to read ASAP
   - emotionally dangerous
   ========================================================= */

export interface Tag {
  id: string;

  name: string;

  slug: string;

  description?: string;

  color?: string;
}


/* =========================================================
   GENRES

   Formal book classifications.
   ========================================================= */

export interface Genre {
  id: string;

  name: string;

  slug: string;

  parentGenre?: string;
}


/* =========================================================
   TROPES

   Story elements rather than formal genres.
   ========================================================= */

export interface Trope {
  id: string;

  name: string;

  slug: string;

  description?: string;
}