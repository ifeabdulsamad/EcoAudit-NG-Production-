import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuditProvider } from "./context/AuditContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { TestingModeProvider } from "./context/TestingModeContext.jsx";
import Navbar from "./components/shared/Navbar.jsx";
import Landing from "./pages/Landing.jsx";
import Audit from "./pages/Audit.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import MyAudits from "./pages/MyAudits.jsx";
import Pricing from "./pages/Pricing.jsx";
import Testing from "./pages/Testing.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <TestingModeProvider>
        <AuthProvider>
          <AuditProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/audit" element={<Audit />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/my-audits" element={<MyAudits />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/testing" element={<Testing />} />
            </Routes>
          </AuditProvider>
        </AuthProvider>
      </TestingModeProvider>
    </BrowserRouter>
  );
}
