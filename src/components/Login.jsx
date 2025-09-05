import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (input === "1" || input === "2" || input === "3") {
      const userId = `user${input}`;
      navigate(`/chat/${userId}`);
    } else {
      alert("Enter 1, 2 or 3 to login as user1, user2, or user3");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl mb-4">Dummy Login</h2>
      <input
        type="text"
        placeholder="Enter 1 or 2 or 3"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border p-2 mb-4"
      />
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Login
      </button>
    </div>
  );
}

export default Login;
