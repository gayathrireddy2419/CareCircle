import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HealthProvider } from "./context/HealthContext";

// Layout
import { DashboardLayout } from "./layouts/DashboardLayout";

// Landing Page
import Landing from "./pages/Landing/Landing";

// Authentication
import { Login } from "./pages/Auth/Login";
import { Register } from "./pages/Auth/Register";

// Dashboard & Core Modules
import MainDashboard from "./pages/Dashboard/MainDashboard";
import { FamilyMembers } from "./pages/Members/FamilyMembers";
import MemberProfile from "./pages/Members/MemberProfile";
import FamilyDashboard from "./pages/Family/FamilyDashboard";
import SetupWizard from "./pages/Family/SetupWizard";

import { RecordsVault } from "./pages/Records/RecordsVault";

import { MedicineManager } from "./pages/Medicine/MedicineManager";
import AddMedicine from "./pages/Medicine/AddMedicine";
import MedicineConsumption from "./pages/Medicine/MedicineConsumption";

import { EmergencyModule } from "./pages/Emergency/EmergencyModule";

// Analytics, Metrics & AI
import Analytics from "./pages/Analytics/Analytics";
import Metrics from "./pages/Metrics/Metrics";
import AIAssistant from "./pages/AI/AIAssistant";

// Profile, Settings
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Settings/Settings";

import "./styles/App.css";

function App() {
  return (
    <HealthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Application Routes */}
          <Route path="/app" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<MainDashboard />} />
            
            {/* Family Members */}
            <Route path="members" element={<FamilyMembers />} />
            <Route path="members/:id" element={<MemberProfile />} />
            <Route path="family" element={<FamilyDashboard />} />
            <Route path="setup-wizard" element={<SetupWizard />} />

            {/* Records */}
            <Route path="records" element={<RecordsVault />} />

            {/* Medicine */}
            <Route path="medicine" element={<MedicineManager />} />
            <Route path="medicine/add" element={<AddMedicine />} />
            <Route path="medicine/log" element={<MedicineConsumption />} />

            {/* Emergency */}
            <Route path="emergency" element={<EmergencyModule />} />

            {/* Analytics & Metrics */}
            <Route path="analytics" element={<Analytics />} />
            <Route path="metrics" element={<Metrics />} />

            {/* AI Assistant */}
            <Route path="ai" element={<AIAssistant />} />

            {/* Profile, Settings */}
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </HealthProvider>
  );
}

export default App;