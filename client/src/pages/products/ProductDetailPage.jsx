import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;

    api
      .get(`/products/${id}`)
      .then((response) => {
        if (active) {
          setProduct(response.data.data);
        }
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

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await api.delete(`/products/${id}`);

      navigate("/products");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to delete product."
      );

      setDeleting(false);
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

  if (error && !product) {
    return (
      <div className="page-shell">
        <section className="products-panel">
          <div className="error-message">
            {error}
          </div>

          <Link to="/products" className="back-link">
            ← Back to products
          </Link>
        </section>
      </div>
    );
  }

  const lowStock = product.quantity < 5;

  return (
    <div className="page-shell">
      <section className="products-panel detail-panel">
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

        {error && (
          <div className="error-message detail-error">
            {error}
          </div>
        )}

        <div className="product-detail-grid">
          <div className="detail-image-wrap">
            <img
              src={`http://localhost:5001/${product.imagePath}`}
              alt={product.name}
            />

            {lowStock && (
              <span className="low-stock">
                Low stock
              </span>
            )}
          </div>

          <div className="detail-content">
            <p className="section-label">
              Product Details
            </p>

            <p className="supplier-name">
              {product.supplier?.name}
            </p>

            <h1>{product.name}</h1>

            <p className="detail-description">
              {product.description}
            </p>

            <div className="detail-stats">
              <div>
                <span>Price</span>
                <strong>
                  Rs. {product.price}
                </strong>
              </div>

              <div>
                <span>Stock</span>
                <strong
                  className={
                    lowStock ? "danger-text" : ""
                  }
                >
                  {product.quantity} units
                </strong>
              </div>
            </div>

            <div className="supplier-box">
              <span>Supplier</span>

              <strong>
                {product.supplier?.name}
              </strong>

              <p>
                {product.supplier?.contactEmail}
              </p>

              <p>
                {product.supplier?.phone}
              </p>
            </div>

            <div className="detail-actions">
              <Link
                to={`/products/${product.id}/edit`}
                className="dark-button"
              >
                Edit Product
              </Link>

              <button
                type="button"
                className="delete-button"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting
                  ? "Deleting..."
                  : "Delete Product"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailPage;