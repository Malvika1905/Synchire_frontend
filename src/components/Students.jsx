import { useEffect, useState } from "react";
import axios from "axios";

// ✅ use env variable
const BASE_URL = import.meta.env.VITE_API_URL;

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    skills: "",
    resume_url: ""
  });

  // 🔹 FETCH STUDENTS
  const fetchStudents = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${BASE_URL}/api/students`
      );

      if (res.data.success) {
        setStudents(res.data.data || []);
      } else {
        setStudents([]);
        alert(res.data.message || "Failed to fetch students");
      }
    } catch (err) {
      console.log("FETCH ERROR:", err);
      alert("Server error while fetching students");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // 🔥 ADD STUDENT
  const addStudent = async () => {
    if (!form.name || !form.email) {
      alert("Name and Email are required!");
      return;
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/api/students`,
        {
          ...form,
          name: form.name.trim(),
          email: form.email.trim(),
          skills: form.skills
            ? form.skills.split(",").map((s) => s.trim())
            : []
        }
      );

      if (res.data.success) {
        alert("Student added successfully ✅");

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

      const msg =
        err.response?.data?.message ||
        "Server error while adding student";

      alert(msg);
    }
  };

  // 🔥 DELETE STUDENT
  const deleteStudent = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {
      const res = await axios.delete(
        `${BASE_URL}/api/students/${id}`
      );

      if (res.data.success) {
        alert("Student deleted ✅");
        fetchStudents();
      } else {
        alert(res.data.message || "Delete failed");
      }
    } catch (err) {
      console.log("DELETE ERROR:", err);

      const msg =
        err.response?.data?.message ||
        "Server error while deleting student";

      alert(msg);
    }
  };

  return (
    <div style={{ marginTop: "20px", color: "white" }}>
      <h2>🎓 Students</h2>

      {/* FORM */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={inputStyle}
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={inputStyle}
        />

        <input
          placeholder="Skills (comma separated)"
          value={form.skills}
          onChange={(e) => setForm({ ...form, skills: e.target.value })}
          style={inputStyle}
        />

        <input
          placeholder="Resume URL"
          value={form.resume_url}
          onChange={(e) => setForm({ ...form, resume_url: e.target.value })}
          style={inputStyle}
        />

        <button onClick={addStudent} style={addBtn}>
          + Add
        </button>
      </div>

      {/* LIST */}
      <div>
        {loading ? (
          <p style={{ color: "#aaa" }}>Loading...</p>
        ) : students.length === 0 ? (
          <p style={{ color: "#aaa" }}>No students found.</p>
        ) : (
          students.map((s) => (
            <div key={s.student_id} style={cardStyle}>
              <p><strong>{s.name}</strong></p>
              <p>{s.email}</p>

              <p style={{ color: "#bbb" }}>
                Skills: {Array.isArray(s.skills) ? s.skills.join(", ") : ""}
              </p>

              <button
                onClick={() => deleteStudent(s.student_id)}
                style={deleteBtn}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// STYLES
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

export default Students;