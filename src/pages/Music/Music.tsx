import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSchedule, Playlist } from "../../context/ScheduleContext";
import SearchSongModal from "../../components/SearchSongModal/SearchSongModal";
import BottomNav from "../../components/BottomNav/BottomNav";

function Music() {
  const { playlists, currentMatch } = useSchedule();
  const navigate = useNavigate();
  const [openPlaylist,   setOpenPlaylist]   = useState<string | null>(null);
  const [playingTrack,   setPlayingTrack]   = useState<string | null>(null);
  const [searchPlaylist, setSearchPlaylist] = useState<Playlist | null>(null);

  const handlePlaylistClick = (id: string) => {
    setOpenPlaylist(openPlaylist === id ? null : id);
    setPlayingTrack(null);
  };

  return (
    <div className="dashboard-page">

      <div className="dashboard-header">
        <div>
          <h1>Music</h1>
          <p className="business-name">Browse Vibes</p>
        </div>
      </div>

      {currentMatch && (
        <div className="now-playing-banner" style={{ marginBottom: 16 }}>
          <span className="now-dot" />
          <span className="now-label">Sonando ahora</span>
          <span className="now-vibe">{currentMatch.playlist.emoji} {currentMatch.playlist.name}</span>
        </div>
      )}

      <div className="vibes-grid">
        {playlists.map((playlist) => {
          const isOpen    = openPlaylist === playlist.id;
          const isCurrent = currentMatch?.playlist.id === playlist.id;

          return (
            <div
              key={playlist.id}
              className={`vibe-card ${isOpen ? "vibe-card--open" : ""} ${isCurrent ? "vibe-card--current" : ""}`}
              onClick={() => handlePlaylistClick(playlist.id)}
            >
              <div className="vibe-emoji">{playlist.emoji}</div>
              <h3>{playlist.name}</h3>
              <p>{playlist.mood}</p>
              <span>{playlist.tracks.length} tracks</span>

              {isOpen && (
                <div className="track-list" onClick={(e) => e.stopPropagation()}>
                  {playlist.tracks.map((track, i) => {
                    const key     = `${playlist.id}-${i}`;
                    const playing = playingTrack === key;
                    return (
                      <div
                        key={key}
                        className={`track-item ${playing ? "track-item--playing" : ""}`}
                        onClick={() => setPlayingTrack(playing ? null : key)}
                      >
                        <div className="track-play-icon">{playing ? "⏸" : "▶"}</div>
                        <div className="track-info">
                          <span className="track-title">{track.title}</span>
                          <span className="track-artist">{track.artist}</span>
                        </div>
                        <span className="track-duration">{track.duration}</span>
                      </div>
                    );
                  })}

                  <button
                    className="add-track-to-playlist-btn"
                    onClick={(e) => { e.stopPropagation(); setSearchPlaylist(playlist); }}
                  >
                    + Agregar canción
                  </button>
                </div>
              )}
            </div>
          );
        })}

        <div className="vibe-card vibe-card--locked" onClick={() => navigate("/plans")}>
          <div className="vibe-emoji">🔒</div>
          <h3>Crear playlist</h3>
          <p>Disponible en Plus</p>
          <span className="locked-cta">Upgrade →</span>
        </div>
      </div>

      {searchPlaylist && (
        <SearchSongModal playlist={searchPlaylist} onClose={() => setSearchPlaylist(null)} />
      )}

      <div style={{ height: "100px" }} />
      <BottomNav />
    </div>
  );
}

export default Music;