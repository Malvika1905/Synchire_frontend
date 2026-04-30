import { useEffect, useState } from "react";
import axios from "axios";

// ✅ ENV + FALLBACK
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://synchire-backend-2hdm.onrender.com";

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    industry: "",
    interview_priority: "",
    required_skills: ""
  });

  // =========================
  // FETCH COMPANIES
  // =========================
  const fetchCompanies = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${BASE_URL}/api/companies`);

      if (res.data.success) {
        setCompanies(res.data.data || []);
      } else {
        setCompanies([]);
      }
    } catch (err) {
      console.log("FETCH ERROR:", err);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // =========================
  // ADD COMPANY
  // =========================
  const addCompany = async () => {
    if (!form.name || !form.industry) {
      alert("Name and Industry required");
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/api/companies`, {
        ...form,
        interview_priority: Number(form.interview_priority) || 1,
        required_skills: form.required_skills
          ? form.required_skills.split(",").map((s) => s.trim())
          : []
      });

      if (res.data.success) {
        setForm({
          name: "",
          industry: "",
          interview_priority: "",
          required_skills: ""
        });

        fetchCompanies();
      } else {
        alert(res.data.message || "Failed to add company");
      }
    } catch (err) {
      console.log("ADD ERROR:", err);
      alert(
        err.response?.data?.message ||
          "Server error while adding company"
      );
    }
  };

  // =========================
  // DELETE COMPANY
  // =========================
  const deleteCompany = async (id) => {
    if (!window.confirm("Delete this company?")) return;

    try {
      const res = await axios.delete(
        `${BASE_URL}/api/companies/${id}`
      );

      if (res.data.success) {
        fetchCompanies();
      } else {
        alert(res.data.message || "Delete failed");
      }
    } catch (err) {
      console.log("DELETE ERROR:", err);
      alert(
        err.response?.data?.message ||
          "Server error while deleting company"
      );
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div style={container}>
      <h2 style={title}>🏢 Companies</h2>

      {/* FORM */}
      <div style={formContainer}>
        <input
          style={inputStyle}
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          style={inputStyle}
          placeholder="Industry"
          value={form.industry}
          onChange={(e) =>
            setForm({ ...form, industry: e.target.value })
          }
        />

        <input
          style={inputStyle}
          placeholder="Priority (1-5)"
          value={form.interview_priority}
          onChange={(e) =>
            setForm({
              ...form,
              interview_priority: e.target.value
            })
          }
        />

        <input
          style={inputStyle}
          placeholder="Required Skills"
          value={form.required_skills}
          onChange={(e) =>
            setForm({
              ...form,
              required_skills: e.target.value
            })
          }
        />

        <button onClick={addCompany} style={addBtn}>
          + Add
        </button>
      </div>

      {/* LIST */}
      {loading ? (
        <p style={infoText}>Loading...</p>
      ) : companies.length === 0 ? (
        <p style={infoText}>No companies found.</p>
      ) : (
        <div style={grid}>
          {companies.map((c) => (
            <div key={c.company_id} style={cardStyle}>
              <strong style={nameStyle}>{c.name}</strong>

              <p style={industryStyle}>{c.industry}</p>

              <p style={priorityStyle}>
                Priority: {c.interview_priority}
              </p>

              <p style={skillsStyle}>
                {Array.isArray(c.required_skills)
                  ? c.required_skills.join(", ")
                  : "-"}
              </p>

              <button
                onClick={() =>
                  deleteCompany(c.company_id)
                }
                style={deleteBtn}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// =========================
// STYLES (Aligned with Students UI)
// =========================

const container = {
  padding: "20px",
  color: "white"
};

const title = {
  marginBottom: "15px"
};

const formContainer = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginBottom: "25px"
};

const inputStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #333",
  backgroundColor: "#111",
  color: "white",
  minWidth: "180px"
};

const addBtn = {
  backgroundColor: "#00c853",
  color: "white",
  border: "none",
  padding: "10px 14px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold"
};

const deleteBtn = {
  marginTop: "10px",
  backgroundColor: "#d32f2f",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: "5px",
  cursor: "pointer"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
  gap: "15px"
};

const cardStyle = {
  border: "1px solid #333",
  padding: "15px",
  borderRadius: "10px",
  backgroundColor: "#1a1a1a",
  transition: "0.2s"
};

const nameStyle = {
  fontSize: "16px"
};

const industryStyle = {
  color: "#aaa",
  fontSize: "13px"
};

const priorityStyle = {
  marginTop: "5px",
  fontSize: "13px",
  color: "#ccc"
};

const skillsStyle = {
  marginTop: "8px",
  color: "#bbb",
  fontSize: "13px"
};

const infoText = {
  color: "#aaa"
};

export default Companies;