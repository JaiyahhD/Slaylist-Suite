/* =========================================================
   THE SLAYLIST SUITE
   Bookwave Playlist Types
   ========================================================= */

export type MusicPlatform =
  | "spotify"
  | "apple-music"
  | "youtube"
  | "other";

export interface BookPlaylist {
  id: string;

  title: string;

  description?: string;

  coverUrl?: string;

  platform: MusicPlatform;

  playlistUrl: string;

  bookIds: string[];

  featured: boolean;

  createdAt: string;

  updatedAt: string;
}