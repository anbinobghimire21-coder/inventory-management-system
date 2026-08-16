import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import useAuth from "../context/useAuth";

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(username, password);
      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to log in."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-shell">

        {/* LEFT SIDE */}
        <section className="login-visual">
          <div className="login-brand">
            Stockly
          </div>

          <div className="login-visual-content">
            <p className="login-eyebrow">
              INVENTORY MANAGEMENT
            </p>

            <h1>
              Manage stock.
              <span>Stay in control.</span>
            </h1>

            <p className="login-description">
              Keep your products, suppliers and
              stock levels organised from one
              simple workspace.
            </p>
          </div>

          <div className="login-feature-card">
            <p>YOUR WORKSPACE</p>

            <div className="login-feature-row">
              <span>Products</span>
              <strong>Manage →</strong>
            </div>

            <div className="login-feature-row">
              <span>Suppliers</span>
              <strong>Organise →</strong>
            </div>

            <div className="login-feature-row">
              <span>Low Stock</span>
              <strong>Monitor →</strong>
            </div>
          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="login-form-side">
          <div className="login-form-container">

            <p className="login-form-label">
              ADMIN ACCESS
            </p>

            <h2>Welcome back.</h2>

            <p className="login-form-description">
              Sign in to continue to your
              Stockly inventory dashboard.
            </p>

            <form
              className="login-form"
              onSubmit={handleSubmit}
            >
              <div className="login-field">
                <label htmlFor="username">
                  Username
                </label>

                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(event) =>
                    setUsername(event.target.value)
                  }
                  autoComplete="username"
                  required
                />
              </div>

              <div className="login-field">
                <label htmlFor="password">
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  autoComplete="current-password"
                  required
                />
              </div>

              {error && (
                <div className="login-error">
                  {error}
                </div>
              )}

              <button
                className="login-button"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Signing in..."
                  : "Sign in to Stockly"}
              </button>
            </form>

            <p className="login-security-text">
              Secure administrator access
            </p>
          </div>
        </section>

      </div>
    </main>
  );
};

export default LoginPage;