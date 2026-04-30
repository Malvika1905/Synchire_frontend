import { useEffect, useState } from "react";
import axios from "axios";

// ✅ ENV + FALLBACK (important for production)
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://synchire-backend-2hdm.onrender.com";

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    skills: "",
    resume_url: ""
  });

  // =========================
  // FETCH STUDENTS
  // =========================
  const fetchStudents = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${BASE_URL}/api/students`);

      if (res.data.success) {
        setStudents(res.data.data || []);
      } else {
        setStudents([]);
      }
    } catch (err) {
      console.log("FETCH ERROR:", err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // =========================
  // ADD STUDENT
  // =========================
  const addStudent = async () => {
    if (!form.name || !form.email) {
      alert("Name and Email are required");
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/api/students`, {
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        skills: form.skills
          ? form.skills.split(",").map((s) => s.trim())
          : []
      });

      if (res.data.success) {
        setForm({
          name: "",
          email: "",
          skills: "",
          resume_url: ""
        });

        fetchStudents();
      } else {
        alert(res.data.message || "Failed to add student");
      }
    } catch (err) {
      console.log("ADD ERROR:", err);
      alert(
        err.response?.data?.message ||
          "Server error while adding student"
      );
    }
  };

  // =========================
  // DELETE STUDENT
  // =========================
  const deleteStudent = async (id) => {
    if (!window.confirm("Delete this student?")) return;

    try {
      const res = await axios.delete(
        `${BASE_URL}/api/students/${id}`
      );

      if (res.data.success) {
        fetchStudents();
      } else {
        alert(res.data.message || "Delete failed");
      }
    } catch (err) {
      console.log("DELETE ERROR:", err);
      alert(
        err.response?.data?.message ||
          "Server error while deleting student"
      );
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div style={container}>
      <h2 style={title}>🎓 Students</h2>

      {/* FORM */}
      <div style={formContainer}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          style={inputStyle}
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          style={inputStyle}
        />

        <input
          placeholder="Skills (comma separated)"
          value={form.skills}
          onChange={(e) =>
            setForm({ ...form, skills: e.target.value })
          }
          style={inputStyle}
        />

        <input
          placeholder="Resume URL"
          value={form.resume_url}
          onChange={(e) =>
            setForm({
              ...form,
              resume_url: e.target.value
            })
          }
          style={inputStyle}
        />

        <button onClick={addStudent} style={addBtn}>
          + Add
        </button>
      </div>

      {/* LIST */}
      {loading ? (
        <p style={infoText}>Loading...</p>
      ) : students.length === 0 ? (
        <p style={infoText}>No students found.</p>
      ) : (
        <div style={grid}>
          {students.map((s) => (
            <div key={s.student_id} style={cardStyle}>
              <div style={{ marginBottom: "8px" }}>
                <strong style={{ fontSize: "16px" }}>
                  {s.name}
                </strong>
              </div>

              <p style={emailStyle}>{s.email}</p>

              <p style={skillsStyle}>
                {Array.isArray(s.skills)
                  ? s.skills.join(", ")
                  : "-"}
              </p>

              {s.resume_url && (
                <a
                  href={s.resume_url}
                  target="_blank"
                  rel="noreferrer"
                  style={resumeLink}
                >
                  View Resume
                </a>
              )}

              <button
                onClick={() =>
                  deleteStudent(s.student_id)
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
// STYLES (Improved UI)
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

const emailStyle = {
  color: "#aaa",
  fontSize: "13px"
};

const skillsStyle = {
  marginTop: "8px",
  color: "#bbb",
  fontSize: "13px"
};

const resumeLink = {
  display: "inline-block",
  marginTop: "8px",
  color: "#4cafef",
  fontSize: "13px",
  textDecoration: "none"
};

const infoText = {
  color: "#aaa"
};

export default Students;