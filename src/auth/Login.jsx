import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "./AuthContext";
import { jwtDecode } from "jwt-decode";
import "../styles/Auth.css";

/** A form that allows users to log into an existing account. */
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(formData);

      // Get the token from sessionStorage to check user role
      const token = sessionStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);

        // Redirect to admin dashboard
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Admin Login</h1>
        <p className="auth-subtitle">Log in to Marte Luxury Car Service Admin</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={onLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}
