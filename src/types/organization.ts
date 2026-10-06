/* =========================================================
   THE SLAYLIST SUITE
   Organization Types

   These types power the organizational layer of Slaybase:
   genres, tropes, tags, shelves, and collections.

   Books reference these items by ID instead of storing
   duplicated organization data directly.
   ========================================================= */

export type OrganizationType =
  | "genre"
  | "trope"
  | "tag"
  | "shelf"
  | "collection";

export type AccentColor =
  | "pink"
  | "violet"
  | "ice"
  | "mixed"
  | "chrome";


/* =========================================================
   GENRES
   ========================================================= */

export interface Genre {
  id: string;

  name: string;

  slug: string;

  description?: string;

  parentGenreId?: string;

  accent?: AccentColor;

  createdAt: string;

  updatedAt: string;
}


/* =========================================================
   TROPES
   ========================================================= */

export interface Trope {
  id: string;

  name: string;

  slug: string;

  description?: string;

  accent?: AccentColor;

  createdAt: string;

  updatedAt: string;
}


/* =========================================================
   TAGS
   ========================================================= */

export interface Tag {
  id: string;

  name: string;

  slug: string;

  description?: string;

  accent?: AccentColor;

  createdAt: string;

  updatedAt: string;
}


/* =========================================================
   SHELVES
   ========================================================= */

export interface Shelf {
  id: string;

  name: string;

  slug: string;

  description?: string;

  source:
    | "slaylist"
    | "goodreads"
    | "system";

  isPrivate: boolean;

  accent?: AccentColor;

  createdAt: string;

  updatedAt: string;
}


/* =========================================================
   COLLECTIONS
   ========================================================= */

export interface Collection {
  id: string;

  name: string;

  slug: string;

  description?: string;

  coverImageUrl?: string;

  accent?: AccentColor;

  isPrivate: boolean;

  bookIds: string[];

  createdAt: string;

  updatedAt: string;
}


/* =========================================================
   GENERAL ORGANIZATION ITEM
   ========================================================= */

export interface OrganizationItem {
  id: string;

  type: OrganizationType;

  name: string;

  slug: string;

  description?: string;

  accent?: AccentColor;
}