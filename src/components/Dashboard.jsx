import { useEffect, useState } from "react";
import axios from "axios";

// ✅ ENV + FALLBACK
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://synchire-backend-2hdm.onrender.com";

function Dashboard() {
  const [stats, setStats] = useState({
    students: 0,
    companies: 0,
    schedule: 0
  });

  const [loading, setLoading] = useState(false);

  // =========================
  // FETCH STATS
  // =========================
  const fetchStats = async () => {
    try {
      setLoading(true);

      const [studentsRes, companiesRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/students`),
        axios.get(`${BASE_URL}/api/companies`)
      ]);

      const students = studentsRes.data.data?.length || 0;
      const companies = companiesRes.data.data?.length || 0;

      // ⚠️ No schedule endpoint exists → approximate or keep 0
      // (you can replace this later with /api/schedule if you build it)
      const schedule = 0;

      setStats({ students, companies, schedule });

    } catch (err) {
      console.log("DASHBOARD ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div style={container}>
      <div style={headerRow}>
        <h2 style={title}>📊 Dashboard</h2>

        <button onClick={fetchStats} style={refreshBtn}>
          Refresh
        </button>
      </div>

      {loading ? (
        <p style={infoText}>Loading stats...</p>
      ) : (
        <div style={grid}>
          <StatCard label="Students" value={stats.students} />
          <StatCard label="Companies" value={stats.companies} />
          <StatCard label="Scheduled Interviews" value={stats.schedule} />
        </div>
      )}
    </div>
  );
}

// =========================
// CARD COMPONENT
// =========================
function StatCard({ label, value }) {
  return (
    <div style={card}>
      <h3 style={valueStyle}>{value}</h3>
      <p style={labelStyle}>{label}</p>
    </div>
  );
}

// =========================
// STYLES (Improved UI)
// =========================

const container = {
  marginBottom: "30px"
};

const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "15px"
};

const title = {
  margin: 0
};

const refreshBtn = {
  padding: "6px 12px",
  backgroundColor: "#1a1a1a",
  color: "white",
  border: "1px solid #333",
  borderRadius: "6px",
  cursor: "pointer"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "15px"
};

const card = {
  padding: "20px",
  borderRadius: "12px",
  background: "#1e1e1e",
  border: "1px solid #333",
  textAlign: "center",
  transition: "0.2s"
};

const valueStyle = {
  fontSize: "32px",
  margin: 0,
  fontWeight: "bold"
};

const labelStyle = {
  marginTop: "8px",
  color: "#aaa",
  fontSize: "14px"
};

const infoText = {
  color: "#aaa"
};

export default Dashboard;