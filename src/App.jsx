import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Chat from "./components/Chat";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat/:userId" element={<Chat />} />
      </Routes>
    </Router>
  )
}

export default App
