import { useNavigate } from "react-router-dom";
import BottomNav from "../../components/BottomNav/BottomNav";

const FREE_FEATURES = [
  "✅ 3 curated playlists",
  "✅ Basic vibes (Morning, Afternoon, Evening)",
  "✅ Manual playlist selection",
  "❌ Smart scheduling",
  "❌ Unlimited playlists",
  "❌ Analytics & insights",
  "❌ Priority support",
];

const PLUS_FEATURES = [
  "✅ Unlimited playlists",
  "✅ All vibes & moods",
  "✅ Smart auto-scheduling",
  "✅ Analytics & insights",
  "✅ Custom branding music",
  "✅ Multi-location support",
  "✅ Priority support",
];

function Plans() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">

      <div className="dashboard-header">
        <div>
          <h1>Plans</h1>
          <p className="business-name">Choose your plan</p>
        </div>
        <button className="back-btn" onClick={() => navigate("/dashboard")}>← Back</button>
      </div>

      {/* Free Plan */}
      <div className="plan-card">
        <div className="plan-header">
          <h2>Free</h2>
          <div className="plan-price">
            <span className="price-amount">$0</span>
            <span className="price-period">/ month</span>
          </div>
        </div>
        <ul className="plan-features">
          {FREE_FEATURES.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <button className="plan-btn plan-btn--current">Current Plan</button>
      </div>

      {/* Plus Plan */}
      <div className="plan-card plan-card--plus">
        <div className="plus-badge">MOST POPULAR</div>
        <div className="plan-header">
          <h2>Plus ✨</h2>
          <div className="plan-price">
            <span className="price-amount">$29</span>
            <span className="price-period">/ month</span>
          </div>
        </div>
        <ul className="plan-features">
          {PLUS_FEATURES.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <button className="plan-btn plan-btn--upgrade">Upgrade to Plus</button>
      </div>

      <div style={{ height: "100px" }} />
      <BottomNav />
    </div>
  );
}

export default Plans;
