import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [suppliers, setSuppliers] = useState([]);
  const [existingImage, setExistingImage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    supplierId: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    Promise.all([
      api.get(`/products/${id}`),
      api.get("/suppliers"),
    ])
      .then(([productResponse, supplierResponse]) => {
        if (!active) return;

        const product = productResponse.data.data;

        setFormData({
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: product.quantity,
          supplierId: product.supplierId,
        });

        setExistingImage(product.imagePath);
        setSuppliers(supplierResponse.data.data);
      })
      .catch((error) => {
        if (active) {
          setError(
            error.response?.data?.message ||
              "Unable to load product."
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
      !formData.name ||
      !formData.description ||
      formData.price === "" ||
      formData.quantity === "" ||
      !formData.supplierId
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (Number(formData.price) < 0) {
      setError("Price cannot be negative.");
      return;
    }

    if (Number(formData.quantity) < 0) {
      setError("Quantity cannot be negative.");
      return;
    }

    const data = new FormData();

    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("quantity", formData.quantity);
    data.append("supplierId", formData.supplierId);

    if (image) {
      data.append("image", image);
    }

    try {
      setSaving(true);

      await api.put(`/products/${id}`, data);

      navigate(`/products/${id}`);
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
            "Unable to update product."
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
          <p>Loading product...</p>
        </section>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <section className="products-panel form-panel">
        <div className="form-top">
          <Link
            to={`/products/${id}`}
            className="back-link"
          >
            ← Back to product
          </Link>

          <span className="brand dark">
            Stockly
          </span>
        </div>

        <div className="form-heading">
          <p className="section-label">
            Inventory
          </p>

          <h1>Edit Product</h1>

          <p>
            Update product information, stock or image.
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
          <div className="form-group">
            <label htmlFor="name">
              Product name
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

          <div className="form-group full-width">
            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">
              Price
            </label>

            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantity">
              Quantity
            </label>

            <input
              id="quantity"
              name="quantity"
              type="number"
              min="0"
              step="1"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="supplierId">
              Supplier
            </label>

            <select
              id="supplierId"
              name="supplierId"
              value={formData.supplierId}
              onChange={handleChange}
              required
            >
              <option value="">
                Select supplier
              </option>

              {suppliers.map((supplier) => (
                <option
                  key={supplier.id}
                  value={supplier.id}
                >
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="image">
              Replace image
            </label>

            <input
              id="image"
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={(event) =>
                setImage(event.target.files[0] || null)
              }
            />

            <span className="file-name">
              Leave empty to keep the current image.
            </span>
          </div>

          {existingImage && (
            <div className="current-image full-width">
              <p>Current image</p>

              <img
                src={`http://localhost:5001/${existingImage}`}
                alt="Current product"
              />
            </div>
          )}

          <div className="form-actions full-width">
            <Link
              to={`/products/${id}`}
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

export default EditProductPage;