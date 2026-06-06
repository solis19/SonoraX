import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "./AuthContext";

// ─── Tipos ────────────────────────────────────────────────────
export interface Track {
  title: string;
  artist: string;
  duration: string;
}

export interface Playlist {
  id: string;
  name: string;
  emoji: string;
  mood: string;
  tracks: Track[];
  isDefault: boolean;
}

export interface ScheduleSlot {
  id: string;
  label: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  playlistId: string;
  active: boolean;
}

// ─── Playlists predefinidas ────────────────────────────────────
export const DEFAULT_PLAYLISTS: Playlist[] = [
  {
    id: "morning-energy",
    name: "Morning Energy",
    emoji: "🌅",
    mood: "Upbeat & Fresh",
    isDefault: true,
    tracks: [
      { title: "Golden Hour",            artist: "JVKE",               duration: "3:22" },
      { title: "Levitating",             artist: "Dua Lipa",           duration: "3:23" },
      { title: "Can't Stop the Feeling", artist: "Justin Timberlake",  duration: "3:56" },
      { title: "Happy",                  artist: "Pharrell Williams",   duration: "3:53" },
      { title: "Sunflower",              artist: "Post Malone",         duration: "2:38" },
      { title: "Good as Hell",           artist: "Lizzo",              duration: "2:38" },
      { title: "Walking on Sunshine",    artist: "Katrina & The Waves", duration: "3:58" },
      { title: "Uptown Funk",            artist: "Bruno Mars",         duration: "4:30" },
    ],
  },
  {
    id: "cafe-chill",
    name: "Café Chill",
    emoji: "☕",
    mood: "Relaxed & Warm",
    isDefault: true,
    tracks: [
      { title: "Put It All on Me", artist: "Ed Sheeran",  duration: "3:31" },
      { title: "Someone Like You", artist: "Adele",        duration: "4:45" },
      { title: "Banana Pancakes",  artist: "Jack Johnson", duration: "3:11" },
      { title: "Better Together",  artist: "Jack Johnson", duration: "3:28" },
      { title: "The Night We Met", artist: "Lord Huron",   duration: "3:28" },
      { title: "Skinny Love",      artist: "Bon Iver",     duration: "3:58" },
      { title: "Vienna",           artist: "Billy Joel",   duration: "3:34" },
      { title: "Holocene",         artist: "Bon Iver",     duration: "5:37" },
    ],
  },
  {
    id: "dinner-ambiance",
    name: "Dinner Ambiance",
    emoji: "🍽️",
    mood: "Sophisticated",
    isDefault: true,
    tracks: [
      { title: "La Vie en Rose",         artist: "Louis Armstrong", duration: "3:43" },
      { title: "Fly Me to the Moon",     artist: "Frank Sinatra",   duration: "2:27" },
      { title: "The Girl from Ipanema",  artist: "Stan Getz",       duration: "5:21" },
      { title: "Cheek to Cheek",         artist: "Tony Bennett",    duration: "4:02" },
      { title: "Bossa Nova Baby",        artist: "Elvis Presley",   duration: "2:10" },
      { title: "What a Wonderful World", artist: "Louis Armstrong", duration: "2:19" },
      { title: "Misty",                  artist: "Erroll Garner",   duration: "3:26" },
      { title: "Moon River",             artist: "Audrey Hepburn",  duration: "2:44" },
    ],
  },
  {
    id: "retail-flow",
    name: "Retail Flow",
    emoji: "🛍️",
    mood: "Feel-Good Pop",
    isDefault: true,
    tracks: [
      { title: "Blinding Lights",  artist: "The Weeknd",   duration: "3:20" },
      { title: "As It Was",        artist: "Harry Styles", duration: "2:37" },
      { title: "Anti-Hero",        artist: "Taylor Swift", duration: "3:21" },
      { title: "Flowers",          artist: "Miley Cyrus",  duration: "3:21" },
      { title: "Shake It Off",     artist: "Taylor Swift", duration: "3:39" },
      { title: "Watermelon Sugar", artist: "Harry Styles", duration: "2:54" },
      { title: "Dynamite",         artist: "BTS",          duration: "3:19" },
      { title: "Levitating",       artist: "Dua Lipa",     duration: "3:23" },
    ],
  },
  {
    id: "late-night",
    name: "Late Night",
    emoji: "🌙",
    mood: "Smooth Jazz",
    isDefault: true,
    tracks: [
      { title: "Take Five",           artist: "Dave Brubeck",     duration: "5:24" },
      { title: "So What",             artist: "Miles Davis",      duration: "9:22" },
      { title: "Autumn Leaves",       artist: "Bill Evans",       duration: "5:36" },
      { title: "Round Midnight",      artist: "Thelonious Monk",  duration: "5:41" },
      { title: "Blue in Green",       artist: "Miles Davis",      duration: "5:37" },
      { title: "Summertime",          artist: "John Coltrane",    duration: "11:34" },
      { title: "My Favorite Things",  artist: "John Coltrane",    duration: "13:41" },
      { title: "Nardis",              artist: "Bill Evans",       duration: "7:19" },
    ],
  },
  {
    id: "power-hour",
    name: "Power Hour",
    emoji: "⚡",
    mood: "High Energy",
    isDefault: true,
    tracks: [
      { title: "Eye of the Tiger", artist: "Survivor",        duration: "4:05" },
      { title: "Lose Yourself",    artist: "Eminem",          duration: "5:26" },
      { title: "Thunder",          artist: "Imagine Dragons", duration: "3:07" },
      { title: "Can't Hold Us",    artist: "Macklemore",      duration: "4:18" },
      { title: "Roar",             artist: "Katy Perry",      duration: "3:43" },
      { title: "Stronger",         artist: "Kanye West",      duration: "5:11" },
      { title: "Till I Collapse",  artist: "Eminem",          duration: "4:57" },
      { title: "Unstoppable",      artist: "Sia",             duration: "3:37" },
    ],
  },
];

const DEFAULT_SLOTS: Omit<ScheduleSlot, "id">[] = [
  { label: "Morning",    startHour: 7,  startMinute: 0, endHour: 11, endMinute: 0, playlistId: "morning-energy",  active: true  },
  { label: "Lunch",      startHour: 11, startMinute: 0, endHour: 14, endMinute: 0, playlistId: "cafe-chill",      active: true  },
  { label: "Afternoon",  startHour: 14, startMinute: 0, endHour: 19, endMinute: 0, playlistId: "retail-flow",     active: false },
  { label: "Dinner",     startHour: 19, startMinute: 0, endHour: 23, endMinute: 0, playlistId: "dinner-ambiance", active: true  },
  { label: "Late Night", startHour: 23, startMinute: 0, endHour: 7,  endMinute: 0, playlistId: "late-night",      active: false },
];

// ─── Helpers ──────────────────────────────────────────────────
export function getCurrentSlot(
  slots: ScheduleSlot[],
  playlists: Playlist[]
): { slot: ScheduleSlot; playlist: Playlist } | null {
  const now          = new Date();
  const totalMinutes = now.getHours() * 60 + now.getMinutes();

  for (const slot of slots.filter((s) => s.active)) {
    const start = slot.startHour * 60 + slot.startMinute;
    const end   = slot.endHour   * 60 + slot.endMinute;
    const inRange =
      start < end
        ? totalMinutes >= start && totalMinutes < end
        : totalMinutes >= start || totalMinutes < end;

    if (inRange) {
      const playlist = playlists.find((p) => p.id === slot.playlistId);
      if (playlist) return { slot, playlist };
    }
  }
  return null;
}

export function formatTime(h: number, m: number) {
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// ─── Context ──────────────────────────────────────────────────
interface ScheduleContextType {
  slots: ScheduleSlot[];
  playlists: Playlist[];
  loadingSchedule: boolean;
  currentMatch: { slot: ScheduleSlot; playlist: Playlist } | null;
  toggleSlot: (id: string) => Promise<void>;
  addSlot: (slot: Omit<ScheduleSlot, "id">) => Promise<void>;
  removeSlot: (id: string) => Promise<void>;
  addTrackToPlaylist: (playlistId: string, track: Track) => void;
  editSlotFn: (id: string, data: Partial<Omit<ScheduleSlot, "id">>) => Promise<void>;
}

const ScheduleContext = createContext<ScheduleContextType>({
  slots: [],
  playlists: DEFAULT_PLAYLISTS,
  loadingSchedule: true,
  currentMatch: null,
  toggleSlot: async () => {},
  addSlot: async () => {},
  removeSlot: async () => {},
  addTrackToPlaylist: () => {},
  editSlotFn: async () => {},
});

// ─── Provider ─────────────────────────────────────────────────
export function ScheduleProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [slots,    setSlots]    = useState<ScheduleSlot[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>(DEFAULT_PLAYLISTS);
  const [loadingSchedule, setLoadingSchedule] = useState(true);

  useEffect(() => {
    if (!user) { setSlots([]); setLoadingSchedule(false); return; }

    const col = collection(db, "users", user.uid, "schedule");
    const unsub = onSnapshot(col, (snap) => {
      if (snap.empty) {
        const seeded: ScheduleSlot[] = DEFAULT_SLOTS.map((s, i) => ({ ...s, id: `slot-${i}` }));
        seeded.forEach((slot) =>
          setDoc(doc(db, "users", user.uid, "schedule", slot.id), slot)
        );
        setSlots(seeded);
      } else {
        const loaded = snap.docs.map((d) => d.data() as ScheduleSlot);
        loaded.sort((a, b) => a.startHour * 60 + a.startMinute - (b.startHour * 60 + b.startMinute));
        setSlots(loaded);
      }
      setLoadingSchedule(false);
    });

    return () => unsub();
  }, [user]);

  const toggleSlot = async (id: string) => {
    if (!user) return;
    const slot = slots.find((s) => s.id === id);
    if (!slot) return;
    await setDoc(doc(db, "users", user.uid, "schedule", id), { ...slot, active: !slot.active });
  };

  const addSlot = async (slotData: Omit<ScheduleSlot, "id">) => {
    if (!user) return;
    const id = `slot-${Date.now()}`;
    await setDoc(doc(db, "users", user.uid, "schedule", id), { ...slotData, id });
  };

  const removeSlot = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "schedule", id));
  };

  const editSlotFn = async (id: string, data: Partial<Omit<ScheduleSlot, "id">>) => {
  if (!user) return;
  const slot = slots.find((s) => s.id === id);
  if (!slot) return;
  await setDoc(doc(db, "users", user.uid, "schedule", id), { ...slot, ...data });
};

  const addTrackToPlaylist = (playlistId: string, track: Track) => {
    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === playlistId ? { ...p, tracks: [...p.tracks, track] } : p
      )
    );
  };

  const currentMatch = getCurrentSlot(slots, playlists);

  return (
    <ScheduleContext.Provider value={{ slots, playlists, loadingSchedule, currentMatch, toggleSlot, editSlotFn , addSlot, removeSlot, addTrackToPlaylist }}>
      {children}
    </ScheduleContext.Provider>
  );
}

export function useSchedule() {
  return useContext(ScheduleContext);
}