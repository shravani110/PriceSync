import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Results from "./pages/Results";
import Login from "./pages/Login";
import Saved from "./pages/Saved";
import VerifyEmail from "./pages/VerifyEmail";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<Results />} />
        <Route path="/login" element={<Login />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
