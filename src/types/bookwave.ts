export type Bookwave = {
  id: string;
  ownerId: string;

  bookId: string;
  playlistName: string;
  spotifyUrl: string;

  vibe: string | null;
  description: string | null;

  useBookCover: boolean;
  customCoverUrl: string | null;

  createdAt: string;
  updatedAt: string;
};

export type BookwaveRow = {
  id: string;
  owner_id: string;

  book_id: string;
  playlist_name: string;
  spotify_url: string;

  vibe: string | null;
  description: string | null;

  use_book_cover: boolean;
  custom_cover_url: string | null;

  created_at: string;
  updated_at: string;
};

export function mapBookwaveRow(
  row: BookwaveRow
): Bookwave {
  return {
    id: row.id,
    ownerId: row.owner_id,

    bookId: row.book_id,
    playlistName: row.playlist_name,
    spotifyUrl: row.spotify_url,

    vibe: row.vibe,
    description: row.description,

    useBookCover: row.use_book_cover,
    customCoverUrl: row.custom_cover_url,

    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}



