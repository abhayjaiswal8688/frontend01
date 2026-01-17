// src/pages/Admin/AdminResults.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Download, User, Calendar, FileText, Mail, ChevronRight } from 'lucide-react';

const AdminResults = () => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search Inputs
  const [searchTerm, setSearchTerm] = useState('');
  const [emailSearch, setEmailSearch] = useState('');
  
  // Suggestion UI States
  const [showGeneralSuggestions, setShowGeneralSuggestions] = useState(false);
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1); // For keyboard nav

  // Computed Suggestions Lists
  const [generalSuggestions, setGeneralSuggestions] = useState([]);
  const [emailSuggestionsList, setEmailSuggestionsList] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
          navigate('/');
          return;
      }

      try {
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

  // --- FILTER LOGIC ---
  const filteredResults = results.filter(item => {
    const matchesGeneral = 
      (item.userId?.name || "Unknown").toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.testTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEmail = 
      (item.userId?.email || "").toLowerCase().includes(emailSearch.toLowerCase());

    return matchesGeneral && matchesEmail;
  });

  // --- SUGGESTION ENGINE ---
  useEffect(() => {
      // 1. General Suggestions
      if (!searchTerm.trim()) {
          setGeneralSuggestions([]);
      } else {
          const lowerSearch = searchTerm.toLowerCase();
          const uniqueSet = new Set();
          results.forEach(item => {
              const name = item.userId?.name || "";
              const title = item.testTitle || "";
              const category = item.category || "";
              if (name.toLowerCase().includes(lowerSearch)) uniqueSet.add(name);
              if (title.toLowerCase().includes(lowerSearch)) uniqueSet.add(title);
              if (category.toLowerCase().includes(lowerSearch)) uniqueSet.add(category);
          });
          setGeneralSuggestions(Array.from(uniqueSet).slice(0, 5));
      }

      // 2. Email Suggestions
      if (!emailSearch.trim()) {
          setEmailSuggestionsList([]);
      } else {
          const lowerEmail = emailSearch.toLowerCase();
          const uniqueEmails = new Set();
          results.forEach(item => {
              const email = item.userId?.email || "";
              if (email.toLowerCase().includes(lowerEmail)) uniqueEmails.add(email);
          });
          setEmailSuggestionsList(Array.from(uniqueEmails).slice(0, 5));
      }
  }, [searchTerm, emailSearch, results]);

  // --- HANDLERS ---

  // Handle Input Changes
  const handleGeneralChange = (e) => {
      setSearchTerm(e.target.value);
      setShowGeneralSuggestions(true);
      setShowEmailSuggestions(false); // Close other
      setActiveSuggestion(-1);
  };

  const handleEmailChange = (e) => {
      setEmailSearch(e.target.value);
      setShowEmailSuggestions(true);
      setShowGeneralSuggestions(false); // Close other
      setActiveSuggestion(-1);
  };

  // Keyboard Navigation
  const handleKeyDown = (e, suggestions, setInput, closeDropdown) => {
      if (e.key === 'ArrowDown') {
          e.preventDefault();
          setActiveSuggestion(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setActiveSuggestion(prev => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === 'Enter') {
          e.preventDefault();
          if (activeSuggestion >= 0 && suggestions[activeSuggestion]) {
              setInput(suggestions[activeSuggestion]);
              closeDropdown();
              setActiveSuggestion(-1);
          }
      } else if (e.key === 'Escape') {
          closeDropdown();
      }
  };

  // Selection Handler (Click/Enter)
  const selectSuggestion = (value, setInput, closeDropdown) => {
      setInput(value);
      closeDropdown();
      setActiveSuggestion(-1);
  };

  // --- EXPORT FUNCTION ---
  const handleExport = () => {
    if (filteredResults.length === 0) return alert("No data available to export.");

    const headers = ["Student Name,Email,Assessment,Category,Score,Total Questions,Percentage,Date"];
    const rows = filteredResults.map(row => {
        const name = `"${row.userId?.name || 'Unknown'}"`;
        const email = `"${row.userId?.email || 'N/A'}"`;
        const title = `"${row.testTitle}"`;
        const category = `"${row.category}"`;
        const date = new Date(row.createdAt).toLocaleDateString();
        
        return `${name},${email},${title},${category},${row.score},${row.totalQuestions},"${row.percentage}%",${date}`;
    });

    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `student_results_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin')} className="p-2 hover:bg-slate-100 rounded-full transition">
                <ArrowLeft className="text-slate-500" />
            </button>
            <h1 className="text-xl font-bold text-slate-900">Student Analytics</h1>
          </div>
          <div className="text-sm text-slate-500">
            Visible Rows: <span className="font-bold text-slate-900">{filteredResults.length}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Search & Actions Bar */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-8">
            
            {/* Input Group */}
            <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto flex-1 relative z-20">
                
                {/* 1. General Search */}
                <div className="relative w-full md:w-80 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 pointer-events-none" />
                    <input 
                        type="text" 
                        placeholder="Search Name, Test, or Category..." 
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
                        value={searchTerm}
                        onChange={handleGeneralChange}
                        onFocus={() => { setShowGeneralSuggestions(true); setActiveSuggestion(-1); }}
                        onBlur={() => setTimeout(() => setShowGeneralSuggestions(false), 200)}
                        onKeyDown={(e) => handleKeyDown(e, generalSuggestions, setSearchTerm, () => setShowGeneralSuggestions(false))}
                    />

                    {/* General Suggestions Dropdown */}
                    {showGeneralSuggestions && generalSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                            {generalSuggestions.map((s, i) => (
                                <button
                                    key={i}
                                    className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors border-b border-slate-50 last:border-0 
                                        ${i === activeSuggestion ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50 text-slate-700'}
                                    `}
                                    // Use onMouseDown instead of onClick to fire before Input Blur
                                    onMouseDown={() => selectSuggestion(s, setSearchTerm, () => setShowGeneralSuggestions(false))}
                                >
                                    <Search size={14} className={i === activeSuggestion ? "text-blue-500" : "text-slate-400"} />
                                    <span className="truncate flex-1 font-medium">{s}</span>
                                    <ChevronRight size={14} className={i === activeSuggestion ? "text-blue-400" : "text-slate-300"} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* 2. Email Search */}
                <div className="relative w-full md:w-80 group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 pointer-events-none" />
                    <input 
                        type="text" 
                        placeholder="Filter by Email..." 
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
                        value={emailSearch}
                        onChange={handleEmailChange}
                        onFocus={() => { setShowEmailSuggestions(true); setActiveSuggestion(-1); }}
                        onBlur={() => setTimeout(() => setShowEmailSuggestions(false), 200)}
                        onKeyDown={(e) => handleKeyDown(e, emailSuggestionsList, setEmailSearch, () => setShowEmailSuggestions(false))}
                    />

                    {/* Email Suggestions Dropdown */}
                    {showEmailSuggestions && emailSuggestionsList.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                            {emailSuggestionsList.map((s, i) => (
                                <button
                                    key={i}
                                    className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors border-b border-slate-50 last:border-0 
                                        ${i === activeSuggestion ? 'bg-purple-50 text-purple-700' : 'hover:bg-slate-50 text-slate-700'}
                                    `}
                                    onMouseDown={() => selectSuggestion(s, setEmailSearch, () => setShowEmailSuggestions(false))}
                                >
                                    <Mail size={14} className={i === activeSuggestion ? "text-purple-500" : "text-slate-400"} />
                                    <span className="truncate flex-1 font-medium">{s}</span>
                                    <ChevronRight size={14} className={i === activeSuggestion ? "text-purple-400" : "text-slate-300"} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Export Button */}
            <button 
                onClick={handleExport}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 font-bold transition shadow-md hover:shadow-lg transform active:scale-95"
            >
                <Download size={18} />
                <span>Export CSV</span>
            </button>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative z-0">
            {loading ? (
                 <div className="p-12 flex justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>
            ) : filteredResults.length === 0 ? (
                 <div className="p-12 text-center text-slate-400">No results found matching your filters.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                            <tr>
                                <th className="p-5">Student Details</th>
                                <th className="p-5">Assessment Info</th>
                                <th className="p-5">Performance</th>
                                <th className="p-5">Submitted On</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredResults.map((result) => (
                                <tr key={result._id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 flex items-center justify-center font-bold text-sm shadow-sm">
                                                {result.userId?.name ? result.userId.name.charAt(0).toUpperCase() : <User size={16} />}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800">{result.userId?.name || "Unknown User"}</div>
                                                <div className="text-xs text-slate-500 font-medium">{result.userId?.email || "No Email"}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="font-semibold text-slate-800">{result.testTitle}</div>
                                        <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600 uppercase font-bold tracking-wide border border-slate-200">
                                            <FileText size={10} /> {result.category}
                                        </span>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getScoreColor(result.percentage)}`}>
                                                {result.percentage}%
                                            </span>
                                            <div className="text-xs text-slate-400 font-medium">
                                                {result.score} / {result.totalQuestions} Correct
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5 text-sm text-slate-500">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-slate-400" />
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