import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input/InputField";
import ErrorMessage from "../components/ErrorMessage/ErrorMessage";
import Button from "../components/Button/Button";
import AuthLayout from "../components/Layouts/AuthLayout";
import { User } from "lucide-react";
import { useAuth } from "../components/Context/AuthContext";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(formData);
    if (result.success) {
      navigate("/chat");
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your account">
      <div className="flex justify-center mb-6">
        <div className="bg-gradient-to-r from-green-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center">
          <User className="h-8 w-8 text-white" />
        </div>
      </div>
      <form onSubmit={handleLogin} className="space-y-6">
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
        />
        <Input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Password"
        />
        <ErrorMessage message={error} />
        <Button type="submit" loading={loading}>
          Sign In
        </Button>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}

export default LoginPage;
