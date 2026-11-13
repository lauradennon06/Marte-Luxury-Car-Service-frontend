import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import "../styles/SaveCard.css";

const API = import.meta.env.VITE_API;

const SQUARE_SCRIPT = {
  sandbox: "https://sandbox.web.squarecdn.com/v1/square.js",
  production: "https://web.squarecdn.com/v1/square.js",
};

function loadSquareScript(environment) {
  const src = SQUARE_SCRIPT[environment] ?? SQUARE_SCRIPT.sandbox;
  return new Promise((resolve, reject) => {
    if (window.Square) return resolve();
    const existing = document.querySelector(`script[src="${src}"]`);
    const script = existing ?? document.createElement("script");
    script.addEventListener("load", () => resolve());
    script.addEventListener("error", () =>
      reject(new Error("Unable to load the secure card form.")),
    );
    if (!existing) {
      script.src = src;
      document.head.appendChild(script);
    }
  });
}

export default function SaveCard() {
  const { token } = useParams();
  const [session, setSession] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [formReady, setFormReady] = useState(false);
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [saved, setSaved] = useState(null);
  const cardRef = useRef(null);
  const paymentsRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API}/payments/card-session/${token}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Unable to load this page.");
        if (!cancelled) setSession(json.data);
      } catch (err) {
        if (!cancelled) setLoadError(err.message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const showForm = session && !session.alreadySaved && !saved;

  useEffect(() => {
    if (!showForm) return;
    let cancelled = false;
    let card;

    (async () => {
      try {
        const { applicationId, locationId, environment } = session.square;
        await loadSquareScript(environment);
        if (cancelled) return;
        const payments = window.Square.payments(applicationId, locationId);
        card = await payments.card();
        if (cancelled) {
          card.destroy();
          return;
        }
        await card.attach("#card-container");
        paymentsRef.current = payments;
        cardRef.current = card;
        setFormReady(true);
      } catch (err) {
        if (!cancelled) setLoadError(err.message || "Unable to load the card form.");
      }
    })();

    return () => {
      cancelled = true;
      setFormReady(false);
      if (card) card.destroy();
      cardRef.current = null;
    };
  }, [showForm, session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consent || !cardRef.current) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const tokenResult = await cardRef.current.tokenize();
      if (tokenResult.status !== "OK") {
        console.error("Square tokenize errors:", tokenResult.errors);
        throw new Error(
          tokenResult.errors?.[0]?.message || "Please check your card details.",
        );
      }

      const verification = await paymentsRef.current.verifyBuyer(
        tokenResult.token,
        {
          intent: "STORE",
          customerInitiated: true,
          sellerKeyedIn: false,
          billingContact: {
            givenName: session.ride.first_name,
            familyName: session.ride.last_name,
          },
        },
      );

      const res = await fetch(`${API}/payments/save-card`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          sourceId: tokenResult.token,
          verificationToken: verification?.token,
          consent: true,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "We couldn't save your card.");
      setSaved(json.data);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadError) {
    return (
      <section className="save-card">
        <div className="save-card-container">
          <h1>Save Your Card</h1>
          <p className="save-card-error">{loadError}</p>
        </div>
      </section>
    );
  }

  if (!session) {
    return (
      <section className="save-card">
        <div className="save-card-container">
          <h1>Save Your Card</h1>
          <p>Loading…</p>
        </div>
      </section>
    );
  }

  const { ride } = session;
  const pickupDate = new Date(ride.pickup_date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  if (session.alreadySaved || saved) {
    return (
      <section className="save-card">
        <div className="save-card-container">
          <h1>Card Saved</h1>
          <p>
            Thank you, {ride.first_name}.{" "}
            {saved
              ? `Your ${saved.brand} card ending in ${saved.last4} is now on file. `
              : "A card is already on file for this ride. "}
            You have not been charged. We will review your booking and text you
            once it is confirmed.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="save-card">
      <div className="save-card-container">
        <h1>Save Your Card</h1>
        <p className="save-card-intro">
          Hi {ride.first_name}, please save a card on file to accept your quote
          from Marte Luxury Car Service.
        </p>

        <div className="save-card-summary">
          <div>
            <span>From</span> {ride.pickup_location}
          </div>
          <div>
            <span>To</span> {ride.dropoff_location}
          </div>
          <div>
            <span>When</span> {pickupDate} at {ride.pickup_time}
          </div>
          <div className="save-card-total">
            <span>Quoted total</span> ${ride.total_cost}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div id="card-container" className="save-card-field" />

          <label className="save-card-consent">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            <span>
              I authorize Marte Luxury Car Service LLC to securely save this
              card on file with Square and to charge it for the agreed fare of
              ${ride.total_cost} for this ride, in accordance with the{" "}
              <Link to="/terms" target="_blank">
                Terms of Service
              </Link>
              . My card will not be charged when I save it.
            </span>
          </label>

          {submitError && <p className="save-card-error">{submitError}</p>}

          <button
            type="submit"
            className="save-card-button"
            disabled={!consent || !formReady || submitting}
          >
            {submitting ? "Saving…" : "Save Card & Accept Quote"}
          </button>
        </form>

        <p className="save-card-note">
          Your card details are entered into Square&apos;s secure form and are never
          stored on our servers. Please never text your card details.
        </p>
      </div>
    </section>
  );
}
