import { useState, useMemo } from "react";
import { Track, Playlist, useSchedule } from "../../context/ScheduleContext";

const SONG_BANK: (Track & { genre: string })[] = [
  { title: "Blinding Lights",        artist: "The Weeknd",          duration: "3:20", genre: "Pop" },
  { title: "As It Was",              artist: "Harry Styles",        duration: "2:37", genre: "Pop" },
  { title: "Anti-Hero",              artist: "Taylor Swift",        duration: "3:21", genre: "Pop" },
  { title: "Flowers",                artist: "Miley Cyrus",         duration: "3:21", genre: "Pop" },
  { title: "Shake It Off",           artist: "Taylor Swift",        duration: "3:39", genre: "Pop" },
  { title: "Watermelon Sugar",       artist: "Harry Styles",        duration: "2:54", genre: "Pop" },
  { title: "Dynamite",               artist: "BTS",                 duration: "3:19", genre: "Pop" },
  { title: "Levitating",             artist: "Dua Lipa",            duration: "3:23", genre: "Pop" },
  { title: "Good as Hell",           artist: "Lizzo",               duration: "2:38", genre: "Pop" },
  { title: "Uptown Funk",            artist: "Bruno Mars",          duration: "4:30", genre: "Pop" },
  { title: "Happy",                  artist: "Pharrell Williams",   duration: "3:53", genre: "Pop" },
  { title: "Roar",                   artist: "Katy Perry",          duration: "3:43", genre: "Pop" },
  { title: "Unstoppable",            artist: "Sia",                 duration: "3:37", genre: "Pop" },
  { title: "Shape of You",           artist: "Ed Sheeran",          duration: "3:53", genre: "Pop" },
  { title: "Perfect",                artist: "Ed Sheeran",          duration: "4:23", genre: "Pop" },
  { title: "Someone Like You",       artist: "Adele",               duration: "4:45", genre: "Indie" },
  { title: "Banana Pancakes",        artist: "Jack Johnson",        duration: "3:11", genre: "Indie" },
  { title: "Better Together",        artist: "Jack Johnson",        duration: "3:28", genre: "Indie" },
  { title: "The Night We Met",       artist: "Lord Huron",          duration: "3:28", genre: "Indie" },
  { title: "Skinny Love",            artist: "Bon Iver",            duration: "3:58", genre: "Indie" },
  { title: "Holocene",               artist: "Bon Iver",            duration: "5:37", genre: "Indie" },
  { title: "Vienna",                 artist: "Billy Joel",          duration: "3:34", genre: "Indie" },
  { title: "Golden Hour",            artist: "JVKE",                duration: "3:22", genre: "Indie" },
  { title: "Sunflower",              artist: "Post Malone",         duration: "2:38", genre: "Indie" },
  { title: "Walking on Sunshine",    artist: "Katrina & The Waves", duration: "3:58", genre: "Indie" },
  { title: "Take Five",              artist: "Dave Brubeck",        duration: "5:24", genre: "Jazz" },
  { title: "So What",                artist: "Miles Davis",         duration: "9:22", genre: "Jazz" },
  { title: "Autumn Leaves",          artist: "Bill Evans",          duration: "5:36", genre: "Jazz" },
  { title: "Round Midnight",         artist: "Thelonious Monk",     duration: "5:41", genre: "Jazz" },
  { title: "Blue in Green",          artist: "Miles Davis",         duration: "5:37", genre: "Jazz" },
  { title: "Summertime",             artist: "John Coltrane",       duration: "11:34", genre: "Jazz" },
  { title: "My Favorite Things",     artist: "John Coltrane",       duration: "13:41", genre: "Jazz" },
  { title: "Nardis",                 artist: "Bill Evans",          duration: "7:19", genre: "Jazz" },
  { title: "Misty",                  artist: "Erroll Garner",       duration: "3:26", genre: "Jazz" },
  { title: "Moon River",             artist: "Audrey Hepburn",      duration: "2:44", genre: "Jazz" },
  { title: "La Vie en Rose",         artist: "Louis Armstrong",     duration: "3:43", genre: "Clásico" },
  { title: "Fly Me to the Moon",     artist: "Frank Sinatra",       duration: "2:27", genre: "Clásico" },
  { title: "The Girl from Ipanema",  artist: "Stan Getz",           duration: "5:21", genre: "Clásico" },
  { title: "Cheek to Cheek",         artist: "Tony Bennett",        duration: "4:02", genre: "Clásico" },
  { title: "What a Wonderful World", artist: "Louis Armstrong",     duration: "2:19", genre: "Clásico" },
  { title: "Lose Yourself",          artist: "Eminem",              duration: "5:26", genre: "Hip-Hop" },
  { title: "Thunder",                artist: "Imagine Dragons",     duration: "3:07", genre: "Hip-Hop" },
  { title: "Can't Hold Us",          artist: "Macklemore",          duration: "4:18", genre: "Hip-Hop" },
  { title: "Stronger",               artist: "Kanye West",          duration: "5:11", genre: "Hip-Hop" },
  { title: "Till I Collapse",        artist: "Eminem",              duration: "4:57", genre: "Hip-Hop" },
  { title: "Eye of the Tiger",       artist: "Survivor",            duration: "4:05", genre: "Hip-Hop" },
];

interface Props {
  playlist: Playlist;
  onClose: () => void;
}

function SearchSongModal({ playlist, onClose }: Props) {
  const { addTrackToPlaylist } = useSchedule();
  const [query, setQuery] = useState("");
  const [added, setAdded] = useState<Set<string>>(new Set());

  const existingTitles = new Set(playlist.tracks.map((t) => t.title.toLowerCase()));

  const results = useMemo(() => {
    if (!query.trim()) return SONG_BANK.slice(0, 12);
    const q = query.toLowerCase();
    return SONG_BANK.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q) ||
        s.genre.toLowerCase().includes(q)
    ).slice(0, 20);
  }, [query]);

  const handleAdd = (song: Track) => {
    addTrackToPlaylist(playlist.id, song);
    setAdded((prev) => new Set(prev).add(song.title));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>

        <div className="modal-header">
          <h2>Agregar canción</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <p className="modal-subtitle">Playlist: {playlist.emoji} {playlist.name}</p>

        <input
          className="modal-input"
          placeholder="Buscar por título, artista o género..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />

        <div className="search-results">
          {results.length === 0 && (
            <p className="search-empty">No se encontraron canciones.</p>
          )}
          {results.map((song) => {
            const alreadyIn = existingTitles.has(song.title.toLowerCase());
            const justAdded = added.has(song.title);
            const disabled  = alreadyIn || justAdded;
            return (
              <div key={song.title + song.artist} className="search-result-item">
                <div className="track-info">
                  <span className="track-title">{song.title}</span>
                  <span className="track-artist">
                    {song.artist} · <span className="genre-tag">{song.genre}</span>
                  </span>
                </div>
                <span className="track-duration">{song.duration}</span>
                <button
                  className={`add-track-btn ${disabled ? "add-track-btn--done" : ""}`}
                  onClick={() => !disabled && handleAdd(song)}
                  disabled={disabled}
                >
                  {disabled ? "✓" : "+"}
                </button>
              </div>
            );
          })}
        </div>

        <button className="modal-save-btn" onClick={onClose}>Listo</button>

      </div>
    </div>
  );
}

export default SearchSongModal;