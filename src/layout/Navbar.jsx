import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";
import "../styles/Navbar.css";

export default function Navbar() {
  const { token, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <ul className="nav-menu">
          <li>
            <a href="#home" className="nav-link">
              Home
            </a>
          </li>
          <li>
            <a href="#about" className="nav-link">
              About
            </a>
          </li>
          <li>
            <a href="#request-ride" className="nav-link">
              Request Ride
            </a>
          </li>
          {token && user && user.role === "admin" && (
            <li>
              <NavLink to="/admin" className="nav-link admin-link">
                Admin Dashboard
              </NavLink>
            </li>
          )}
          {!token && (
            <li>
              <NavLink to="/login" className="auth-btn login-btn">
                Login
              </NavLink>
            </li>
          )}
          {token && (
            <li>
              <button onClick={handleLogout} className="auth-btn logout-btn">
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
