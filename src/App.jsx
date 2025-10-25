import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignupPage from "./pages/SignupPage";
import ChatDashboard from "./pages/ChatDashboard";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import AuthProvider from "./components/Context/AuthProvider";
import SocketProvider from "./components/Context/SocketProvider";
import NewChat from "./pages/NewChat";


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <SocketProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/chat" element={<ChatDashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/new-chat" element={<NewChat/>} />
        </Routes>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
