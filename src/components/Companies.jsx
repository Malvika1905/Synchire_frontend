import { useEffect, useState } from "react";
import axios from "axios";

function Companies() {
  const [companies, setCompanies] = useState([]);

  const [form, setForm] = useState({
    name: "",
    industry: "",
    interview_priority: "",
    required_skills: ""
  });

  const fetchCompanies = () => {
    axios
      .get("http://localhost:5000/api/companies")
      .then((res) => {
        setCompanies(Array.isArray(res.data.data) ? res.data.data : []);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const addCompany = () => {
    if (!form.name) {
      alert("Company name required");
      return;
    }

    axios
      .post("http://localhost:5000/api/companies", {
        ...form,
        interview_priority: Number(form.interview_priority) || 0,
        required_skills: form.required_skills
          ? form.required_skills.split(",").map((s) => s.trim())
          : []
      })
      .then(() => {
        setForm({
          name: "",
          industry: "",
          interview_priority: "",
          required_skills: ""
        });
        fetchCompanies();
      })
      .catch((err) => console.log(err));
  };

  const deleteCompany = (id) => {
    if (!window.confirm("Delete this company?")) return;

    axios
      .delete(`http://localhost:5000/api/companies/${id}`)
      .then(() => fetchCompanies())
      .catch((err) => console.log(err));
  };

  return (
    <div style={{ marginTop: "20px", color: "white" }}>
      <h2>🏢 Companies</h2>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "20px"
        }}
      >
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

      {companies.length === 0 ? (
        <p>No companies found.</p>
      ) : (
        companies.map((c) => (
          <div
            key={c.company_id}
            style={{
              border: "1px solid #444",
              padding: "12px",
              margin: "10px 0",
              borderRadius: "8px",
              backgroundColor: "#1e1e1e"
            }}
          >
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

/* STYLES */
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

export default Companies;