import { lazy } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { SuspenseContainer } from "../utils";

const Admin = lazy(() => import("../pages/admin/Admin"));
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const Products = lazy(() => import("../pages/admin/Products"));
const Profile = lazy(() => import("../pages/admin/Profile"));
const Orders = lazy(() => import("../pages/admin/Orders"));
const OrdersNew = lazy(() => import("../components/OrdersNew"));

const Routermain = () => {
  return (
    <Routes>
      <Route
        path="/admin"
        element={
          <SuspenseContainer>
            <Admin />
          </SuspenseContainer>
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
          path="orders"
          element={
            <SuspenseContainer>
              <Orders />
            </SuspenseContainer>
          }
        />
        <Route
          path="ordersnew"
          element={
            <SuspenseContainer>
              <OrdersNew />
            </SuspenseContainer>
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

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default Routermain;
