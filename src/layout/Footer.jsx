import { useState } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router";
import { useAuth } from "../auth/AuthContext";
import "../styles/Footer.css";

export default function Footer() {
  const { token, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleNavClick = (sectionId) => {
    if (location.pathname !== "/") {
      navigate(`/#${sectionId}`);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="footer">
      <div className="footer-nav-container">
        <ul className="footer-nav-menu">
          <li>
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("home");
              }}
              className="footer-nav-link"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("about");
              }}
              className="footer-nav-link"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#request-ride"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("request-ride");
              }}
              className="footer-nav-link"
            >
              Request Ride
            </a>
          </li>
          <li>
            <NavLink to="/view-rides" className="footer-nav-link">
              View Rides
            </NavLink>
          </li>
          {token && user && user.role === "admin" && (
            <li>
              <NavLink to="/admin" className="footer-nav-link admin-link">
                Admin Dashboard
              </NavLink>
            </li>
          )}
          {token && (
            <li>
              <button
                onClick={handleLogout}
                className="footer-auth-btn logout-btn"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
      <div
        className="admin-login-trigger"
        onMouseEnter={() => setShowAdminLogin(true)}
        onMouseLeave={() => setShowAdminLogin(false)}
      >
        {!token && showAdminLogin && (
          <NavLink to="/login" className="admin-login-link">
            Admin Login
          </NavLink>
        )}
      </div>
      <div className="footer-content">
        <p>
          &copy; 2026 Marte Luxury Car Service LLC |{" "}
          <Link to="/privacy">Privacy Policy</Link> |{" "}
          <Link to="/terms">Terms of Service</Link>
        </p>
      </div>
    </footer>
  );
}
