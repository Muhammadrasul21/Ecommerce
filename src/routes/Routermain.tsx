import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { SuspenseContainer } from "../utils";

const Admin = lazy(() => import("../pages/admin/Admin"));
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const Products = lazy(() => import("../pages/admin/Products"));
const Profile = lazy(() => import("../pages/admin/Profile"));
const Orders = lazy(() => import("../pages/admin/Orders"));

const Routermain = () => {
  return (
    <Routes>
      <Route
        path="/"
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
          path="create"
          element={
            <SuspenseContainer>
              <Orders />
            </SuspenseContainer>
          }
        />
        <Route
          path="buy"
          element={
            <SuspenseContainer>
              <Profile />
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
        <Route
          path="orders"
          element={
            <SuspenseContainer>
              <Orders />
            </SuspenseContainer>
          }
        />
      </Route>
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
          path="create"
          element={
            <SuspenseContainer>
              <Orders />
            </SuspenseContainer>
          }
        />
        <Route
          path="buy"
          element={
            <SuspenseContainer>
              <Profile />
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
        <Route
          path="orders"
          element={
            <SuspenseContainer>
              <Orders />
            </SuspenseContainer>
          }
        />
      </Route>
    </Routes>
  );
};

export default Routermain;
