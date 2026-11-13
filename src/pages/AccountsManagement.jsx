import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router";
import "../styles/AccountsManagement.css";

const API = import.meta.env.VITE_API;

export default function AccountsManagement() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Redirect if not admin
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!token) return;

    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch accounts");
        }

        const data = await response.json();
        setAccounts(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [token]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="accounts-management">
      <div className="accounts-container">
        <div className="accounts-header">
          <h1>Accounts Management</h1>
          <button className="back-btn" onClick={() => navigate("/admin")}>
            Back to Dashboard
          </button>
        </div>

        {loading && <div className="loading">Loading accounts...</div>}
        {error && <div className="error">{error}</div>}

        {!loading && accounts.length === 0 && (
          <div className="no-accounts">No accounts found</div>
        )}

        {!loading && accounts.length > 0 && (
          <div className="accounts-table-wrapper">
            <table className="accounts-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Account Type</th>
                  <th>Company Name</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.id}>
                    <td>{account.username}</td>
                    <td>{account.email}</td>
                    <td>{account.phone_number || "-"}</td>
                    <td>
                      <span className={`account-type ${account.account_type}`}>
                        {account.account_type}
                      </span>
                    </td>
                    <td>{account.company_name || "-"}</td>
                    <td>{formatDate(account.created_at)}</td>
                    <td>
                      <button
                        className="view-btn"
                        onClick={() =>
                          navigate(`/admin/accounts/${account.id}`)
                        }
                      >
                        View Rides
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
