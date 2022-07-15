import React from "react";
import "./App.css";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import CropImage from "./pages/CropImage";
import UploadImage from "./pages/UploadImage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/upload" />} />
        <Route path="/upload" element={<UploadImage />} />
        <Route path="/crop" element={<CropImage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
