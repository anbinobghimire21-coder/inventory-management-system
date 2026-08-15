import { Routes, Route } from "react-router-dom";
import ProductDetailPage from "./pages/products/ProductDetailPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/products/ProductsPage";
import AddProductPage from "./pages/products/AddProductPage";
import ProtectedRoute from "./components/ProtectedRoute";
import EditProductPage from "./pages/products/EditProductPage";

const App = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <ProductsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/products/new"
        element={
          <ProtectedRoute>
            <AddProductPage />
          </ProtectedRoute>
        }
      />
      <Route
  path="/products/:id"
  element={
    <ProtectedRoute>
      <ProductDetailPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/products/:id/edit"
  element={
    <ProtectedRoute>
      <EditProductPage />
    </ProtectedRoute>
  }
/>
    </Routes>
  );
};

export default App;