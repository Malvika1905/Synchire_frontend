import { useState } from "react";
import axios from "axios";

// ✅ ENV + FALLBACK
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://synchire-backend-2hdm.onrender.com";

function Scheduler() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);

  // =========================
  // GENERATE SCHEDULE
  // =========================
  const generateSchedule = async () => {
    try {
      setLoading(true);

      const res = await axios.post(`${BASE_URL}/api/generate`);

      if (res.data.success) {
        setSchedule(
          Array.isArray(res.data.data) ? res.data.data : []
        );
      } else {
        setSchedule([]);
        alert(res.data.message || "Failed to generate schedule");
      }
    } catch (err) {
      console.log("SCHEDULE ERROR:", err);

      alert(
        err.response?.data?.message ||
          "Server error while generating schedule"
      );

      setSchedule([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <h2 style={title}>⚡ Scheduler</h2>

      <button
        onClick={generateSchedule}
        style={btnStyle}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Interview Schedule"}
      </button>

      {/* STATES */}
      {loading ? (
        <p style={infoText}>Generating schedule...</p>
      ) : schedule.length === 0 ? (
        <p style={infoText}>No schedule generated yet.</p>
      ) : (
        <div style={tableWrapper}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Company</th>
                <th>Industry</th>
                <th>Panel</th>
                <th>Time</th>
              </tr>
            </thead>

            <tbody>
              {schedule.map((item, index) => (
                <tr key={index} style={rowStyle}>
                  <td>{item.student}</td>
                  <td>{item.email}</td>
                  <td>{item.company}</td>
                  <td>{item.industry}</td>
                  <td>{item.panel}</td>
                  <td>
                    {formatTime(item.start_time)} -{" "}
                    {formatTime(item.end_time)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// =========================
// HELPERS
// =========================

const formatTime = (time) => {
  if (!time) return "-";
  try {
    return new Date(time).toLocaleTimeString();
  } catch {
    return "-";
  }
};

// =========================
// STYLES (Aligned UI)
// =========================

const container = {
  padding: "20px",
  color: "white"
};

const title = {
  marginBottom: "15px"
};

const btnStyle = {
  padding: "10px 16px",
  backgroundColor: "#00c853",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold"
};

const tableWrapper = {
  marginTop: "20px",
  overflowX: "auto"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "#1a1a1a",
  borderRadius: "10px",
  overflow: "hidden"
};

const rowStyle = {
  borderTop: "1px solid #333"
};

const infoText = {
  marginTop: "15px",
  color: "#aaa"
};

export default Scheduler;