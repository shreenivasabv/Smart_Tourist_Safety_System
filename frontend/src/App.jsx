import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminDashboard from "./pages/AdminDashBoard";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Forgot Password */}
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* Reset Password */}
        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />

        {/* Dashboard (Protected) */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;