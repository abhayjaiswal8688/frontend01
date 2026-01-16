// src/pages/Admin/AdminResults.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Download, User, Calendar, FileText } from 'lucide-react';

const AdminResults = () => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
          navigate('/');
          return;
      }

      try {
        // Fetching all results (requires the route we added to backend/routes/results.js)
        const res = await fetch(`${API_BASE_URL}/results/admin/all`, {
             headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
            const data = await res.json();
            setResults(data);
        } else {
            console.error("Failed to fetch results");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [navigate, API_BASE_URL]);

  // Filter logic for search bar
  const filteredResults = results.filter(item => 
    (item.userId?.name || "Unknown").toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.testTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'
  });

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return "bg-green-100 text-green-700 border-green-200";
    if (percentage >= 50) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin')} className="p-2 hover:bg-slate-100 rounded-full transition">
                <ArrowLeft className="text-slate-500" />
            </button>
            <h1 className="text-xl font-bold text-slate-900">Student Analytics</h1>
          </div>
          <div className="text-sm text-slate-500">
            Total Submissions: <span className="font-bold text-slate-900">{results.length}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        
        {/* Search & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input 
                    type="text" 
                    placeholder="Search by student, test, or category..." 
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            {/* Placeholder for future CSV Export feature */}
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium transition shadow-sm">
                <Download size={18} />
                <span>Export Data</span>
            </button>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {loading ? (
                 <div className="p-12 flex justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>
            ) : filteredResults.length === 0 ? (
                 <div className="p-12 text-center text-slate-400">No results found matching your search.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                            <tr>
                                <th className="p-5">Student</th>
                                <th className="p-5">Assessment</th>
                                <th className="p-5">Score</th>
                                <th className="p-5">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredResults.map((result) => (
                                <tr key={result._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                <User size={14} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800">{result.userId?.name || "Unknown User"}</div>
                                                <div className="text-xs text-slate-500">{result.userId?.email || "No Email"}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="font-medium text-slate-800">{result.testTitle}</div>
                                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 uppercase font-bold tracking-wide">
                                            {result.category}
                                        </span>
                                    </td>
                                    <td className="p-5">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getScoreColor(result.percentage)}`}>
                                            {result.percentage}%
                                        </span>
                                        <div className="text-[10px] text-slate-400 mt-1 ml-1">
                                            {result.score} / {result.totalQuestions}
                                        </div>
                                    </td>
                                    <td className="p-5 text-sm text-slate-500">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} />
                                            {formatDate(result.createdAt)}
                                        </div>
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

export default AdminResults;