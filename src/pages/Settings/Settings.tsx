import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import BottomNav from "../../components/BottomNav/BottomNav";

function Settings() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="dashboard-page">

      <div className="dashboard-header">
        <div>
          <h1>Settings</h1>
          <p className="business-name">Your Account</p>
        </div>
      </div>

      {/* Account info */}
      <div className="settings-card">
        <div className="settings-row">
          <span className="settings-label">Email</span>
          <span className="settings-value">{user?.email ?? "—"}</span>
        </div>
        <div className="settings-row">
          <span className="settings-label">Plan</span>
          <span className="settings-value plan-free">Free</span>
        </div>
      </div>

      {/* Business info */}
      <div className="settings-card">
        <div className="settings-row">
          <span className="settings-label">Business Name</span>
          <span className="settings-value">Bella Vista Restaurant</span>
        </div>
        <div className="settings-row">
          <span className="settings-label">Business Type</span>
          <span className="settings-value">Restaurant</span>
        </div>
      </div>

      {/* Upgrade */}
      <div className="upgrade-card" onClick={() => navigate("/plans")}>
        <div className="upgrade-badge">FREE</div>
        <h3>Upgrade to Plus ✨</h3>
        <p>Unlimited playlists, scheduling & analytics</p>
        <button className="upgrade-btn">See Plans</button>
      </div>

      {/* Sign out */}
      <button className="signout-full-btn" onClick={handleSignOut}>
        Sign Out
      </button>

      <div style={{ height: "100px" }} />
      <BottomNav />
    </div>
  );
}

export default Settings;
