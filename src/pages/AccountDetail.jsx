import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, useParams } from "react-router";
import "../styles/AccountDetail.css";

const API = import.meta.env.VITE_API;

export default function AccountDetail() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams();
  const [account, setAccount] = useState(null);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Redirect if not admin
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!token || !userId) return;

    const fetchAccountAndRides = async () => {
      try {
        setLoading(true);

        // Fetch account details
        const userResponse = await fetch(`${API}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userResponse.ok) {
          throw new Error("Failed to fetch account");
        }

        const userData = await userResponse.json();
        setAccount(userData.data);

        // Fetch all rides and filter by user_id
        const ridesResponse = await fetch(`${API}/rides`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!ridesResponse.ok) {
          throw new Error("Failed to fetch rides");
        }

        const ridesData = await ridesResponse.json();
        const userRides = (ridesData.data || []).filter(
          (ride) => ride.user_id === parseInt(userId),
        );
        setRides(userRides);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountAndRides();
  }, [token, userId]);

  const filterRides = () => {
    if (filter === "all") return rides;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filter === "upcoming") {
      return rides.filter((ride) => {
        const rideDate = new Date(ride.pickup_date);
        return rideDate >= today;
      });
    }

    if (filter === "past") {
      return rides.filter((ride) => {
        const rideDate = new Date(ride.pickup_date);
        return rideDate < today;
      });
    }

    return rides;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "-";
    const [hours, minutes] = timeString.split(":");
    return new Date(0, 0, 0, hours, minutes).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const filteredRides = filterRides();

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="account-detail">
      <div className="account-container">
        <div className="account-header">
          <h1>Account Details</h1>
          <button
            className="back-btn"
            onClick={() => navigate("/admin/accounts")}
          >
            Back to Accounts
          </button>
        </div>

        {loading && <div className="loading">Loading account details...</div>}
        {error && <div className="error">{error}</div>}

        {!loading && account && (
          <>
            <div className="account-info">
              <div className="info-card">
                <div className="info-row">
                  <label>Username:</label>
                  <span>{account.username}</span>
                </div>
                <div className="info-row">
                  <label>Email:</label>
                  <span>{account.email}</span>
                </div>
                <div className="info-row">
                  <label>Phone:</label>
                  <span>{account.phone_number || "-"}</span>
                </div>
                <div className="info-row">
                  <label>Account Type:</label>
                  <span className={`account-type ${account.account_type}`}>
                    {account.account_type}
                  </span>
                </div>
                {account.company_name && (
                  <div className="info-row">
                    <label>Company:</label>
                    <span>{account.company_name}</span>
                  </div>
                )}
                <div className="info-row">
                  <label>Member Since:</label>
                  <span>{formatDate(account.created_at)}</span>
                </div>
              </div>
            </div>

            <div className="rides-section">
              <div className="rides-header">
                <h2>Rides for {account.username}</h2>
                <div className="filter-buttons">
                  <button
                    className={`filter-btn ${filter === "all" ? "active" : ""}`}
                    onClick={() => setFilter("all")}
                  >
                    All
                  </button>
                  <button
                    className={`filter-btn ${
                      filter === "upcoming" ? "active" : ""
                    }`}
                    onClick={() => setFilter("upcoming")}
                  >
                    Upcoming
                  </button>
                  <button
                    className={`filter-btn ${filter === "past" ? "active" : ""}`}
                    onClick={() => setFilter("past")}
                  >
                    Past
                  </button>
                </div>
              </div>

              {filteredRides.length === 0 ? (
                <div className="no-rides">No rides found for this account</div>
              ) : (
                <div className="rides-table-wrapper">
                  <table className="rides-table">
                    <thead>
                      <tr>
                        <th>Client Name</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Pickup Location</th>
                        <th>Dropoff Location</th>
                        <th>Date</th>
                        <th>Pickup Time</th>
                        <th>Passengers</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRides.map((ride) => (
                        <tr key={ride.id}>
                          <td>{ride.first_name} {ride.last_name}</td>
                          <td>{ride.phone_number}</td>
                          <td>{ride.email}</td>
                          <td>{ride.pickup_location}</td>
                          <td>{ride.dropoff_location}</td>
                          <td>{formatDate(ride.pickup_date)}</td>
                          <td>{formatTime(ride.pickup_time)}</td>
                          <td>{ride.num_passengers}</td>
                          <td>
                            <span
                              className={`status-badge status-${ride.status}`}
                            >
                              {ride.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
