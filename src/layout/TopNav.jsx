import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";
import "../styles/TopNav.css";

const sections = [
  { id: "about", label: "About Us" },
  { id: "request-ride", label: "Request Ride" },
  { id: "contact", label: "Contact Us" },
];

export default function TopNav() {
  const { token, logout, user } = useAuth();
  const navigate = useNavigate();

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="top-nav">
      <ul className="top-nav-menu">
        {sections.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className="top-nav-link"
              onClick={(e) => {
                e.preventDefault();
                scrollTo(id);
              }}
            >
              {label}
            </a>
          </li>
        ))}
        <li>
          <NavLink to="/view-rides" className="top-nav-link">
            View Rides
          </NavLink>
        </li>
        {token && user && user.role === "admin" && (
          <li>
            <NavLink to="/admin" className="top-nav-link">
              Admin Dashboard
            </NavLink>
          </li>
        )}
        {token && (
          <li>
            <button onClick={handleLogout} className="top-nav-link top-nav-btn">
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
