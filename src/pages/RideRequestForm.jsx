import { useState } from "react";
import "../styles/RideRequestForm.css";

export default function RideRequestForm() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    opt_in_sms: false,
    pickup_location: "",
    dropoff_location: "",
    pickup_date: "",
    pickup_time: "",
    vehicle_type: "",
    num_passengers: 1,
    special_requests: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const closeErrorModal = () => {
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate SMS agreement
      if (!formData.opt_in_sms) {
        setError(
          <div>
            <p>You must agree to receive text messages to request a ride.</p>
            <p style={{ marginTop: "1rem", marginBottom: "1rem" }}>
              If you have any issues, please:
            </p>
            <p style={{ marginBottom: "0.5rem" }}>
              Call: <a href="tel:+19149065308">+1-914-906-5308</a>
            </p>
            <p style={{ marginBottom: "1rem" }}>
              Email:{" "}
              <a href="mailto:info@martecarservice.com">
                info@martecarservice.com
              </a>
            </p>
            <p style={{ fontSize: "0.9rem" }}>
              Please review our{" "}
              <a href="/terms" target="_blank" rel="noopener noreferrer">
                Terms and Conditions
              </a>{" "}
              and{" "}
              <a href="/privacy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>{" "}
              for more information.
            </p>
          </div>,
        );
        setLoading(false);
        return;
      }

      // Build request body with only required and provided optional fields
      const body = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone_number,
        pickup_location: formData.pickup_location,
        dropoff_location: formData.dropoff_location,
        pickup_date: formData.pickup_date,
        pickup_time: formData.pickup_time,
        num_passengers: formData.num_passengers,
      };

      // Add optional fields only if they have values
      if (formData.special_requests.trim()) {
        body.special_requests = formData.special_requests;
      }
      if (formData.vehicle_type) {
        body.vehicle_type = formData.vehicle_type;
      }

      const response = await fetch("http://localhost:3000/rides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to request ride");
      }

      setSuccess(true);
      setFormData({
        first_name: "",
        last_name: "",
        phone_number: "",
        opt_in_sms: false,
        pickup_location: "",
        dropoff_location: "",
        pickup_date: "",
        pickup_time: "",
        vehicle_type: "",
        num_passengers: 1,
        special_requests: "",
      });

      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="error-modal-overlay">
          <div className="error-modal">
            <button className="error-modal-close" onClick={closeErrorModal}>
              ×
            </button>
            <h3>⚠ Error</h3>
            <div className="error-modal-content">{error}</div>
            <button className="error-modal-btn" onClick={closeErrorModal}>
              Close
            </button>
          </div>
        </div>
      )}

      <section id="request-ride" className="ride-request">
        <div className="ride-container">
          <h2>Request Your Ride</h2>

          <form className="ride-form" onSubmit={handleSubmit}>
            <h3>Personal Information</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="first_name">First Name *</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="last_name">Last Name *</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
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
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>
            </div>

            <div className="form-group checkbox-group">
              <label htmlFor="opt_in_sms" className="checkbox-label">
                <input
                  type="checkbox"
                  id="opt_in_sms"
                  name="opt_in_sms"
                  checked={formData.opt_in_sms}
                  onChange={handleChange}
                />
                <span className="checkbox-text">
                  By checking this box and submitting this form, you agree to
                  receive text messages from Marte Luxury Car Service regarding
                  your ride confirmations, updates, and travel information.
                  Message and data rates may apply. You also acknowledge and
                  agree to our{" "}
                  <a href="/privacy" target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a href="/terms" target="_blank" rel="noopener noreferrer">
                    Terms of Service
                  </a>
                  . *
                </span>
              </label>
            </div>

            <h3>Trip Details</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="pickup_location">Pickup Location *</label>
                <input
                  type="text"
                  id="pickup_location"
                  name="pickup_location"
                  value={formData.pickup_location}
                  onChange={handleChange}
                  placeholder="Enter pickup address"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="dropoff_location">Drop-off Location *</label>
                <input
                  type="text"
                  id="dropoff_location"
                  name="dropoff_location"
                  value={formData.dropoff_location}
                  onChange={handleChange}
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
                  value={formData.pickup_date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="pickup_time">Pickup Time *</label>
                <input
                  type="time"
                  id="pickup_time"
                  name="pickup_time"
                  value={formData.pickup_time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="vehicle_type">
                  Select a Vehicle{" "}
                  <span className="optional-text">optional</span>
                </label>
                <select
                  id="vehicle_type"
                  name="vehicle_type"
                  value={formData.vehicle_type}
                  onChange={handleChange}
                >
                  <option value="">Choose a vehicle</option>
                  <option value="sedan">Sedan</option>
                  <option value="luxury-sedan">Luxury Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="luxury-suv">Luxury SUV</option>
                  <option value="sprinter-van-8">
                    8 Passenger Sprinter Van
                  </option>
                  <option value="sprinter-van-16">
                    16 Passenger Sprinter Van
                  </option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="num_passengers">Number of Passengers *</label>
                <input
                  type="number"
                  id="num_passengers"
                  name="num_passengers"
                  min="1"
                  max="10"
                  value={formData.num_passengers}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="special_requests">Special Requests</label>
              <textarea
                id="special_requests"
                name="special_requests"
                placeholder=" Enjoy complimentary Wi-Fi, beverages, and child car seats upon
              request. Let us know your preferences, and we’ll be happy to
              accommodate your needs whenever possible."
                rows="4"
                value={formData.special_requests}
                onChange={handleChange}
              ></textarea>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Submitting..." : "Request Ride"}
            </button>
          </form>

          {success && (
            <div className="success-message">
              <h3>✓ Ride Request Received!</h3>
              <p>
                Thank you for choosing Marte Luxury Car Service. We'll contact
                you shortly to confirm your ride.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
