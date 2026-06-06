import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSchedule, formatTime } from "../../context/ScheduleContext";
import BottomNav from "../../components/BottomNav/BottomNav";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentMatch } = useSchedule();

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="dashboard-page">

      <div className="dashboard-header">
        <div>
          <h1>Welcome Back</h1>
          <p className="business-name">Bella Vista Restaurant</p>
        </div>
        <button className="signout-btn" onClick={handleSignOut}>Exit</button>
      </div>

      {user?.email && <p className="user-email">{user.email}</p>}

      <div className="player-card">
        <div>
          <span className="player-label">
            {currentMatch ? "Sonando ahora · Schedule" : "Currently Playing"}
          </span>
          <h2 className="player-title">
            {currentMatch ? `${currentMatch.playlist.emoji} ${currentMatch.playlist.name}` : "Relaxed Dinner 🍽️"}
          </h2>
          <p className="player-meta">
            {currentMatch
              ? `${formatTime(currentMatch.slot.startHour, currentMatch.slot.startMinute)} – ${formatTime(currentMatch.slot.endHour, currentMatch.slot.endMinute)} · ${currentMatch.playlist.tracks.length} tracks`
              : "32 tracks · Curated for evenings"}
          </p>
        </div>
        <div className="play-button">▶</div>
      </div>

      <div className="chips">
        <button className="chip chip--active">Restaurant</button>
        <button className="chip">Café</button>
        <button className="chip">Retail</button>
        <button className="chip">Hotel</button>
      </div>

      <div className="action-card" onClick={() => navigate("/music")}>
        <div className="action-card-icon">🎧</div>
        <div><h3>Browse Vibes</h3><p>Find the perfect mood for your space</p></div>
        <span className="action-arrow">›</span>
      </div>

      <div className="action-card" onClick={() => navigate("/schedule")}>
        <div className="action-card-icon">📅</div>
        <div><h3>Smart Schedule</h3><p>Auto-switch music by time of day</p></div>
        <span className="action-arrow">›</span>
      </div>

      <div className="upgrade-card" onClick={() => navigate("/plans")}>
        <div className="upgrade-badge">FREE</div>
        <h3>Upgrade to Plus ✨</h3>
        <p>Unlimited playlists, scheduling & analytics</p>
        <button className="upgrade-btn">See Plans</button>
      </div>

      <div style={{ height: "100px" }} />
      <BottomNav />
    </div>
  );
}

export default Dashboard;