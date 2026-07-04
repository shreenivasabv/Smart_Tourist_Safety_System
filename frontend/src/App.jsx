import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashBoard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;