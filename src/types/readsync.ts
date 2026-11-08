
/* =========================================================
   THE SLAYLIST SUITE
   ReadSync Types

   Buddy reads, reading partners, and reading history.
   ========================================================= */

export type BuddyReadStatus =
  | "planned"
  | "active"
  | "completed"
  | "cancelled";

export interface ReadingPartner {
  id: string;

  name: string;

  displayName?: string;

  avatarUrl?: string;

  notes?: string;

  createdAt: string;
}

export interface BuddyRead {
  id: string;

  bookId: string;

  partnerIds: string[];

  status: BuddyReadStatus;

  plannedStartDate?: string;

  startedAt?: string;

  finishedAt?: string;

  notes?: string;

  createdAt: string;

  updatedAt: string;
}