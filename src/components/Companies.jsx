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

  console.log("BASE_URL:", BASE_URL);

  // =========================
  // FETCH COMPANIES
  // =========================
  const fetchCompanies = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${BASE_URL}/api/companies`);

      console.log("FETCH RESPONSE:", res.data);

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

      console.log("ADD RESPONSE:", res.data);

      if (res.data.success) {
        alert("Company added ✅");

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

      const msg =
        err.response?.data?.message ||
        "Server error while adding company";

      alert(msg);
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

      console.log("DELETE RESPONSE:", res.data);

      if (res.data.success) {
        alert("Company deleted ✅");
        fetchCompanies();
      } else {
        alert(res.data.message || "Delete failed");
      }
    } catch (err) {
      console.log("DELETE ERROR:", err);

      const msg =
        err.response?.data?.message ||
        "Server error while deleting company";

      alert(msg);
    }
  };

  return (
    <div style={{ marginTop: "20px", color: "white" }}>
      <h2>🏢 Companies</h2>

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
        <p style={{ color: "#aaa" }}>Loading...</p>
      ) : companies.length === 0 ? (
        <p style={{ color: "#aaa" }}>No companies found.</p>
      ) : (
        companies.map((c) => (
          <div key={c.company_id} style={cardStyle}>
            <p><strong>{c.name}</strong></p>
            <p>{c.industry}</p>
            <p>Priority: {c.interview_priority}</p>

            <p>
              Skills:{" "}
              {Array.isArray(c.required_skills)
                ? c.required_skills.join(", ")
                : ""}
            </p>

            <button
              onClick={() => deleteCompany(c.company_id)}
              style={deleteBtn}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

// =========================
// STYLES
// =========================

const formContainer = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginBottom: "20px"
};

const inputStyle = {
  padding: "8px",
  borderRadius: "5px",
  border: "1px solid #444",
  backgroundColor: "#121212",
  color: "white"
};

const addBtn = {
  backgroundColor: "#00c853",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "5px",
  cursor: "pointer"
};

const deleteBtn = {
  marginTop: "8px",
  backgroundColor: "#d32f2f",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: "5px",
  cursor: "pointer"
};

const cardStyle = {
  border: "1px solid #444",
  padding: "12px",
  margin: "10px 0",
  borderRadius: "8px",
  backgroundColor: "#1e1e1e"
};

export default Companies;