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
    <div>
      <h1>Inventory Management System</h1>
      <h2>Admin Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">
            Username
          </label>

          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) =>
              setUsername(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
          />
        </div>

        {error && <p>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;