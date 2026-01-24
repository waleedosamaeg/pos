import { Routes, Route, Navigate } from "react-router-dom";

import Login from "@page/login.jsx";
import Register from "@page/register.jsx";
import NotFound from "@page/notFound.jsx";
import Dashboard from "@page/dashboard.jsx"

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/404" element={<NotFound />} />

      {/* default */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
