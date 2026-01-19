// src/components/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { Sparkles, ArrowLeft, Mail, Lock } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export function LoginPage() {
    const navigate = useNavigate(); 
    const location = useLocation(); // To parse query params
    
    // VIEW MODES: 'login', 'register', 'forgot', 'reset'
    const [view, setView] = useState('login'); 
    
    // Logic to detect Reset Token in URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const resetToken = params.get('resetToken');
        if (resetToken) {
            setView('reset');
            setFormData(prev => ({ ...prev, token: resetToken }));
        }
    }, [location]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        newPassword: '', // For reset
        token: '' // For reset
    });

    const [status, setStatus] = useState({ loading: false, error: '', success: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: '', success: '' });

        let endpoint = '';
        let body = {};
        let method = 'POST';

        // Configure Endpoint & Body based on View
        if (view === 'login') {
            endpoint = `${API_BASE_URL}/auth/login`;
            body = { email: formData.email, password: formData.password };
        } else if (view === 'register') {
            endpoint = `${API_BASE_URL}/auth/register`;
            body = { name: formData.name, email: formData.email, password: formData.password };
        } else if (view === 'forgot') {
            endpoint = `${API_BASE_URL}/auth/forgot-password`;
            body = { email: formData.email };
        } else if (view === 'reset') {
            endpoint = `${API_BASE_URL}/auth/reset-password`;
            body = { token: formData.token, newPassword: formData.newPassword };
        }

        try {
            const response = await fetch(endpoint, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Operation failed');
            }

            // SUCCESS HANDLING
            if (view === 'login') {
                localStorage.setItem('token', data.token); 
                localStorage.setItem('user', JSON.stringify(data.user));
                window.dispatchEvent(new Event('local-storage-changed'));
                setStatus({ loading: false, error: '', success: 'Login successful! Redirecting...' });
                setTimeout(() => {
                    if (data.user.role === 'admin') navigate('/admin');
                    else navigate('/test'); 
                }, 1000);
            } 
            else if (view === 'register') {
                setStatus({ loading: false, error: '', success: 'Verification email sent! Check your inbox.' });
                setFormData({ ...formData, password: '' });
            }
            else if (view === 'forgot') {
                setStatus({ loading: false, error: '', success: 'Reset link sent! Check your email.' });
            }
            else if (view === 'reset') {
                setStatus({ loading: false, error: '', success: 'Password reset successful! You can now login.' });
                setTimeout(() => {
                    setView('login');
                    setStatus({ loading: false, error: '', success: '' });
                    // Clean URL
                    navigate('/login', { replace: true }); 
                }, 2000);
            }

        } catch (err) {
            setStatus({ loading: false, error: err.message, success: '' });
        }
    };

    // --- RENDER HELPERS ---
    const getTitle = () => {
        if (view === 'login') return 'Welcome Back';
        if (view === 'register') return 'Join Community';
        if (view === 'forgot') return 'Reset Password';
        if (view === 'reset') return 'Set New Password';
    };

    const getDescription = () => {
        if (view === 'login') return 'Enter your details to access your account.';
        if (view === 'register') return 'Begin your journey to emotional mastery.';
        if (view === 'forgot') return 'Enter your email to receive a reset link.';
        if (view === 'reset') return 'Please enter your new password below.';
    };

    const getButtonText = () => {
        if (status.loading) return 'Processing...';
        if (view === 'login') return 'Sign In';
        if (view === 'register') return 'Register & Verify';
        if (view === 'forgot') return 'Send Reset Link';
        if (view === 'reset') return 'Update Password';
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden p-6">
            
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-purple-300/30 blur-[100px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-rose-300/30 blur-[100px]" />
            </div>

            <div className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/50 p-8 md:p-10 text-center relative z-10 transition-all duration-300 hover:shadow-purple-900/10">
                
                {/* Back Button for Forgot/Reset views */}
                {(view === 'forgot' || view === 'reset') && (
                    <button 
                        onClick={() => { setView('login'); setStatus({ error: '', success: '', loading: false }); }}
                        className="absolute top-6 left-6 p-2 text-slate-400 hover:text-slate-700 hover:bg-white rounded-full transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                )}

                <div className="mx-auto w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                    {view === 'forgot' ? <Mail size={24} /> : view === 'reset' ? <Lock size={24} /> : <Sparkles size={24} />}
                </div>

                <h1 className="text-3xl font-bold text-slate-900 mb-2 font-serif">{getTitle()}</h1>
                <p className="text-slate-500 mb-8">{getDescription()}</p>

                {status.error && (
                    <div className="mb-6 p-3 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl">{status.error}</div>
                )}
                {status.success && (
                    <div className="mb-6 p-3 text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl font-medium">{status.success}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 text-left">
                    
                    {/* NAME (Register Only) */}
                    {view === 'register' && (
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required className="w-full px-5 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all" />
                        </div>
                    )}

                    {/* EMAIL (Login, Register, Forgot) */}
                    {view !== 'reset' && (
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@gmail.com" required className="w-full px-5 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all" />
                        </div>
                    )}

                    {/* PASSWORD (Login, Register) */}
                    {(view === 'login' || view === 'register') && (
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required className="w-full px-5 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all" />
                        </div>
                    )}

                    {/* NEW PASSWORD (Reset Only) */}
                    {view === 'reset' && (
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">New Password</label>
                            <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} placeholder="New secure password" required minLength={6} className="w-full px-5 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all" />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={status.loading}
                        className="w-full py-4 px-6 mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg hover:shadow-purple-500/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        {getButtonText()}
                    </button>
                </form>

                {/* Footer Links */}
                {(view === 'login' || view === 'register') && (
                    <div className="mt-8 pt-6 border-t border-slate-100 text-sm text-slate-600 flex flex-col gap-3">
                        
                        {/* Toggle Login/Register */}
                        <div>
                            {view === 'login' ? "Don't have an account? " : "Already have an account? "}
                            <button 
                                onClick={() => {
                                    setView(view === 'login' ? 'register' : 'login');
                                    setStatus({ loading: false, error: '', success: '' });
                                }} 
                                className="font-bold text-purple-600 hover:text-purple-800 hover:underline focus:outline-none transition-colors"
                            >
                                {view === 'login' ? 'Sign up' : 'Log in'}
                            </button>
                        </div>

                        {/* Forgot Password Link */}
                        {view === 'login' && (
                            <button 
                                onClick={() => { setView('forgot'); setStatus({ loading: false, error: '', success: '' }); }}
                                className="text-slate-400 hover:text-purple-600 font-medium transition-colors text-xs"
                            >
                                Forgot your password?
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}