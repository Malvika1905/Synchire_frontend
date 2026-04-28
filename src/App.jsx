import Students from "./components/Students";
import Companies from "./components/Companies";
import Scheduler from "./components/Scheduler";

function App() {
  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial",
        backgroundColor: "#121212",   // 🔥 dark background
        minHeight: "100vh",
        color: "white"
      }}
    >
      <h1>🚀 Synchire Dashboard</h1>

      {/* Scheduler Section */}
      <div style={{ marginBottom: "30px" }}>
        <Scheduler />
      </div>

      <hr style={{ borderColor: "#333" }} />

      {/* Students Section */}
      <div style={{ marginTop: "20px" }}>
        <Students />
      </div>

      <hr style={{ borderColor: "#333" }} />

      {/* Companies Section */}
      <div style={{ marginTop: "20px" }}>
        <Companies />
      </div>
    </div>
  );
}

export default App;