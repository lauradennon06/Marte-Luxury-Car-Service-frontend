import "../styles/Contact.css";

export default function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="contact-container">
        <div className="contact-box">
          <h2 className="contact-intro">Contact Us</h2>
          <p className="contact-availability">
            Available 24 hours a day, 7 days a week for your transportation
            needs
          </p>
          <div className="contact-methods-wrapper">
            <div className="contact-method">
              <a href="tel:9149065308" className="contact-link">
                (914) 906-5308
              </a>
            </div>
            <div className="contact-divider"></div>
            <div className="contact-method">
              <a
                href="mailto:info@martecarservice.com"
                className="contact-link"
              >
                info@martecarservice.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
