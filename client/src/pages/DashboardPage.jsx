import { Link } from "react-router-dom";
import useAuth from "../context/useAuth";

const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="page-shell">
      <section className="hero-panel">
        <nav className="top-nav">
          <div className="brand">
            Stockly
          </div>

          <div className="nav-links">
            <Link to="/">Overview</Link>
            <Link to="/products">Products</Link>
            <Link to="/suppliers">Suppliers</Link>
          </div>

          <button
            className="outline-button"
            onClick={logout}
          >
            Logout
          </button>
        </nav>

        <div className="hero-content">
          <p className="eyebrow">
            Inventory Management
          </p>

          <h1>
            Manage More With
            <span>Your Inventory</span>
          </h1>

          <p className="hero-description">
            Keep products, suppliers and stock levels
            organised from one simple dashboard.
          </p>

          <div className="hero-actions">
            <Link
              to="/products"
              className="primary-button"
            >
              View Products
            </Link>

            <span className="admin-text">
              Signed in as {user?.username}
            </span>
          </div>
        </div>

        <div className="hero-product-preview">
          <div className="preview-badge">
            Live Inventory
          </div>

          <strong>USB-C Charging Cable</strong>
          <span>4 units remaining</span>
        </div>
      </section>

      <section className="quick-section">
        <div>
          <p className="section-label">
            Workspace
          </p>

          <h2>
            Everything you need,
            without the clutter.
          </h2>
        </div>

        <div className="quick-grid">
          <Link
            to="/products"
            className="quick-card"
          >
            <span>01</span>
            <h3>Products</h3>
            <p>
              Search, filter and manage your inventory.
            </p>
          </Link>

          <Link
  to="/suppliers"
  className="quick-card"
>
  <span>02</span>
  <h3>Suppliers</h3>
  <p>
    Keep supplier contact information organised.
  </p>
</Link>

      <Link
  to="/products?lowStock=true"
  className="quick-card"
>
  <span>03</span>
  <h3>Low Stock</h3>
  <p>
    Quickly identify products below five units.
  </p>
</Link>    
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;