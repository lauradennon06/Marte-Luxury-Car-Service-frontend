import { useState } from "react";
import { useNavigate } from "react-router";
import "../styles/ViewRidesByPhone.css";

const API = import.meta.env.VITE_API;

export default function ViewRidesByPhone() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [rides, setRides] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const response = await fetch(
        `${API}/rides/phone/${encodeURIComponent(phoneNumber)}`
      );

      if (!response.ok) {
        throw new Error("No rides found for this phone number");
      }

      const data = await response.json();
      setRides(data.data);
    } catch (err) {
      setError(err.message || "Failed to fetch rides");
      setRides([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="view-rides-container">
      <div className="view-rides-content">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back
        </button>

        <h1>View Your Bookings</h1>
        <p className="view-rides-subtitle">
          Enter your phone number to view all your past and future rides
        </p>

        <form onSubmit={handleSearch} className="phone-search-form">
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={phoneNumber}
              onChange={handleInputChange}
              placeholder="(555) 123-4567"
              required
              className="phone-input"
            />
          </div>
          <button type="submit" className="search-btn" disabled={loading}>
            {loading ? "Searching..." : "Search Rides"}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}

        {searched && !error && rides !== null && (
          <div className="rides-results">
            {rides.length === 0 ? (
              <p className="no-rides">No rides found for this phone number.</p>
            ) : (
              <>
                <h2>Your Bookings ({rides.length})</h2>
                <div className="rides-list">
                  {rides.map((ride) => (
                    <div key={ride.id} className="ride-card">
                      <div className="ride-header">
                        <span className="ride-status">{ride.status}</span>
                        <span className="ride-date">
                          {new Date(ride.pickup_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="ride-details">
                        <p>
                          <strong>From:</strong> {ride.pickup_location}
                        </p>
                        <p>
                          <strong>To:</strong> {ride.dropoff_location}
                        </p>
                        <p>
                          <strong>Time:</strong> {ride.pickup_time}
                        </p>
                        <p>
                          <strong>Vehicle:</strong> {ride.vehicle_type}
                        </p>
                        <p>
                          <strong>Passengers:</strong> {ride.num_passengers}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
