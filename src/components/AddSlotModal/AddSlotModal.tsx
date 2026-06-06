import { useState } from "react";
import { useSchedule, ScheduleSlot } from "../../context/ScheduleContext";

interface Props {
  onClose: () => void;
  editSlot?: ScheduleSlot; // si viene, es modo edición
}

function AddSlotModal({ onClose, editSlot }: Props) {
  const { playlists, addSlot, editSlotFn } = useSchedule();

  const [label,       setLabel]       = useState(editSlot?.label       ?? "");
  const [startHour,   setStartHour]   = useState(editSlot?.startHour   ?? 9);
  const [startMinute, setStartMinute] = useState(editSlot?.startMinute ?? 0);
  const [endHour,     setEndHour]     = useState(editSlot?.endHour     ?? 11);
  const [endMinute,   setEndMinute]   = useState(editSlot?.endMinute   ?? 0);
  const [playlistId,  setPlaylistId]  = useState(editSlot?.playlistId  ?? playlists[0]?.id ?? "");
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState("");

  const isEditing = !!editSlot;
  const hours     = Array.from({ length: 24 }, (_, i) => i);
  const minutes   = [0, 15, 30, 45];

  const handleSave = async () => {
    if (!label.trim()) { setError("Ponle un nombre al horario."); return; }
    if (!playlistId)   { setError("Selecciona una playlist.");    return; }
    setSaving(true); setError("");
    try {
      if (isEditing) {
        await editSlotFn(editSlot.id, {
          label: label.trim(),
          startHour, startMinute,
          endHour, endMinute,
          playlistId,
        });
      } else {
        await addSlot({
          label: label.trim(),
          startHour, startMinute,
          endHour, endMinute,
          playlistId,
          active: true,
        });
      }
      onClose();
    } catch {
      setError("No se pudo guardar. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>

        <div className="modal-header">
          <h2>{isEditing ? "Editar horario" : "Nuevo horario"}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <label className="modal-label">Nombre del slot</label>
        <input
          className="modal-input"
          placeholder="Ej. Happy Hour, Brunch..."
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          maxLength={30}
        />

        <label className="modal-label">Hora de inicio</label>
        <div className="modal-time-row">
          <select className="modal-select" value={startHour} onChange={(e) => setStartHour(Number(e.target.value))}>
            {hours.map((h) => <option key={h} value={h}>{String(h).padStart(2, "0")}h</option>)}
          </select>
          <span className="modal-time-sep">:</span>
          <select className="modal-select" value={startMinute} onChange={(e) => setStartMinute(Number(e.target.value))}>
            {minutes.map((m) => <option key={m} value={m}>{String(m).padStart(2, "0")}</option>)}
          </select>
        </div>

        <label className="modal-label">Hora de fin</label>
        <div className="modal-time-row">
          <select className="modal-select" value={endHour} onChange={(e) => setEndHour(Number(e.target.value))}>
            {hours.map((h) => <option key={h} value={h}>{String(h).padStart(2, "0")}h</option>)}
          </select>
          <span className="modal-time-sep">:</span>
          <select className="modal-select" value={endMinute} onChange={(e) => setEndMinute(Number(e.target.value))}>
            {minutes.map((m) => <option key={m} value={m}>{String(m).padStart(2, "0")}</option>)}
          </select>
        </div>

        <label className="modal-label">Playlist</label>
        <div className="modal-playlist-grid">
          {playlists.map((p) => (
            <button
              key={p.id}
className={"modal-playlist-btn " + (playlistId === p.id ? "modal-playlist-btn--active" : "")}              onClick={() => setPlaylistId(p.id)}
            >
              <span>{p.emoji}</span>
              <span>{p.name}</span>
            </button>
          ))}
        </div>

        {error && <p className="modal-error">{error}</p>}

        <button className="modal-save-btn" onClick={handleSave} disabled={saving}>
          {saving ? "Guardando..." : isEditing ? "Guardar cambios" : "Guardar horario"}
        </button>

      </div>
    </div>
  );
}

export default AddSlotModal;