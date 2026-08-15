import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/suppliers");

      setSuppliers(response.data.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load suppliers."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    api
      .get("/suppliers")
      .then((response) => {
        if (active) {
          setSuppliers(response.data.data);
        }
      })
      .catch((error) => {
        if (active) {
          setError(
            error.response?.data?.message ||
              "Unable to load suppliers."
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const handleDelete = async (supplier) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${supplier.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(`/suppliers/${supplier.id}`);

      await loadSuppliers();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to delete supplier."
      );
    }
  };

  return (
    <div className="page-shell">
      <section className="products-panel">
        <nav className="products-nav">
          <Link to="/" className="brand dark">
            Stockly
          </Link>

          <div className="nav-links dark-links">
            <Link to="/">Overview</Link>
            <Link to="/products">Products</Link>
            <Link to="/suppliers">Suppliers</Link>
          </div>
        </nav>

        <div className="products-heading">
          <div>
            <p className="section-label">
              Inventory Network
            </p>

            <h1>Suppliers</h1>

            <p>
              Manage the companies and contacts that
              supply your inventory.
            </p>
          </div>

          <Link
            to="/suppliers/new"
            className="dark-button"
          >
            + Add Supplier
          </Link>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading ? (
          <p>Loading suppliers...</p>
        ) : suppliers.length === 0 ? (
          <div className="empty-state">
            <h3>No suppliers found</h3>
            <p>
              Add your first supplier to get started.
            </p>
          </div>
        ) : (
          <div className="supplier-grid">
            {suppliers.map((supplier) => (
              <article
                className="supplier-card"
                key={supplier.id}
              >
                <div className="supplier-card-top">
                  <span className="supplier-number">
                    Supplier {supplier.id}
                  </span>

                  <span className="supplier-dot" />
                </div>

                <h2>{supplier.name}</h2>

                <div className="supplier-contact">
                  <div>
                    <span>Email</span>
                    <p>{supplier.contactEmail}</p>
                  </div>

                  <div>
                    <span>Phone</span>
                    <p>{supplier.phone}</p>
                  </div>
                </div>

                <div className="supplier-actions">
                  <Link
                    to={`/suppliers/${supplier.id}/edit`}
                    className="card-button supplier-edit"
                  >
                    Edit
                  </Link>

                  <button
                    type="button"
                    className="supplier-delete"
                    onClick={() =>
                      handleDelete(supplier)
                    }
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default SuppliersPage;