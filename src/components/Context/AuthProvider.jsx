import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import chatServices from "../../main.service";
import ToastService from "../../utility/toastService";
import STATUS_CODES from "../../constants/statusCodes";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAuth = localStorage.getItem("isAuthenticated");
    if (storedUser && storedAuth === "true") {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // Login
  const login = async (formData) => {
    try {
      const response = await chatServices.loginService(formData);
      if (response?.status_code === STATUS_CODES?.OK && response?.user) {
        ToastService.show("success", response?.message || "Login successful");
        setUser(response.user);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(response?.user));
        localStorage.setItem("isAuthenticated", "true");
        return { success: true };
      } else {
        ToastService.show("error", response?.message || "Login failed");
        return { success: false, message: response?.message || "Login failed" };
      }
    } catch(err) {
      ToastService.show("error", "An unexpected error occurred");
      return { success: false, message: err.message || "Error during login" };
    }
  };

  // Signup
  const signup = async (formData) => {
    try {
      const response = await chatServices.signupService(formData);
      if (response.status_code === 200 && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("isAuthenticated", "true");
        return { success: true };
      } else {
        return { success: false, message: response.message || "Signup failed" };
      }
    } catch {
      return { success: false, message: "Error during signup" };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
