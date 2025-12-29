import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Sparkles } from 'lucide-react';

// Define the API URL based on the environment
// If the .env variable is missing, it falls back to localhost automatically
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
// NOTE: If you are using Create-React-App (not Vite), use: process.env.REACT_APP_API_BASE_URL

export function LoginPage() {
    const navigate = useNavigate(); 
    const [isLogin, setIsLogin] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [status, setStatus] = useState({ loading: false, error: '', success: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: '', success: '' });

        // ✅ FIXED: Now uses the environment variable
        const endpoint = isLogin 
            ? `${API_BASE_URL}/api/auth/login` 
            : `${API_BASE_URL}/api/auth/register`;

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...(isLogin ? {} : { name: formData.name }),
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Operation failed');
            }

            if (isLogin) {
                localStorage.setItem('token', data.token); 
                localStorage.setItem('user', JSON.stringify(data.user));

                window.dispatchEvent(new Event('local-storage-changed'));

                setStatus({ loading: false, error: '', success: 'Login successful! Redirecting...' });

                setTimeout(() => {
                    if (data.user.role === 'admin') {
                        navigate('/admin');
                    } else {
                        navigate('/test'); 
                    }
                }, 1000);
            } else {
                setStatus({ 
                    loading: false, 
                    error: '', 
                    success: 'Verification email sent! Please check your Gmail to activate your account.' 
                });
                
                setFormData({ ...formData, password: '' });
            }

        } catch (err) {
            setStatus({ loading: false, error: err.message, success: '' });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden p-6">
            
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-purple-300/30 blur-[100px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-rose-300/30 blur-[100px]" />
            </div>

            <div className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/50 p-8 md:p-10 text-center relative z-10 transition-all duration-300 hover:shadow-purple-900/10">
                
                <div className="mx-auto w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                    <Sparkles size={24} />
                </div>

                <h1 className="text-3xl font-bold text-slate-900 mb-2 font-serif">
                    {isLogin ? 'Welcome Back' : 'Join the Community'}
                </h1>
                <p className="text-slate-500 mb-8">
                    {isLogin 
                        ? 'Enter your details to access your account.' 
                        : 'Begin your journey to emotional mastery today.'}
                </p>

                {status.error && (
                    <div className="mb-6 p-3 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl">
                        {status.error}
                    </div>
                )}
                
                {status.success && (
                    <div className="mb-6 p-3 text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl font-medium">
                        {status.success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 text-left">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                required={!isLogin}
                                className="w-full px-5 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all placeholder:text-slate-400"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@gmail.com"
                            required
                            className="w-full px-5 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all placeholder:text-slate-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                            className="w-full px-5 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all placeholder:text-slate-400"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status.loading}
                        className="w-full py-4 px-6 mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg hover:shadow-purple-500/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        {status.loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Register & Verify')}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 text-sm text-slate-600">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button 
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setStatus({ loading: false, error: '', success: '' });
                        }} 
                        className="font-bold text-purple-600 hover:text-purple-800 hover:underline focus:outline-none transition-colors"
                    >
                        {isLogin ? 'Sign up' : 'Log in'}
                    </button>
                </div>

            </div>
        </div>
    );
}
