import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function AuthCallback() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Authenticating, please wait...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
        setMessage("Authentication successful! Redirecting...");

        // 1. Store the token
        localStorage.setItem("user_token", token);

        // 2. Dispatch a custom event to notify the navbar
        window.dispatchEvent(new Event('local-storage-changed'));

        // 3. Redirect to the profile page
        setTimeout(() => {
            navigate('/profile');
        }, 1500);
    } else {
        setMessage("Authentication failed. Please try again.");
        setTimeout(() => {
            navigate('/login');
        }, 2000);
    }
}, [navigate]);

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>{message}</h1>
    </div>
  );
}