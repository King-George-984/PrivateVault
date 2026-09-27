import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [lastSync, setLastSync] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState("CONNECTING");
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      setApiStatus("CONNECTING");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      setUsers(data);
      setLastSync(new Date());
      setApiStatus("200 OK");
    } catch (err) {
      console.error("API connection failed:", err);

      setUsers([]);
      setApiStatus("OFFLINE");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const refreshData = () => {
    fetchUsers();
  };

  return (
    <div className="app">

      {/* NAVBAR */}
      <header className="navbar">
        <div className="brand">
          <div className="brand-icon">🔐</div>

          <div>
            <h1>PrivateVault</h1>
            <span>Secure Serverless Access</span>
          </div>
        </div>

        <div className="system-status">
          <span className="status-dot"></span>
          System Secure
        </div>
      </header>


      {/* MAIN CONTENT */}
      <main className="container">

        {/* HERO */}
        <section className="hero">
          <div>
            <p className="eyebrow">
              AZURE SERVERLESS SECURITY
            </p>

            <h2>
              Private access.
              <br />
              Zero public database exposure.
            </h2>

            <p className="hero-text">
              A secure serverless architecture using Azure Functions,
              VNet Integration, Private Endpoints and Azure SQL.
            </p>
          </div>

          <div className="shield">
            🛡️
          </div>
        </section>


        {/* STAT CARDS */}
        <section className="stats">

          <div className="stat-card">
            <span className="stat-icon">👥</span>

            <div>
              <p>Total Users</p>
              <strong>
                {loading ? "—" : users.length}
              </strong>
            </div>
          </div>


          <div className="stat-card">
            <span className="stat-icon">🔒</span>

            <div>
              <p>Database</p>
              <strong>PRIVATE</strong>
            </div>
          </div>


          <div className="stat-card">
            <span className="stat-icon">✓</span>

            <div>
              <p>API Status</p>

              <strong
                className={
                  apiStatus === "200 OK"
                    ? "status-success"
                    : apiStatus === "OFFLINE"
                      ? "status-error"
                      : ""
                }
              >
                {apiStatus}
              </strong>
            </div>
          </div>


          <div className="stat-card">
            <span className="stat-icon">☁️</span>

            <div>
              <p>Platform</p>
              <strong>AZURE</strong>
            </div>
          </div>

        </section>


        {/* MAIN GRID */}
        <section className="content-grid">

          {/* USERS */}
          <div className="panel users-panel">

            <div className="panel-header">

              <div>
                <p className="section-label">
                  DATABASE
                </p>

                <h3>Users</h3>
              </div>

              <button
                onClick={refreshData}
                disabled={loading}
              >
                {loading ? "Loading..." : "↻ Refresh"}
              </button>

            </div>


            <div className="table-wrapper">

              <table>

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                  </tr>
                </thead>


                <tbody>

                  {loading ? (

                    <tr>
                      <td
                        colSpan="4"
                        className="loading"
                      >
                        Connecting to Azure Function...
                      </td>
                    </tr>

                  ) : error ? (

                    <tr>
                      <td
                        colSpan="4"
                        className="loading"
                      >
                        API Error: {error}
                      </td>
                    </tr>

                  ) : users.length === 0 ? (

                    <tr>
                      <td
                        colSpan="4"
                        className="loading"
                      >
                        No users found.
                      </td>
                    </tr>

                  ) : (

                    users.map((user) => (

                      <tr key={user.id}>

                        <td>
                          #{String(user.id).padStart(2, "0")}
                        </td>

                        <td className="user-name">
                          {user.name}
                        </td>

                        <td>
                          {user.email}
                        </td>

                        <td>
                          <span className="active-badge">
                            ● Active
                          </span>
                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>


            <div className="sync">

              {lastSync
                ? `Last synchronized: ${lastSync.toLocaleTimeString()}`
                : "Waiting for synchronization..."}

            </div>

          </div>


          {/* SECURITY PANEL */}
          <div className="panel security-panel">

            <div className="panel-header">

              <div>
                <p className="section-label">
                  SECURITY
                </p>

                <h3>
                  Architecture Status
                </h3>
              </div>

            </div>


            <div className="security-item">

              <span className="check">
                ✓
              </span>

              <div>
                <strong>
                  VNet Integration
                </strong>

                <p>
                  Connected
                </p>
              </div>

            </div>


            <div className="security-item">

              <span className="check">
                ✓
              </span>

              <div>
                <strong>
                  Function Private Endpoint
                </strong>

                <p>
                  Approved
                </p>
              </div>

            </div>


            <div className="security-item">

              <span className="check">
                ✓
              </span>

              <div>
                <strong>
                  SQL Private Endpoint
                </strong>

                <p>
                  Approved
                </p>
              </div>

            </div>


            <div className="security-item">

              <span className="check">
                ✓
              </span>

              <div>
                <strong>
                  Public SQL Access
                </strong>

                <p>
                  Disabled
                </p>
              </div>

            </div>


            <div className="security-item">

              <span className="check">
                ✓
              </span>

              <div>
                <strong>
                  Private DNS
                </strong>

                <p>
                  Connected
                </p>
              </div>

            </div>

          </div>

        </section>


        {/* ARCHITECTURE */}
        <section className="architecture">

          <div className="panel">

            <p className="section-label">
              NETWORK FLOW
            </p>

            <h3>
              Private Data Path
            </h3>


            <div className="flow">

              <div className="flow-node">

                <span>🌐</span>

                <strong>
                  Client
                </strong>

                <small>
                  Private Network
                </small>

              </div>


              <div className="arrow">
                →
              </div>


              <div className="flow-node">

                <span>⚡</span>

                <strong>
                  Azure Function
                </strong>

                <small>
                  Flex Consumption
                </small>

              </div>


              <div className="arrow">
                →
              </div>


              <div className="flow-node">

                <span>🔗</span>

                <strong>
                  VNet
                </strong>

                <small>
                  10.0.0.0/16
                </small>

              </div>


              <div className="arrow">
                →
              </div>


              <div className="flow-node">

                <span>🗄️</span>

                <strong>
                  Azure SQL
                </strong>

                <small>
                  Private Endpoint
                </small>

              </div>

            </div>

          </div>

        </section>

      </main>


      {/* FOOTER */}
      <footer>

        <span>
          PrivateVault
        </span>

        <span>
          Built with Azure • Secure by Design
        </span>

      </footer>

    </div>
  );
}

export default App;