import "../styles/PrivacyPolicy.css";

export default function PrivacyPolicy() {
  return (
    <section id="privacy" className="privacy">
      <div className="privacy-container">
        <h1>Privacy Policy</h1>
        <p className="effective-date">
          <strong>Effective Date: September 9, 2026</strong>
        </p>

        <div className="privacy-content">
          <p className="intro">
            Marte Luxury Car Service LLC ("Marte Luxury Car Service," "we,"
            "us," or "our") respects your privacy and is committed to protecting
            the information you provide when using our website and
            transportation services.
          </p>

          <p>
            This Privacy Policy explains what information we collect, how we use
            it, and how we handle communications, including text messages.
          </p>

          <section className="policy-section">
            <h2>Information We Collect</h2>
            <p>
              When you request or book transportation through our website, we
              may collect:
            </p>
            <ul>
              <li>Your name</li>
              <li>Phone number</li>
              <li>Email address</li>
              <li>Pickup location</li>
              <li>Drop-off location</li>
              <li>Date and time of your requested ride</li>
              <li>
                Other information you voluntarily provide regarding your
                reservation or transportation needs
              </li>
            </ul>
            <p>
              We may also collect basic technical information when you use our
              website, such as your IP address, browser type, device
              information, and information about how you interact with our
              website.
            </p>
          </section>

          <section className="policy-section">
            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Process and manage transportation reservations</li>
              <li>Confirm and coordinate your rides</li>
              <li>Contact you regarding your reservation</li>
              <li>Send booking confirmations and ride reminders</li>
              <li>Provide pickup, drop-off, and other ride-related updates</li>
              <li>Respond to questions and customer service requests</li>
              <li>Process payments when applicable</li>
              <li>Maintain and improve our website and services</li>
              <li>Comply with applicable legal requirements</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>Text Message Communications</h2>
            <p>
              If you provide your mobile phone number and consent to receive
              text messages, Marte Luxury Car Service may use SMS messaging to
              communicate with you regarding your transportation reservation and
              services.
            </p>

            <p>
              These messages may include booking confirmations, ride reminders,
              pickup information, schedule changes, driver or vehicle updates,
              and other information related to your requested transportation
              service.
            </p>

            <p>
              Message frequency varies depending on your reservations and
              interactions with us. Message and data rates may apply.
            </p>

            <p>
              You may opt out of text messages at any time by replying{" "}
              <strong>STOP</strong> to a message. You may reply{" "}
              <strong>HELP</strong> for assistance.
            </p>

            <p>
              Consent to receive text messages is not a condition of purchasing
              or using our transportation services.
            </p>

            <p>
              We do not sell or share your mobile phone number or SMS consent
              information with third parties or affiliates for their own
              marketing or promotional purposes.
            </p>
          </section>

          <section className="policy-section">
            <h2>How We Share Information</h2>
            <p>
              We may share information when reasonably necessary to provide our
              services, including with service providers that assist us with
              website operations, payment processing, communications,
              scheduling, or other business functions.
            </p>

            <p>
              We may also disclose information when required by law, legal
              process, or governmental request, or when reasonably necessary to
              protect our rights, customers, property, or safety.
            </p>

            <p>We do not sell your personal information.</p>
          </section>

          <section className="policy-section">
            <h2>Data Security</h2>
            <p>
              We take reasonable administrative, technical, and organizational
              measures to protect the information we collect. However, no method
              of transmitting or storing information electronically can be
              guaranteed to be completely secure.
            </p>
          </section>

          <section className="policy-section">
            <h2>Data Retention</h2>
            <p>
              We retain personal information for as long as reasonably necessary
              to provide our services, maintain business and financial records,
              resolve disputes, comply with legal obligations, and enforce our
              agreements.
            </p>
          </section>

          <section className="policy-section">
            <h2>Third-Party Services</h2>
            <p>
              Our website may use third-party services to provide functions such
              as communications, payment processing, website hosting, analytics,
              scheduling, or other business services. These providers may
              process information as necessary to provide their services.
            </p>
          </section>

          <section className="policy-section">
            <h2>Children's Privacy</h2>
            <p>
              Our website and transportation services are not directed toward
              children under the age of 13. We do not knowingly collect personal
              information directly from children under 13.
            </p>
          </section>

          <section className="policy-section">
            <h2>Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes
              will be posted on this page with an updated effective date.
            </p>
          </section>

          <section className="policy-section">
            <h2>Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or how your
              information is handled, please contact:
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
