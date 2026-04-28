import { useState } from "react";
import axios from "axios";

// ✅ use env variable
const BASE_URL = import.meta.env.VITE_API_URL;

function Scheduler() {
  const [schedule, setSchedule] = useState([]);

  const generateSchedule = () => {
    axios
      .post(`${BASE_URL}/api/generate`)
      .then((res) => {
        setSchedule(
          Array.isArray(res.data.data) ? res.data.data : []
        );
      })
      .catch((err) => {
        console.log("SCHEDULE ERROR:", err);
        alert("Failed to generate schedule");
      });
  };

  return (
    <div style={{ color: "white" }}>
      <h2>⚡ Scheduler</h2>

      <button
        onClick={generateSchedule}
        style={{
          padding: "10px 15px",
          backgroundColor: "#000",
          color: "#fff",
          border: "1px solid #444",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Generate Interview Schedule
      </button>

      {schedule.length > 0 && (
        <table
          style={{
            width: "100%",
            marginTop: "20px",
            borderCollapse: "collapse"
          }}
        >
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
              <tr key={index}>
                <td>{item.student}</td>
                <td>{item.email}</td>
                <td>{item.company}</td>
                <td>{item.industry}</td>
                <td>{item.panel}</td>
                <td>
                  {new Date(item.start_time).toLocaleTimeString()} -{" "}
                  {new Date(item.end_time).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Scheduler;