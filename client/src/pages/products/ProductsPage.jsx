import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api, {
  serverBaseUrl,
} from "../../api/api";

const ProductsPage = () => {
  const [searchParams] = useSearchParams();

const lowStockOnly =
  searchParams.get("lowStock") === "true";
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  let active = true;

  api
    .get("/suppliers")
    .then((response) => {
      if (active) {
        setSuppliers(response.data.data);
      }
    })
    .catch(() => {
      if (active) {
        setError("Unable to load suppliers.");
      }
    });

  return () => {
    active = false;
  };
}, []);

useEffect(() => {
  const timer = setTimeout(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const params = {};

        if (search) {
          params.search = search;
        }

        if (supplierId) {
          params.supplierId = supplierId;
        }

     const response = await api.get("/products", {
  params,
});

const productData = response.data.data;

if (lowStockOnly) {
  setProducts(
    productData.filter(
      (product) => product.quantity < 5
    )
  );
} else {
  setProducts(productData);
}
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load products."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, 300);

  return () => clearTimeout(timer);
}, [search, supplierId, lowStockOnly]);
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
              Inventory
            </p>

            <h1>Products</h1>

            <p>
              Manage products, stock levels and suppliers.
            </p>
          </div>
<Link
  to="/products/new"
  className="dark-button"
>
  + Add Product
</Link>
          
        </div>

        <div className="filter-bar">
          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          <select
            value={supplierId}
            onChange={(event) =>
              setSupplierId(event.target.value)
            }
          >
            <option value="">
              All suppliers
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
        {lowStockOnly && (
  <div className="low-stock-filter">
    <span>Showing products below 5 units</span>

    <Link to="/products">
      Show all products
    </Link>
  </div>
)}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => {
              const lowStock = product.quantity < 5;

              return (
                <article
                  className="product-card"
                  key={product.id}
                >
                  <div className="product-image-wrap">
                   <img
  src={`${serverBaseUrl}/${product.imagePath}`}
  alt={product.name}
/>

                    {lowStock && (
                      <span className="low-stock">
                        Low stock
                      </span>
                    )}
                  </div>

                  <div className="product-info">
                    <div>
                      <p className="supplier-name">
                        {product.supplier?.name}
                      </p>

                      <h3>{product.name}</h3>
                    </div>

                    <p className="product-description">
                      {product.description}
                    </p>

                    <div className="product-meta">
                      <span>
                        Rs. {product.price}
                      </span>

                      <span
                        className={
                          lowStock
                            ? "quantity danger"
                            : "quantity"
                        }
                      >
                        {product.quantity} in stock
                      </span>
                    </div>

                    <Link
  to={`/products/${product.id}`}
  className="card-button product-view-link"
>
  View Product
</Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductsPage;