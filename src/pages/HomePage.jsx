import { useState, useEffect } from "react";
import "../styles/HomePage.css";
import airportImg from "../assets/airport.jpg";
import businessImg from "../assets/business.jpg";
import customTripsImg from "../assets/custom.jpg";
import paymentsImg from "../assets/payments.jpg";
import calculatorImg from "../assets/wallet.jpg";
import safetyImg from "../assets/safety.jpg";
import suburban from "../assets/cars/suburban.png";
import lsedan from "../assets/cars/Lsedan.png";
import lsuv from "../assets/cars/LSUV.png";
import sprintervan from "../assets/cars/sprintervan.png";

const carImages = [suburban, lsedan, lsuv, sprintervan];

export default function HomePage() {
  const [currentCarIndex, setCurrentCarIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCarIndex((prevIndex) => (prevIndex + 1) % carImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  return (
    <>
      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-content">
          <h1>MARTE LUXURY CAR SERVICE</h1>
          <p className="tagline">
            Premium Luxury Transportation in New York City
          </p>
          <p className="service-coverage">
            Serving All Five Boroughs of New York City, with service extending
            throughout New Jersey, Pennsylvania, and Connecticut.
          </p>

          <button
            className="cta-btn"
            onClick={() =>
              document
                .getElementById("request-ride")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Request a Ride
          </button>
        </div>
        <div className="hero-overlay"></div>
      </section>

      {/* Cars Carousel Section */}
      <section className="cars-carousel">
        <div className="carousel-container">
          <h2 className="cars-heading">A car for every occasion</h2>
          <h3 className="cars-subheading">
            luxury sedans, SUVs, sprinter vans and more...
          </h3>
          <div className="cars-row">
            {carImages.map((car, index) => (
              <a href="#request-ride" key={index} className="carousel-link">
                <img
                  src={car}
                  alt={`Marte Luxury Car ${index + 1}`}
                  className="carousel-image"
                />
              </a>
            ))}
          </div>
          <div className="cars-licensing-grid">
            <div className="cars-licensing-item">
              <span className="checkmark">✓</span>
              <span>TLC Licensed Drivers</span>
            </div>
            <div className="cars-licensing-item">
              <span className="checkmark">✓</span>
              <span>Background Checks</span>
            </div>
            <div className="cars-licensing-item">
              <span className="checkmark">✓</span>
              <span>Liability Insurance</span>
            </div>
            <div className="cars-licensing-item">
              <span className="checkmark">✓</span>
              <span>Inspected Vehicles</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="about-container">
          <div className="about-content">
            <h2>RELIABLE, SAFE and COMFORTABLE</h2>
            <p className="about-description">
              At{" "}
              <span style={{ fontWeight: 700 }}>Marte Luxury Car Service</span>,
              every ride is built around experience, trust, and personalized
              service. Founded by a professional driver with{" "}
              <span style={{ fontWeight: 700 }}>
                {" "}
                more than 12 years of experience
              </span>
              , we bring a{" "}
              <span style={{ fontWeight: 700 }}>commitment to safety</span>,
              reliability, and comfort to every trip. From airport transfers and
              business travel to family rides and transportation with children,
              we understand that every client has different needs. Our{" "}
              <span style={{ fontWeight: 700 }}>
                trusted network of professional drivers{" "}
              </span>
              shares the same{" "}
              <span style={{ fontWeight: 700 }}>
                high standards and code of ethics
              </span>
              , ensuring you receive the same exceptional level of service every
              time.
            </p>

            <div className="features">
              <div className="feature">
                <div className="feature-content">
                  <h3>Upfront Pricing</h3>
                  <p>
                    transparent pricing with no hidden fees—know your rate
                    before you ride
                  </p>
                </div>
                <div className="feature-image">
                  <img src={calculatorImg} alt="Upfront Pricing" />
                </div>
              </div>
              <div className="feature">
                <div className="feature-content">
                  <h3>Airport Transportation</h3>
                  <p>
                    stress-free travel to and from all NYC airports, with
                    attention to timing and flight schedules
                  </p>
                </div>
                <div className="feature-image">
                  <img src={airportImg} alt="Airport Transportation" />
                </div>
              </div>
              <div className="feature">
                <div className="feature-content">
                  <h3>Corporate and Business</h3>
                  <p>
                    punctual transportation for for executives, meetings, events
                    and business travel
                  </p>
                </div>
                <div className="feature-image">
                  <img src={businessImg} alt="Corporate and Business" />
                </div>
              </div>
              <div className="feature">
                <div className="feature-content">
                  <h3>Custom Trips</h3>
                  <p>
                    flexible options tailored to your destination and schedule,
                    hourly rates available
                  </p>
                </div>
                <div className="feature-image">
                  <img src={customTripsImg} alt="Custom Trips" />
                </div>
              </div>
              <div className="feature">
                <div className="feature-content">
                  <h3>Flexible Payments</h3>
                  <p>
                    multiple payment options including credit cards, digital
                    wallets, and cash for your convenience
                  </p>
                </div>
                <div className="feature-image">
                  <img src={paymentsImg} alt="Flexible Payments" />
                </div>
              </div>
              <div className="feature">
                <div className="feature-content">
                  <h3>Safety First</h3>
                  <p>
                    all drivers are TLC licensed, with inspected vehicles and
                    comprehensive liability insurance
                  </p>
                </div>
                <div className="feature-image">
                  <img src={safetyImg} alt="Safety First" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
