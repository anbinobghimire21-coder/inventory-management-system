import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";

const AddSupplierPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    contactEmail: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (
      !formData.name.trim() ||
      !formData.contactEmail.trim() ||
      !formData.phone.trim()
    ) {
      setError("Please complete all fields.");
      return;
    }

    try {
      setSaving(true);

      await api.post("/suppliers", formData);

      navigate("/suppliers");
    } catch (error) {
      const response = error.response?.data;

      if (response?.errors?.length) {
        setError(
          response.errors
            .map((item) => item.message)
            .join(" ")
        );
      } else {
        setError(
          response?.message ||
            "Unable to create supplier."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-shell">
      <section className="products-panel form-panel">
        <div className="form-top">
          <Link
            to="/suppliers"
            className="back-link"
          >
            ← Back to suppliers
          </Link>

          <span className="brand dark">
            Stockly
          </span>
        </div>

        <div className="form-heading">
          <p className="section-label">
            Inventory Network
          </p>

          <h1>Add Supplier</h1>

          <p>
            Add a new supplier to your inventory network.
          </p>
        </div>

        <form
          className="product-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group full-width">
            <label htmlFor="name">
              Supplier name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Himalayan Electronics"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contactEmail">
              Contact email
            </label>

            <input
              id="contactEmail"
              name="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={handleChange}
              placeholder="supplier@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              Phone number
            </label>

            <input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9800000000"
              required
            />
          </div>

          {error && (
            <div className="error-message full-width">
              {error}
            </div>
          )}

          <div className="form-actions full-width">
            <Link
              to="/suppliers"
              className="cancel-button"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="dark-button"
              disabled={saving}
            >
              {saving
                ? "Adding Supplier..."
                : "Add Supplier"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AddSupplierPage;