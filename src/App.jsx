// src/App.jsx
import React from 'react'; 
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';

// --- COMPONENTS ---
import { Hero } from './components/Hero';
import { Homepage } from './components/Homepage';
import { Footer } from './components/Footer';
import { CommunityFeed} from './components/CommunityFeed';
import { Resource } from './components/Resource';
import { AuthCallback } from './components/AuthCallback';
import { LoginPage } from './components/LoginPage';
import { ProfilePage } from './components/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute'; 

// --- PAGES ---
import Test from './components/Test'; 
import CreateTest from './pages/Admin/CreateTest';
import AddResource from './pages/Admin/AddResource'; // <--- NEW IMPORT
import AdminDashboard from './pages/Admin/AdminDashboard'; 

function App() {

  return (
    <BrowserRouter>
      <Hero />
      <Routes>
        {/* === PUBLIC ROUTES (Accessible to Everyone) === */}
        <Route path="/" element={<Homepage />} />
        <Route path="/resource" element={<Resource />} />
        <Route path="/CommunityFeed" element={<CommunityFeed/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/test" element={<Test />} />

        {/* === PROTECTED STUDENT ROUTES === */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />

        {/* === PROTECTED ADMIN ROUTES === */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/create-test" 
          element={
            <ProtectedRoute requiredRole="admin">
              <CreateTest />
            </ProtectedRoute>
          } 
        />
        <Route path="/admin/add-resource" element={<ProtectedRoute requiredRole="admin"><AddResource /></ProtectedRoute>} />
        <Route path="/admin/edit-resource/:id" element={<ProtectedRoute requiredRole="admin"><AddResource /></ProtectedRoute>} />
        {/* NEW: Edit Route (Re-uses CreateTest component) */}
        <Route 
          path="/admin/edit-test/:id" 
          element={
            <ProtectedRoute requiredRole="admin">
              <CreateTest />
            </ProtectedRoute>
          } 
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
      
    </BrowserRouter>
  );
}

export default App;