import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";

const AddProductPage = () => {
  const navigate = useNavigate();

  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    supplierId: "",
  });

  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const response = await api.get("/suppliers");
        setSuppliers(response.data.data);
      } catch {
        setError("Unable to load suppliers.");
      }
    };

    loadSuppliers();
  }, []);

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
      !formData.price ||
      !formData.quantity ||
      !formData.supplierId ||
      !image
    ) {
      setError("Please complete all fields and select an image.");
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
    data.append("image", image);

    try {
      setLoading(true);

      await api.post("/products", data);

      navigate("/products");
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
            "Unable to create product."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <section className="products-panel form-panel">
        <div className="form-top">
          <Link
            to="/products"
            className="back-link"
          >
            ← Back to products
          </Link>

          <span className="brand dark">
            Stockly
          </span>
        </div>

        <div className="form-heading">
          <p className="section-label">
            Inventory
          </p>

          <h1>Add Product</h1>

          <p>
            Add a new product to your inventory.
          </p>
        </div>

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
              placeholder="e.g. Wireless Mouse"
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
              placeholder="Describe the product..."
              rows="5"
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
              placeholder="0.00"
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
              placeholder="0"
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
              Product image
            </label>

            <input
              id="image"
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={(event) =>
                setImage(event.target.files[0])
              }
            />

            {image && (
              <span className="file-name">
                {image.name}
              </span>
            )}
          </div>

          {error && (
            <div className="error-message full-width">
              {error}
            </div>
          )}

          <div className="form-actions full-width">
            <Link
              to="/products"
              className="cancel-button"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="dark-button"
              disabled={loading}
            >
              {loading
                ? "Adding Product..."
                : "Add Product"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AddProductPage;