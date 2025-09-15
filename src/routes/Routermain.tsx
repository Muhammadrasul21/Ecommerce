import { lazy } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { SuspenseContainer } from "../utils";
import RequireAuth from "../components/RequireAuth";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Unauthorized from "../pages/Unauthorized";

const Admin = lazy(() => import("../pages/admin/Admin"));
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const Products = lazy(() => import("../pages/admin/Products"));
const Cart = lazy(() => import("../pages/admin/Cart"));
const Profile = lazy(() => import("../pages/admin/Profile"));
const Orders = lazy(() => import("../pages/admin/Orders"));
const OrderDetail = lazy(() => import("../pages/admin/OrderDetail"));
const OrdersNew = lazy(() => import("../components/OrdersNew"));
const AddProduct = lazy(() => import("../components/AddProduct"));
const EditProduct = lazy(() => import("../components/EditProduct"));
const ProductDetail = lazy(() => import("../components/ProductDetail"));

const Routermain = () => {
  return (
    <Routes>
      <Route
        path="/admin"
        element={
          <RequireAuth allowRoles={["admin", "user"]}>
            <SuspenseContainer>
              <Admin />
            </SuspenseContainer>
          </RequireAuth>
        }
      >
        <Route
          index
          element={
            <SuspenseContainer>
              <Dashboard />
            </SuspenseContainer>
          }
        />
        <Route
          path="products"
          element={
            <SuspenseContainer>
              <Products />
            </SuspenseContainer>
          }
        />
        <Route
          path="cart"
          element={
            <SuspenseContainer>
              <Cart />
            </SuspenseContainer>
          }
        />
        <Route
          path="addproducts"
          element={
            <RequireAuth allowRoles={["admin"]}>
              <SuspenseContainer>
                <AddProduct />
              </SuspenseContainer>
            </RequireAuth>
          }
        />
        <Route
          path="editproduct/:id"
          element={
            <RequireAuth allowRoles={["admin"]}>
              <SuspenseContainer>
                <EditProduct />
              </SuspenseContainer>
            </RequireAuth>
          }
        />
        <Route
          path="productdetail/:id"
          element={
            <SuspenseContainer>
              <ProductDetail />
            </SuspenseContainer>
          }
        />
        <Route
          path="orders"
          element={
            <SuspenseContainer>
              <Orders />
            </SuspenseContainer>
          }
        />
        <Route
          path="order-detail/:id"
          element={
            <SuspenseContainer>
              <OrderDetail />
            </SuspenseContainer>
          }
        />
        <Route
          path="ordersnew"
          element={
            <RequireAuth allowRoles={["admin"]}>
              <SuspenseContainer>
                <OrdersNew />
              </SuspenseContainer>
            </RequireAuth>
          }
        />
        <Route
          path="profile"
          element={
            <SuspenseContainer>
              <Profile />
            </SuspenseContainer>
          }
        />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default Routermain;
