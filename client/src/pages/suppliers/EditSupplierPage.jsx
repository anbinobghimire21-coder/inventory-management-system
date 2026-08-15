import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";

const EditSupplierPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    contactEmail: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    api
      .get(`/suppliers/${id}`)
      .then((response) => {
        if (!active) return;

        const supplier = response.data.data;

        setFormData({
          name: supplier.name,
          contactEmail: supplier.contactEmail,
          phone: supplier.phone,
        });
      })
      .catch((error) => {
        if (active) {
          setError(
            error.response?.data?.message ||
              "Unable to load supplier."
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
  }, [id]);

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

      await api.put(`/suppliers/${id}`, formData);

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
            "Unable to update supplier."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-shell">
        <section className="products-panel">
          <p>Loading supplier...</p>
        </section>
      </div>
    );
  }

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

          <h1>Edit Supplier</h1>

          <p>
            Update supplier contact information.
          </p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

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
              required
            />
          </div>

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
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default EditSupplierPage;