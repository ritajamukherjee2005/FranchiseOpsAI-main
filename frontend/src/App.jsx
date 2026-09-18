import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import OutletPerformanceAgent from "./pages/OutletPerformanceAgent";
import InventoryAgent from "./pages/InventoryAgent";
import MarketingAgent from "./pages/MarketingAgent";
import StaffAgent from "./pages/StaffAgent";
import AuditAgent from "./pages/AuditAgent";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import Layout from "./components/Layout";
import ReportsPage from "./pages/ReportsPage";
import DashboardPage from "./pages/DashboardPage";
import IntelligenceEnginePage from './pages/IntelligenceEnginePage';
import NotificationModulePage from "./pages/NotificationModulePage";
import SettingsPage from "./pages/SettingsPage"; // 1. Import your SettingsPage component

function App() {
  const [dark, setDark] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        {/* AUTH ROUTES (FULL SCREEN) */}
        <Route path="/login" element={<LoginPage dark={dark} setDark={setDark} />} />
        <Route path="/signup" element={<SignUpPage dark={dark} setDark={setDark} />} />

        {/* AGENT ROUTES (WRAPPED IN SHARED LAYOUT) */}
        <Route
          path="/"
          element={
            <Layout dark={dark} setDark={setDark}>
              <DashboardPage dark={dark} />
            </Layout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Layout dark={dark} setDark={setDark}>
              <DashboardPage dark={dark} />
            </Layout>
          }
        />
        <Route
          path="/outlet-performance"
          element={
            <Layout dark={dark} setDark={setDark}>
              <OutletPerformanceAgent embedded={true} dark={dark} setDark={setDark} />
            </Layout>
          }
        />
        <Route
          path="/audit"
          element={
            <Layout dark={dark} setDark={setDark}>
              <AuditAgent dark={dark} />
            </Layout>
          }
        />
        <Route
          path="/inventory"
          element={
            <Layout dark={dark} setDark={setDark}>
              <InventoryAgent dark={dark} />
            </Layout>
          }
        />
        <Route
          path="/staff"
          element={
            <Layout dark={dark} setDark={setDark}>
              <StaffAgent dark={dark} />
            </Layout>
          }
        />
        <Route
          path="/marketing"
          element={
            <Layout dark={dark} setDark={setDark}>
              <MarketingAgent dark={dark} />
            </Layout>
          }
        />
        <Route
          path="/intelligence"
          element={
            <Layout dark={dark} setDark={setDark}>
              <IntelligenceEnginePage dark={dark} />
            </Layout>
          }
        />
        <Route
          path="/notifications"
          element={
            <Layout dark={dark} setDark={setDark}>
              <NotificationModulePage dark={dark} />
            </Layout>
          }
        />
        <Route
          path="/reports"
          element={
            <Layout dark={dark} setDark={setDark}>
              <ReportsPage dark={dark} />
            </Layout>
          }
        />
        {/* 2. Add the Settings Route */}
        <Route
          path="/settings"
          element={
            <Layout dark={dark} setDark={setDark}>
              <SettingsPage dark={dark} />
            </Layout>
          }
        />
        {/* CATCH ALL FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;