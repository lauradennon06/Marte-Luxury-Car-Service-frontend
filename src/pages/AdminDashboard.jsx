import { useEffect, useState, Fragment } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router";
import "../styles/AdminDashboard.css";

const API = import.meta.env.VITE_API;

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [searchType, setSearchType] = useState("phone");
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [scheduleFormData, setScheduleFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    pickup_location: "",
    dropoff_location: "",
    pickup_date: "",
    pickup_time: "",
    num_passengers: 1,
    vehicle_type: "Sedan",
    special_requests: "",
  });
  const [scheduleError, setScheduleError] = useState(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [expandedRideId, setExpandedRideId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [editingRideId, setEditingRideId] = useState(null);
  const [priceRideId, setPriceRideId] = useState(null);
  const [priceQuoteAmount, setPriceQuoteAmount] = useState("");

  useEffect(() => {
    // Redirect if not admin
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!token) return;

    const fetchRides = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API}/rides`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch rides");
        }

        const data = await response.json();
        setRides(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [token]);

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

  const handleDeleteRide = async (rideId) => {
    if (!window.confirm("Are you sure you want to delete this ride?")) {
      return;
    }

    try {
      const response = await fetch(`${API}/rides/${rideId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete ride");
      }

      // Remove the ride from state
      setRides(rides.filter((ride) => ride.id !== rideId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleConfirmRide = async (rideId) => {
    if (!window.confirm("Confirm this ride?")) {
      return;
    }

    setActionLoading(rideId);
    try {
      const response = await fetch(`${API}/rides/${rideId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "approved" }),
      });

      if (!response.ok) {
        throw new Error("Failed to confirm ride");
      }

      const updatedRide = await response.json();
      setRides(
        rides.map((ride) => (ride.id === rideId ? updatedRide.data : ride)),
      );
      setExpandedRideId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelRide = async (rideId) => {
    if (!window.confirm("Cancel this ride? The customer will be notified.")) {
      return;
    }

    setActionLoading(rideId);
    try {
      const response = await fetch(`${API}/rides/${rideId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "cancelled" }),
      });

      if (!response.ok) {
        throw new Error("Failed to cancel ride");
      }

      const updatedRide = await response.json();
      setRides(
        rides.map((ride) => (ride.id === rideId ? updatedRide.data : ride)),
      );
      setExpandedRideId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendPrice = async (rideId) => {
    if (!priceQuoteAmount || isNaN(parseFloat(priceQuoteAmount))) {
      setError("Please enter a valid price amount");
      return;
    }

    setActionLoading(rideId);
    try {
      const response = await fetch(`${API}/rides/${rideId}/send-price`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ total_cost: parseFloat(priceQuoteAmount) }),
      });

      if (!response.ok) {
        throw new Error("Failed to send price quote");
      }

      const updatedRide = await response.json();
      setRides(
        rides.map((ride) => (ride.id === rideId ? updatedRide.data : ride)),
      );
      setPriceRideId(null);
      setPriceQuoteAmount("");
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchValue.trim()) {
      setSearchResults(null);
      return;
    }

    let results = [];

    if (searchType === "phone") {
      results = rides.filter((ride) =>
        ride.phone_number.includes(searchValue.trim()),
      );
    } else if (searchType === "lastName") {
      results = rides.filter((ride) =>
        ride.last_name.toLowerCase().includes(searchValue.toLowerCase()),
      );
    } else if (searchType === "date") {
      results = rides.filter(
        (ride) => formatDate(ride.pickup_date) === searchValue,
      );
    }

    setSearchResults(results);
  };

  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setScheduleFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    setScheduleLoading(true);
    setScheduleError(null);

    try {
      const method = editingRideId ? "PATCH" : "POST";
      const url = editingRideId
        ? `${API}/rides/${editingRideId}`
        : `${API}/rides`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(scheduleFormData),
      });

      if (!response.ok) {
        throw new Error(
          editingRideId ? "Failed to update ride" : "Failed to schedule ride",
        );
      }

      const result = await response.json();
      const updatedRide = result.data;

      if (editingRideId) {
        // Update existing ride in state
        setRides(
          rides.map((ride) => (ride.id === editingRideId ? updatedRide : ride)),
        );
        setEditingRideId(null);
      } else {
        // Add new ride to beginning of list
        setRides([updatedRide, ...rides]);
      }

      setShowScheduleForm(false);
      setScheduleFormData({
        first_name: "",
        last_name: "",
        phone_number: "",
        pickup_location: "",
        dropoff_location: "",
        pickup_date: "",
        pickup_time: "",
        num_passengers: 1,
        vehicle_type: "Sedan",
        special_requests: "",
      });
    } catch (err) {
      setScheduleError(err.message);
    } finally {
      setScheduleLoading(false);
    }
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <div className="admin-header-buttons">
            <button
              className="search-rides-btn"
              onClick={() => setShowSearchForm(!showSearchForm)}
            >
              {showSearchForm ? "Hide Search" : "Search Rides"}
            </button>
            <button
              className="schedule-ride-btn"
              onClick={() => setShowScheduleForm(true)}
            >
              Schedule Ride
            </button>
          </div>
        </div>

        {showSearchForm && (
          <div className="search-form-section">
            <h3>Search Rides</h3>
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-form-group">
                <label htmlFor="searchType">Search By:</label>
                <select
                  id="searchType"
                  value={searchType}
                  onChange={(e) => {
                    setSearchType(e.target.value);
                    setSearchValue("");
                    setSearchResults(null);
                  }}
                >
                  <option value="phone">Phone Number</option>
                  <option value="lastName">Last Name</option>
                  <option value="date">Ride Date</option>
                </select>
              </div>
              <div className="search-form-group">
                <label htmlFor="searchValue">
                  {searchType === "phone"
                    ? "Phone Number"
                    : searchType === "lastName"
                      ? "Name"
                      : "Date (MM/DD/YYYY)"}
                </label>
                <input
                  id="searchValue"
                  type={searchType === "date" ? "date" : "text"}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={
                    searchType === "phone"
                      ? "(555) 123-4567"
                      : searchType === "lastName"
                        ? "Smith"
                        : "MM/DD/YYYY"
                  }
                />
              </div>
              <button type="submit" className="search-btn">
                Search
              </button>
            </form>

            {searchResults !== null && (
              <div className="search-results">
                {searchResults.length === 0 ? (
                  <p>No rides found matching your search.</p>
                ) : (
                  <p>{searchResults.length} ride(s) found</p>
                )}
              </div>
            )}
          </div>
        )}

        <div className="filter-section">
          <h2>{searchResults !== null ? "Search Results" : "All Rides"}</h2>
          {searchResults === null && (
            <div className="filter-buttons">
              <button
                className={`filter-btn ${filter === "all" ? "active" : ""}`}
                onClick={() => setFilter("all")}
              >
                All Rides
              </button>
              <button
                className={`filter-btn ${filter === "upcoming" ? "active" : ""}`}
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
          )}
        </div>

        {loading && <div className="loading">Loading rides...</div>}
        {error && <div className="error">{error}</div>}

        {!loading &&
          (searchResults !== null
            ? searchResults.length === 0
            : filteredRides.length === 0) && (
            <div className="no-rides">No rides found</div>
          )}

        {!loading &&
          (searchResults !== null
            ? searchResults.length > 0
            : filteredRides.length > 0) && (
            <div className="rides-table-wrapper">
              <table className="rides-table">
                <thead>
                  <tr>
                    <th>Client Name</th>
                    <th>Phone</th>
                    <th>Pickup Location</th>
                    <th>Dropoff Location</th>
                    <th>Date</th>
                    <th>Pickup Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(searchResults !== null ? searchResults : filteredRides).map(
                    (ride) => (
                      <Fragment key={ride.id}>
                        <tr className="ride-row">
                          <td>
                            <button
                              className="expand-btn"
                              onClick={() =>
                                setExpandedRideId(
                                  expandedRideId === ride.id ? null : ride.id,
                                )
                              }
                            >
                              {expandedRideId === ride.id ? "▼" : "▶"}
                            </button>
                            {ride.first_name} {ride.last_name}
                          </td>
                          <td>{ride.phone_number}</td>
                          <td>{ride.pickup_location}</td>
                          <td>{ride.dropoff_location}</td>
                          <td>{formatDate(ride.pickup_date)}</td>
                          <td>{formatTime(ride.pickup_time)}</td>
                          <td>
                            <span
                              className={`status-badge status-${ride.status}`}
                            >
                              {ride.status}
                            </span>
                          </td>
                          <td>
                            <button
                              className="view-btn"
                              onClick={() =>
                                setExpandedRideId(
                                  expandedRideId === ride.id ? null : ride.id,
                                )
                              }
                            >
                              {expandedRideId === ride.id ? "Hide" : "View"}
                            </button>
                          </td>
                        </tr>
                        {expandedRideId === ride.id && (
                          <tr
                            key={`${ride.id}-details`}
                            className="ride-details-row"
                          >
                            <td colSpan="8">
                              <div className="ride-details-container">
                                <div className="ride-details-grid">
                                  <div className="detail-item">
                                    <label>Name:</label>
                                    <span>
                                      {ride.first_name} {ride.last_name}
                                    </span>
                                  </div>
                                  <div className="detail-item">
                                    <label>Phone:</label>
                                    <span>{ride.phone_number}</span>
                                  </div>
                                  <div className="detail-item">
                                    <label>Pickup Location:</label>
                                    <span>{ride.pickup_location}</span>
                                  </div>
                                  <div className="detail-item">
                                    <label>Dropoff Location:</label>
                                    <span>{ride.dropoff_location}</span>
                                  </div>
                                  <div className="detail-item">
                                    <label>Date:</label>
                                    <span>{formatDate(ride.pickup_date)}</span>
                                  </div>
                                  <div className="detail-item">
                                    <label>Pickup Time:</label>
                                    <span>{formatTime(ride.pickup_time)}</span>
                                  </div>
                                  <div className="detail-item">
                                    <label>Number of Passengers:</label>
                                    <span>{ride.num_passengers}</span>
                                  </div>
                                  <div className="detail-item">
                                    <label>Vehicle Type:</label>
                                    <span>
                                      {ride.vehicle_type || "Not specified"}
                                    </span>
                                  </div>
                                  <div className="detail-item full-width">
                                    <label>Special Requests:</label>
                                    <span>
                                      {ride.special_requests ||
                                        "No special requests"}
                                    </span>
                                  </div>
                                  <div className="detail-item">
                                    <label>Status:</label>
                                    <span
                                      className={`status-badge status-${ride.status}`}
                                    >
                                      {ride.status}
                                    </span>
                                  </div>
                                </div>
                                <div className="ride-actions">
                                  <button
                                    className="edit-btn"
                                    onClick={() => {
                                      // Convert date from ISO format to YYYY-MM-DD
                                      const dateObj = new Date(
                                        ride.pickup_date,
                                      );
                                      const formattedDate = dateObj
                                        .toISOString()
                                        .split("T")[0];

                                      // Time should already be HH:mm:ss format
                                      const formattedTime = ride.pickup_time;

                                      setScheduleFormData({
                                        first_name: ride.first_name,
                                        last_name: ride.last_name,
                                        phone_number: ride.phone_number,
                                        pickup_location: ride.pickup_location,
                                        dropoff_location: ride.dropoff_location,
                                        pickup_date: formattedDate,
                                        pickup_time: formattedTime,
                                        num_passengers: ride.num_passengers,
                                        vehicle_type:
                                          ride.vehicle_type || "Sedan",
                                        special_requests:
                                          ride.special_requests || "",
                                      });
                                      setEditingRideId(ride.id);
                                      setShowScheduleForm(true);
                                      setExpandedRideId(null);
                                    }}
                                  >
                                    Edit Ride
                                  </button>
                                  {ride.status === "pending" && (
                                    <>
                                      <button
                                        className="price-btn"
                                        onClick={() =>
                                          setPriceRideId(
                                            priceRideId === ride.id
                                              ? null
                                              : ride.id,
                                          )
                                        }
                                      >
                                        {priceRideId === ride.id
                                          ? "Hide Price Form"
                                          : "Send Price Quote"}
                                      </button>
                                      {priceRideId === ride.id && (
                                        <div className="price-form-inline">
                                          <input
                                            type="number"
                                            placeholder="Enter price ($)"
                                            value={priceQuoteAmount}
                                            onChange={(e) =>
                                              setPriceQuoteAmount(
                                                e.target.value,
                                              )
                                            }
                                            step="0.01"
                                            min="0"
                                          />
                                          <button
                                            className="submit-price-btn"
                                            onClick={() =>
                                              handleSendPrice(ride.id)
                                            }
                                            disabled={actionLoading === ride.id}
                                          >
                                            {actionLoading === ride.id
                                              ? "Sending..."
                                              : "Send Quote"}
                                          </button>
                                        </div>
                                      )}
                                    </>
                                  )}
                                  {ride.status === "customer_confirmed" && (
                                    <button
                                      className="confirm-btn"
                                      onClick={() => handleConfirmRide(ride.id)}
                                      disabled={actionLoading === ride.id}
                                    >
                                      {actionLoading === ride.id
                                        ? "Confirming..."
                                        : "Confirm Booking"}
                                    </button>
                                  )}
                                  <button
                                    className="cancel-btn"
                                    onClick={() => handleCancelRide(ride.id)}
                                    disabled={actionLoading === ride.id}
                                  >
                                    {actionLoading === ride.id
                                      ? "Cancelling..."
                                      : "Cancel Ride"}
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          )}
      </div>

      {showScheduleForm && (
        <div className="schedule-modal-overlay">
          <div className="schedule-modal">
            <div className="schedule-modal-header">
              <h2>{editingRideId ? "Edit Ride" : "Schedule a Ride"}</h2>
              <button
                className="close-btn"
                onClick={() => {
                  setShowScheduleForm(false);
                  setEditingRideId(null);
                }}
              >
                ✕
              </button>
            </div>

            {scheduleError && (
              <div className="schedule-error">{scheduleError}</div>
            )}

            <form onSubmit={handleScheduleSubmit} className="schedule-form">
              <div className="form-section">
                <h3>Client Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="first_name">First Name *</label>
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={scheduleFormData.first_name}
                      onChange={handleScheduleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="last_name">Last Name *</label>
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={scheduleFormData.last_name}
                      onChange={handleScheduleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone_number">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone_number"
                      name="phone_number"
                      value={scheduleFormData.phone_number}
                      onChange={handleScheduleChange}
                      placeholder="+1 (555) 000-0000"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Trip Details</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="pickup_location">Pickup Location *</label>
                    <input
                      type="text"
                      id="pickup_location"
                      name="pickup_location"
                      value={scheduleFormData.pickup_location}
                      onChange={handleScheduleChange}
                      placeholder="Enter pickup address"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="dropoff_location">
                      Drop-off Location *
                    </label>
                    <input
                      type="text"
                      id="dropoff_location"
                      name="dropoff_location"
                      value={scheduleFormData.dropoff_location}
                      onChange={handleScheduleChange}
                      placeholder="Enter drop-off address"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="pickup_date">Pickup Date *</label>
                    <input
                      type="date"
                      id="pickup_date"
                      name="pickup_date"
                      value={scheduleFormData.pickup_date}
                      onChange={handleScheduleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="pickup_time">Pickup Time *</label>
                    <input
                      type="time"
                      id="pickup_time"
                      name="pickup_time"
                      value={scheduleFormData.pickup_time}
                      onChange={handleScheduleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="vehicle_type">Vehicle Type *</label>
                    <select
                      id="vehicle_type"
                      name="vehicle_type"
                      value={scheduleFormData.vehicle_type}
                      onChange={handleScheduleChange}
                      required
                    >
                      <option>Sedan</option>
                      <option>Luxury Sedan</option>
                      <option>SUV</option>
                      <option>Luxury SUV</option>
                      <option>8 Passenger Sprinter Van</option>
                      <option>16 Passenger Sprinter Van</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="num_passengers">
                      Number of Passengers *
                    </label>
                    <input
                      type="number"
                      id="num_passengers"
                      name="num_passengers"
                      min="1"
                      value={scheduleFormData.num_passengers}
                      onChange={handleScheduleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="form-group">
                  <label htmlFor="special_requests">Special Requests</label>
                  <textarea
                    id="special_requests"
                    name="special_requests"
                    value={scheduleFormData.special_requests}
                    onChange={handleScheduleChange}
                    placeholder="Enter any special requests or notes"
                    rows="3"
                  />
                </div>
              </div>

              <div className="schedule-form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowScheduleForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={scheduleLoading}
                >
                  {scheduleLoading
                    ? editingRideId
                      ? "Updating..."
                      : "Scheduling..."
                    : editingRideId
                      ? "Update Ride"
                      : "Schedule Ride"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
