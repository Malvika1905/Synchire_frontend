import { useState } from "react";
import Students from "./components/Students";
import Companies from "./components/Companies";
import Scheduler from "./components/Scheduler";
import Dashboard from "./components/Dashboard";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderComponent = () => {
    switch (activeTab) {
      case "students":
        return <Students />;
      case "companies":
        return <Companies />;
      case "scheduler":
        return <Scheduler />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div style={appStyle}>
      {/* HEADER */}
      <h1 style={header}>🚀 Synchire</h1>

      {/* NAVBAR */}
      <div style={navBar}>
        <NavButton
          label="Dashboard"
          active={activeTab === "dashboard"}
          onClick={() => setActiveTab("dashboard")}
        />
        <NavButton
          label="Students"
          active={activeTab === "students"}
          onClick={() => setActiveTab("students")}
        />
        <NavButton
          label="Companies"
          active={activeTab === "companies"}
          onClick={() => setActiveTab("companies")}
        />
        <NavButton
          label="Scheduler"
          active={activeTab === "scheduler"}
          onClick={() => setActiveTab("scheduler")}
        />
      </div>

      {/* CONTENT */}
      <div style={content}>{renderComponent()}</div>
    </div>
  );
}

// =========================
// NAV BUTTON COMPONENT
// =========================
const NavButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      ...navBtn,
      backgroundColor: active ? "#00c853" : "#1a1a1a",
      border: active ? "1px solid #00c853" : "1px solid #333"
    }}
  >
    {label}
  </button>
);

// =========================
// STYLES
// =========================

const appStyle = {
  minHeight: "100vh",
  backgroundColor: "#0f0f0f",
  color: "white",
  padding: "20px",
  fontFamily: "Arial, sans-serif"
};

const header = {
  textAlign: "center",
  marginBottom: "25px"
};

const navBar = {
  display: "flex",
  justifyContent: "center",
  gap: "10px",
  marginBottom: "25px",
  flexWrap: "wrap"
};

const navBtn = {
  padding: "10px 16px",
  borderRadius: "6px",
  cursor: "pointer",
  color: "white",
  backgroundColor: "#1a1a1a",
  border: "1px solid #333",
  fontWeight: "bold"
};

const content = {
  maxWidth: "1200px",
  margin: "auto",
  background: "#121212",
  padding: "20px",
  borderRadius: "12px",
  border: "1px solid #333"
};

export default App;