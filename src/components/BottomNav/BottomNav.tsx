import { useNavigate, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { path: "/dashboard", icon: "🏠", label: "Home" },
  { path: "/music",     icon: "🎵", label: "Music" },
  { path: "/schedule",  icon: "📅", label: "Schedule" },
  { path: "/settings",  icon: "⚙️", label: "Settings" },
];

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="bottom-nav">
      {NAV_ITEMS.map(({ path, icon, label }) => {
        const isActive = location.pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`nav-btn ${isActive ? "nav-btn--active" : ""}`}
            aria-label={label}
          >
            <span className="nav-icon">{icon}</span>
            <span className="nav-label">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default BottomNav;
