// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  // 1. Get user and token separately
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const token = localStorage.getItem('token'); 

  // 2. Check if we have a valid session
  // We need BOTH a user object AND a token (either in storage or inside user object)
  const hasToken = token || (user && user.token);

  if (!user || !hasToken) {
    // Not logged in -> Go to Login
    return <Navigate to="/login" replace />;
  }

  // 3. Logged in but wrong role?
  if (requiredRole && user.role !== requiredRole) {
    // If student tries to access admin page, kick them to student test view
    return <Navigate to="/test" replace />;
  }

  // 4. All good? -> Render the page
  return children;
};

export default ProtectedRoute;