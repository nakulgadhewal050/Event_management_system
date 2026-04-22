import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Index from './pages/Index.jsx'
import Login from './pages/Login.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import MembershipManagement from './pages/admin/MembershipManagement.jsx'
import UserManagement from './pages/admin/UserManagement.jsx'
import Cart from './pages/user/Cart.jsx'
import GuestList from './pages/user/GuestList.jsx'
import OrderStatus from './pages/user/OrderStatus.jsx'
import Payment from './pages/user/Payment.jsx'
import UserDashboard from './pages/user/UserDashboard.jsx'
import VendorList from './pages/user/VendorList.jsx'
import ProductStatus from './pages/vendor/ProductStatus.jsx'
import RequestItem from './pages/vendor/VendorRequestItem.jsx'
import VendorDashboard from './pages/vendor/VendorDashboard.jsx'
import VendorSignup from './pages/vendor/VendorSignup.jsx'
import ViewProduct from './pages/vendor/ViewProduct.jsx'
import UserSignup from './pages/user/UserSignup.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/vendor/signup" element={<VendorSignup />} />
        <Route path="/user/signup" element={<UserSignup />} />

        <Route
          path="/admin"
          element={(
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin/users"
          element={(
            <ProtectedRoute roles={["admin"]}>
              <UserManagement />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin/memberships"
          element={(
            <ProtectedRoute roles={["admin"]}>
              <MembershipManagement />
            </ProtectedRoute>
          )}
        />

        <Route
          path="/vendor"
          element={(
            <ProtectedRoute roles={["vendor"]}>
              <VendorDashboard />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/vendor/products"
          element={(
            <ProtectedRoute roles={["vendor"]}>
              <ViewProduct />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/vendor/request-item"
          element={(
            <ProtectedRoute roles={["vendor"]}>
              <RequestItem />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/vendor/product-status"
          element={(
            <ProtectedRoute roles={["vendor"]}>
              <ProductStatus />
            </ProtectedRoute>
          )}
        />

        <Route
          path="/user"
          element={(
            <ProtectedRoute roles={["user"]}>
              <UserDashboard />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/user/vendors"
          element={(
            <ProtectedRoute roles={["user"]}>
              <VendorList />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/user/cart"
          element={(
            <ProtectedRoute roles={["user"]}>
              <Cart />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/user/guest-list"
          element={(
            <ProtectedRoute roles={["user"]}>
              <GuestList />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/user/payment"
          element={(
            <ProtectedRoute roles={["user"]}>
              <Payment />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/user/order-status"
          element={(
            <ProtectedRoute roles={["user"]}>
              <OrderStatus />
            </ProtectedRoute>
          )}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
