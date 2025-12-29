import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// API Base URL - Updated to use Vite Environment Variable
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export function ProfilePage() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('user_token');
            if (!token) {
                navigate('/login'); // Redirect to login if no token
                return;
            }

            try {
                // CHANGED: Use API_BASE constant
                // Note: Ensure API_BASE includes '/api' in your .env file
                const response = await fetch(`${API_BASE}/users/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch user profile');
                }
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error("Error:", error);
                localStorage.removeItem('user_token'); // Clear bad token
                navigate('/login');
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserProfile();
    }, [navigate]);

    const handleLogout = () => {
        // 1. Remove the token from storage
        localStorage.removeItem('user_token');

        // 2. Dispatch our custom event to notify the navbar
        window.dispatchEvent(new Event('local-storage-changed'));

        // 3. Navigate back to the homepage
        navigate('/');
    };

    if (isLoading) {
        return <div className="text-center p-10">Loading profile...</div>;
    }

    if (!user) {
        return <div className="text-center p-10">Could not load profile. Please try logging in again.</div>;
    }

    return (
        <div className="min-h-screen bg-green-100 p-4 sm:p-6 md:p-8">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 border-1">
                <div className="flex flex-col items-center">
                    {/* Added fallback for missing avatar */}
                    <img 
                        src={user.avatarUrl || "https://via.placeholder.com/150"} 
                        alt="User Avatar" 
                        className="w-32 h-32 rounded-full border-4 border-green-200 mb-4 object-cover" 
                    />
                    <h1 className="text-3xl font-bold text-gray-800">{user.displayName || "User"}</h1>
                    <p className="text-gray-600 mt-1">{user.email}</p>
                    <span className="mt-4 px-4 py-1 border-1 bg-green-200 text-green-800 text-xl font-semibold rounded-full capitalize">
                        {user.role || "Student"}
                    </span>

                    <button 
                        onClick={handleLogout}
                        className="mt-4 px-5 py-1 bg-red-600 text-white font-semibold rounded-xl shadow-md border-1 border-black hover:bg-orange-800 transition-colors"
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
}
