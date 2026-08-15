import { Routes, Route } from "react-router-dom";
import ProductDetailPage from "./pages/products/ProductDetailPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/products/ProductsPage";
import AddProductPage from "./pages/products/AddProductPage";
import ProtectedRoute from "./components/ProtectedRoute";
import EditProductPage from "./pages/products/EditProductPage";
import SuppliersPage from "./pages/suppliers/SuppliersPage";
import AddSupplierPage from "./pages/suppliers/AddSupplierPage";
import EditSupplierPage from "./pages/suppliers/EditSupplierPage";
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
<Route
  path="/suppliers"
  element={
    <ProtectedRoute>
      <SuppliersPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/suppliers/new"
  element={
    <ProtectedRoute>
      <AddSupplierPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/suppliers/:id/edit"
  element={
    <ProtectedRoute>
      <EditSupplierPage />
    </ProtectedRoute>
  }
/>
    </Routes>
  );
};

export default App;