import { Route, Routes } from "react-router";
import Layout from "./layout/Layout";
import HomePage from "./pages/HomePage";
import RideRequestForm from "./pages/RideRequestForm";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Login from "./auth/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ViewRidesByPhone from "./pages/ViewRidesByPhone";
import SaveCard from "./pages/SaveCard";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          index
          element={
            <>
              <HomePage />
              <RideRequestForm />
              <Contact />
            </>
          }
        />
        <Route path="/view-rides" element={<ViewRidesByPhone />} />
        <Route path="/save-card/:token" element={<SaveCard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}
