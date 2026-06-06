import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSchedule, formatTime, ScheduleSlot } from "../../context/ScheduleContext";
import AddSlotModal from "../../components/AddSlotModal/AddSlotModal";
import BottomNav from "../../components/BottomNav/BottomNav";

function Schedule() {
  const { slots, playlists, toggleSlot, removeSlot, currentMatch, loadingSchedule } = useSchedule();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [editSlot,  setEditSlot]  = useState<ScheduleSlot | undefined>(undefined);
  const [deleteId,  setDeleteId]  = useState<string | null>(null);

  const getPlaylistName = (id: string) => {
    const p = playlists.find((pl) => pl.id === id);
return p ? (p.emoji + " " + p.name) : "-";  };

  const handleEdit = (slot: ScheduleSlot) => {
    setEditSlot(slot);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditSlot(undefined);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    await removeSlot(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="dashboard-page">

      <div className="dashboard-header">
        <div>
          <h1>Schedule</h1>
          <p className="business-name">Smart Music Timing</p>
        </div>
        <div className="plan-badge">FREE</div>
      </div>

      {!loadingSchedule && (
        currentMatch ? (
          <div className="now-playing-banner">
            <span className="now-dot" />
            <span className="now-label">Sonando ahora</span>
            <span className="now-vibe">
              {currentMatch.playlist.emoji} {currentMatch.playlist.name}
            </span>
          </div>
        ) : (
          <div className="now-playing-banner now-playing-banner--off">
            <span className="now-label">Sin vibe activa en este horario</span>
          </div>
        )
      )}

      <div
        className="action-card"
        style={{ background: "rgba(147,51,234,.15)", border: "1px solid #9333ea", marginBottom: 8 }}
        onClick={() => navigate("/plans")}
      >
        <div className="action-card-icon">⚡</div>
        <div>
          <h3>Auto-scheduling</h3>
          <p>Upgrade to Plus to enable</p>
        </div>
        <span className="action-arrow upgrade-lock">🔒</span>
      </div>

      {loadingSchedule ? (
        <div className="loading-screen" style={{ minHeight: 200 }}>
          <div className="loading-spinner" />
        </div>
      ) : (
        <div className="schedule-list">
          {slots.map((slot) => {
            const isCurrent = currentMatch?.slot.id === slot.id;
            return (
              <div
                key={slot.id}
className={"schedule-item " + (slot.active ? "schedule-item--active" : "") + " " + (isCurrent ? "schedule-item--current" : "")}              >
                <div className="schedule-emoji">
                  {playlists.find((p) => p.id === slot.playlistId)?.emoji ?? "🎵"}
                </div>

                <div className="schedule-info">
                  <h3>
                    {slot.label}
                    {isCurrent && <span className="current-tag">AHORA</span>}
                  </h3>
                  <p>
                    {formatTime(slot.startHour, slot.startMinute)} –{" "}
                    {formatTime(slot.endHour, slot.endMinute)}
                  </p>
                  <p className="schedule-playlist-name">
                    {getPlaylistName(slot.playlistId)}
                  </p>
                </div>

                <div className="schedule-right">
                  <button
                    className="slot-edit-btn"
                    onClick={() => handleEdit(slot)}
                    aria-label="Editar slot"
                  >
                    ✏️
                  </button>
                  <button
                    className="slot-delete-btn"
                    onClick={() => setDeleteId(slot.id)}
                    aria-label="Eliminar slot"
                  >
                    🗑️
                  </button>
                  <button
className={"schedule-toggle " + (slot.active ? "schedule-toggle--on" : "")}                    onClick={() => toggleSlot(slot.id)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button
        className="add-slot-btn"
        onClick={() => { setEditSlot(undefined); setShowModal(true); }}
      >
        + Agregar horario
      </button>

      {showModal && (
        <AddSlotModal
          onClose={handleCloseModal}
          editSlot={editSlot}
        />
      )}

      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div
            className="modal-card"
            style={{ gap: 16 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Eliminar horario</h2>
              <button className="modal-close" onClick={() => setDeleteId(null)}>✕</button>
            </div>
            <p style={{ color: "#94a3b8", fontSize: 15 }}>
              ¿Seguro que quieres eliminar este horario? Esta acción no se puede deshacer.
            </p>
            <button
              className="modal-save-btn"
              style={{ background: "linear-gradient(90deg,#dc2626,#ef4444)" }}
              onClick={handleDeleteConfirm}
            >
              Sí, eliminar
            </button>
            <button className="create-btn" onClick={() => setDeleteId(null)}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div style={{ height: "100px" }} />
      <BottomNav />
    </div>
  );
}

export default Schedule;