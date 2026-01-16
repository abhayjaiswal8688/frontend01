// src/pages/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Clock, Calendar } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stats, setStats] = useState({ totalTests: 0, averageScore: 0, bestSubject: 'N/A' });

  useEffect(() => {
    const fetchDashboardData = async () => {
        // --- FIX 1: USE CORRECT KEY 'token' ---
        const token = localStorage.getItem('token');
        
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            // --- FIX 2: FETCH USER DATA USING THE TOKEN ---
            const userRes = await fetch(`${API_BASE_URL}/users/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!userRes.ok) throw new Error("Failed to verify user session");
            
            const user = await userRes.json();
            setUserData(user); // 'user' object now contains _id, name, email

            // --- FIX 3: USE REAL ID (user._id) TO GET RESULTS ---
            const resultsRes = await fetch(`${API_BASE_URL}/results/user/${user._id}`);
            
            if (!resultsRes.ok) {
                 // Handle cases where history might be empty or server error
                 if(resultsRes.status === 404) {
                     setHistory([]);
                     return;
                 }
                 throw new Error("Failed to load history");
            }
            
            const historyData = await resultsRes.json();
            
            if (Array.isArray(historyData)) {
                setHistory(historyData);
                calculateStats(historyData);
            } else {
                setHistory([]); 
            }

        } catch (err) {
            console.error("Dashboard Error:", err);
            // Don't show error if it's just a connection blip, maybe log it
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    fetchDashboardData();
  }, [navigate]);

  const calculateStats = (data) => {
    if (!data.length) return;
    const total = data.length;
    const avg = Math.round(data.reduce((acc, curr) => acc + curr.percentage, 0) / total);
    
    const categories = {};
    data.forEach(item => {
        const cat = item.category || 'General';
        categories[cat] = (categories[cat] || 0) + 1;
    });
    
    let bestSub = 'N/A';
    if (Object.keys(categories).length > 0) {
        bestSub = Object.keys(categories).reduce((a, b) => categories[a] > categories[b] ? a : b);
    }
    setStats({ totalTests: total, averageScore: avg, bestSubject: bestSub });
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (percentage >= 50) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading your dashboard...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8 flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 border-4 border-white shadow-lg">
                <User size={48} />
            </div>
            <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl font-bold text-gray-900">{userData?.name || "Student"}</h1>
                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 mt-2">
                    <Mail size={16} />
                    <span>{userData?.email || "Loading email..."}</span>
                </div>
            </div>
            {/* Stats */}
            <div className="flex gap-4">
                <div className="text-center p-4 bg-indigo-50 rounded-2xl border border-indigo-100 min-w-[100px]">
                    <div className="text-indigo-600 font-bold text-2xl">{stats.totalTests}</div>
                    <div className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Tests Taken</div>
                </div>
                <div className="text-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100 min-w-[100px]">
                    <div className="text-emerald-600 font-bold text-2xl">{stats.averageScore}%</div>
                    <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Avg Score</div>
                </div>
            </div>
        </div>

        {/* History Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Clock size={20} className="text-purple-500" />
                    Recent Assessments
                </h2>
            </div>

            {history.length === 0 ? (
                 <div className="p-12 text-center text-gray-400">No assessments taken yet. Go take a quiz!</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                            <tr>
                                <th className="p-6">Assessment</th>
                                <th className="p-6">Category</th>
                                <th className="p-6">Date</th>
                                <th className="p-6">Score</th>
                                <th className="p-6">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {history.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-6 font-medium text-gray-800">{item.testTitle}</td>
                                    <td className="p-6">
                                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase">
                                            {item.category || 'General'}
                                        </span>
                                    </td>
                                    <td className="p-6 text-gray-500 text-sm flex items-center gap-2">
                                        <Calendar size={14} />
                                        {formatDate(item.createdAt)}
                                    </td>
                                    <td className="p-6">
                                        <span className="text-lg font-bold text-gray-900">{item.score}</span>
                                        <span className="text-gray-400 text-sm">/ {item.totalQuestions}</span>
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-4 py-1.5 rounded-lg text-xs font-bold border ${getScoreColor(item.percentage)}`}>
                                            {item.percentage}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;