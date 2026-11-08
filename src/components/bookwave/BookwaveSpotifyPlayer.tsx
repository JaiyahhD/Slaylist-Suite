
type BookwaveSpotifyPlayerProps = {
  spotifyUrl: string;
  playlistName: string;
};

function getSpotifyPlaylistId(value: string) {
  try {
    const url = new URL(value);

    if (
      url.hostname !== "open.spotify.com" &&
      url.hostname !== "www.open.spotify.com"
    ) {
      return null;
    }

    const segments = url.pathname
      .split("/")
      .filter(Boolean);

    const playlistIndex = segments.indexOf("playlist");
    const playlistId = segments[playlistIndex + 1];

    if (
      playlistIndex === -1 ||
      !playlistId ||
      !/^[a-zA-Z0-9]+$/.test(playlistId)
    ) {
      return null;
    }

    return playlistId;
  } catch {
    return null;
  }
}

export default function BookwaveSpotifyPlayer({
  spotifyUrl,
  playlistName,
}: BookwaveSpotifyPlayerProps) {
  const playlistId = getSpotifyPlaylistId(spotifyUrl);

  if (!playlistId) {
    return (
      <p className="bookwave-player-error">
        This playlist cannot be embedded right now.
      </p>
    );
  }

  return (
    <div className="bookwave-player-shell">
      <div className="bookwave-player-heading">
        <span className="bookwave-mini-label">
          SPOTIFY // LIVE FREQUENCY
        </span>
        <span className="bookwave-player-indicator">
          ◉ READY TO PLAY
        </span>
      </div>

      <iframe
        title={`Spotify playlist: ${playlistName}`}
        src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`}
        width="100%"
        height="352"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        style={{ border: 0, borderRadius: "16px" }}
      />

      <div className="bookwave-player-footer">
        <span>
          Curated for the story. Powered by Spotify.
        </span>
        <a
          href={spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          OPEN FULL PLAYLIST ↗
        </a>
      </div>
    </div>
  );
}
