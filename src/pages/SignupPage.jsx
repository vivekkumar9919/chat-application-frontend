import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import chatServices from "../main.service";

// Reusable components
import Input from "../components/Input/InputField";
import ErrorMessage from "../components/ErrorMessage/ErrorMessage";
import Button from "../components/Button/Button";
import AuthLayout from "../components/Layouts/AuthLayout";

function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await chatServices.signupService(formData);
      if (response.status_code === 200) {
        setSuccess("Account created successfully! Please sign in.");
        setFormData({ username: "", email: "", password: "" });

        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(response.message || "Signup failed");
      }
    } catch (err) {
      setError("An error occurred during signup. Please try again.");
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Join ChatApp today">
      <div className="flex justify-center mb-6">
        <div className="bg-gradient-to-r from-green-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center">
          <User className="h-8 w-8 text-white" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          placeholder="Username"
        />
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

        {success && (
          <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-lg">
            {success}
          </div>
        )}

        <Button type="submit" loading={loading}>
          Create Account
        </Button>
      </form>

      <div className="text-center mt-6">
        <p className="text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}

export default SignupPage;
