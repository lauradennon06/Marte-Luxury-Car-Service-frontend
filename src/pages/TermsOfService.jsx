import "../styles/TermsOfService.css";

export default function TermsOfService() {
  return (
    <section id="terms" className="terms">
      <div className="terms-container">
        <h1>Terms of Service</h1>
        <p className="effective-date">
          <strong>Effective Date: September 9, 2026</strong>
        </p>

        <div className="terms-content">
          <p className="intro">
            Welcome to Marte Luxury Car Service LLC ("Marte Luxury Car Service,"
            "we," "us," or "our"). These Terms of Service govern your use of our
            website and transportation services.
          </p>

          <p>
            By using our website or requesting transportation services, you
            agree to these Terms of Service.
          </p>

          <section className="terms-section">
            <h2>Transportation Services</h2>
            <p>
              Marte Luxury Car Service provides private transportation services
              throughout New York City and the surrounding tri-state area,
              subject to availability and service-area limitations.
            </p>

            <p>
              Submitting a reservation request through our website does not
              necessarily guarantee that transportation has been confirmed. A
              reservation is considered confirmed only when Marte Luxury Car
              Service provides confirmation.
            </p>

            <p>
              We reserve the right to decline or modify a reservation when
              necessary due to availability, scheduling, safety, weather, road
              conditions, or other circumstances.
            </p>
          </section>

          <section className="terms-section">
            <h2>Reservation Information</h2>
            <p>
              Customers are responsible for providing accurate information when
              making a reservation, including:
            </p>
            <ul>
              <li>Name</li>
              <li>Phone number</li>
              <li>Email address</li>
              <li>Pickup location</li>
              <li>Drop-off location</li>
              <li>Requested date and time</li>
              <li>Any other information necessary to coordinate the ride</li>
            </ul>
            <p>
              Customers should promptly notify us of any changes to their
              reservation.
            </p>
          </section>

          <section className="terms-section">
            <h2>Communication</h2>
            <p>
              By providing your phone number, you may receive communications
              regarding your transportation reservation, including booking
              confirmations, reminders, pickup information, ride updates, and
              other service-related messages.
            </p>

            <p>
              Where required, we will obtain your consent before sending SMS
              messages.
            </p>

            <p>Message frequency varies. Message and data rates may apply.</p>

            <p>
              You may opt out of SMS communications at any time by replying{" "}
              <strong>STOP</strong>. Reply <strong>HELP</strong> for assistance.
            </p>

            <p>
              Consent to receive SMS messages is not a condition of purchasing
              or using our services.
            </p>
          </section>

          <section className="terms-section">
            <h2>Payments</h2>
            <p>
              Payment terms, rates, deposits, cancellation fees, and other
              applicable charges may vary depending on the transportation
              service requested and will be communicated to the customer before
              or during the reservation process.
            </p>

            <p>
              Customers are responsible for paying all agreed-upon charges for
              transportation services.
            </p>

            <p>
              To accept a price quote, we ask you to save a card on file
              through a secure page on our website. Your card details are
              entered directly into Square's secure form and are not stored on
              our servers. Your card is not charged when you save it, and we
              only charge it as you authorize on that page. We will never ask
              you to send card details by text message.
            </p>
          </section>

          <section className="terms-section">
            <h2>Cancellations and Changes</h2>
            <p>
              Cancellation and reservation-change policies may vary depending on
              the type of reservation and circumstances. Any applicable
              cancellation or change fees will be communicated to the customer
              when applicable.
            </p>
          </section>

          <section className="terms-section">
            <h2>Customer Responsibilities</h2>
            <p>
              Customers agree to provide accurate information and to use our
              services in a lawful and respectful manner.
            </p>

            <p>
              Customers are responsible for their personal belongings during
              transportation. Marte Luxury Car Service is not responsible for
              personal items that are lost, damaged, or left in a vehicle except
              as otherwise required by applicable law.
            </p>
          </section>

          <section className="terms-section">
            <h2>Service Interruptions</h2>
            <p>
              Transportation services may be affected by circumstances outside
              of our reasonable control, including severe weather, traffic,
              accidents, road closures, vehicle issues, governmental
              restrictions, or other unforeseen circumstances.
            </p>

            <p>
              We will make reasonable efforts to communicate significant changes
              or delays when possible.
            </p>
          </section>

          <section className="terms-section">
            <h2>Website Use</h2>
            <p>
              You agree not to misuse our website, interfere with its operation,
              attempt to gain unauthorized access, or use the website for
              unlawful purposes.
            </p>

            <p>
              We reserve the right to suspend or restrict access to the website
              when reasonably necessary.
            </p>
          </section>

          <section className="terms-section">
            <h2>Privacy</h2>
            <p>
              Your use of our website and services is also subject to our{" "}
              <a href="/privacy">Privacy Policy</a>, which explains how we
              collect and use personal information.
            </p>
          </section>

          <section className="terms-section">
            <h2>Limitation of Liability</h2>
            <p>
              To the extent permitted by applicable law, Marte Luxury Car
              Service LLC will not be responsible for indirect, incidental,
              special, or consequential damages arising from the use of our
              website or transportation services.
            </p>

            <p>
              Nothing in these Terms is intended to exclude or limit any
              liability that cannot legally be excluded or limited under
              applicable law.
            </p>
          </section>

          <section className="terms-section">
            <h2>Changes to These Terms</h2>
            <p>
              We may update these Terms of Service from time to time. Updated
              Terms will be posted on this page with a revised effective date.
            </p>

            <p>
              Your continued use of our website or services after changes are
              posted constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section className="terms-section">
            <h2>Contact Us</h2>
            <p>
              If you have questions regarding these Terms of Service, please
              contact:
            </p>

            <div className="contact-info-box">
              <p>
                <strong>Marte Luxury Car Service LLC</strong>
              </p>
              <p>New York, New York</p>
              <p>
                Email:{" "}
                <a href="mailto:info@martecarservice.com">
                  info@martecarservice.com
                </a>
              </p>
              <p>
                Phone: <a href="tel:9149065308">(914) 906-5308</a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
