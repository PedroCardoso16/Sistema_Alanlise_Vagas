import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Vagas from './pages/Vagas';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/vagas" replace />} />
        <Route path="/vagas" element={<Vagas />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}