// src/pages/Admin/StudentProgress.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Search, CheckCircle, User, BookOpen, 
    Filter, TrendingUp, Calendar, Mail, ChevronRight,
    Download // <--- Added Download Icon
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const StudentProgress = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // --- SEARCH STATE ---
    const [searchTerm, setSearchTerm] = useState('');
    const [emailSearch, setEmailSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');

    // --- SUGGESTION UI STATE ---
    const [showGeneralSuggestions, setShowGeneralSuggestions] = useState(false);
    const [showEmailSuggestions, setShowEmailSuggestions] = useState(false);
    const [activeSuggestion, setActiveSuggestion] = useState(-1);

    // --- COMPUTED SUGGESTIONS ---
    const [generalSuggestions, setGeneralSuggestions] = useState([]);
    const [emailSuggestionsList, setEmailSuggestionsList] = useState([]);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_BASE_URL}/courses/admin/analytics`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const result = await res.json();
                setData(result);
            }
        } catch (err) {
            console.error("Failed to fetch analytics", err);
        } finally {
            setLoading(false);
        }
    };

    // --- SUGGESTION ENGINE ---
    useEffect(() => {
        if (!searchTerm.trim()) {
            setGeneralSuggestions([]);
        } else {
            const lowerSearch = searchTerm.toLowerCase();
            const uniqueSet = new Set();
            data.forEach(item => {
                const name = item.studentName || "";
                const course = item.courseTitle || "";
                if (name.toLowerCase().includes(lowerSearch)) uniqueSet.add(name);
                if (course.toLowerCase().includes(lowerSearch)) uniqueSet.add(course);
            });
            setGeneralSuggestions(Array.from(uniqueSet).slice(0, 5));
        }

        if (!emailSearch.trim()) {
            setEmailSuggestionsList([]);
        } else {
            const lowerEmail = emailSearch.toLowerCase();
            const uniqueEmails = new Set();
            data.forEach(item => {
                const email = item.studentEmail || "";
                if (email.toLowerCase().includes(lowerEmail)) uniqueEmails.add(email);
            });
            setEmailSuggestionsList(Array.from(uniqueEmails).slice(0, 5));
        }
    }, [searchTerm, emailSearch, data]);

    // --- FILTER LOGIC ---
    const filteredData = data.filter(item => {
        const matchesSearch = 
            item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
            item.courseTitle.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesEmail = 
            item.studentEmail.toLowerCase().includes(emailSearch.toLowerCase());
        
        const matchesCategory = filterCategory === 'All' || item.courseCategory === filterCategory;

        return matchesSearch && matchesEmail && matchesCategory;
    });

    // --- HANDLERS ---
    const handleGeneralChange = (e) => {
        setSearchTerm(e.target.value);
        setShowGeneralSuggestions(true);
        setShowEmailSuggestions(false);
        setActiveSuggestion(-1);
    };

    const handleEmailChange = (e) => {
        setEmailSearch(e.target.value);
        setShowEmailSuggestions(true);
        setShowGeneralSuggestions(false);
        setActiveSuggestion(-1);
    };

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

    const selectSuggestion = (value, setInput, closeDropdown) => {
        setInput(value);
        closeDropdown();
        setActiveSuggestion(-1);
    };

    // --- NEW: EXPORT FUNCTION ---
    const handleExport = () => {
        if (filteredData.length === 0) return alert("No data available to export.");

        // Define Headers
        const headers = ["Student Name,Email,Course,Category,Progress,Completed Lessons,Total Lessons,Last Active,Status"];
        
        // Map Data to Rows
        const rows = filteredData.map(item => {
            const name = `"${item.studentName}"`;
            const email = `"${item.studentEmail}"`;
            const course = `"${item.courseTitle}"`;
            const category = `"${item.courseCategory}"`;
            const progress = `"${item.progressPercentage}%"`;
            const completed = item.completedLessons;
            const total = item.totalLessons;
            const lastActive = new Date(item.lastActive).toLocaleDateString();
            const status = item.isCompleted ? "Completed" : "In Progress";

            return `${name},${email},${course},${category},${progress},${completed},${total},${lastActive},${status}`;
        });

        // Create CSV Blob
        const csvContent = [headers, ...rows].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        // Trigger Download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `student_progress_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --- STATS CALCULATION ---
    const totalEnrollments = data.length;
    const completedCourses = data.filter(d => d.isCompleted).length;
    const completionRate = totalEnrollments ? Math.round((completedCourses / totalEnrollments) * 100) : 0;
    const activeLearners = data.filter(d => d.progressPercentage > 0 && d.progressPercentage < 100).length;
    const categories = ['All', ...new Set(data.map(item => item.courseCategory))];

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
             <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                <p className="text-slate-500 font-medium">Loading Analytics...</p>
             </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-800">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Student Progress Analytics</h1>
                    <p className="text-slate-500">Track student engagement and course completion rates.</p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <User size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Enrollments</p>
                            <h3 className="text-2xl font-bold text-slate-800">{totalEnrollments}</h3>
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Completion Rate</p>
                            <h3 className="text-2xl font-bold text-slate-800">{completionRate}%</h3>
                            <span className="text-xs text-slate-400">{completedCourses} completed courses</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Active Learners</p>
                            <h3 className="text-2xl font-bold text-slate-800">{activeLearners}</h3>
                            <span className="text-xs text-slate-400">Currently in progress</span>
                        </div>
                    </div>
                </div>

                {/* Filters & Actions Toolbar */}
                <div className="flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    
                    {/* LEFT SIDE: Inputs & Actions */}
                    <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto flex-1 relative z-20">
                        
                        {/* 1. General Search Input */}
                        <div className="relative w-full md:w-80 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 pointer-events-none" />
                            <input 
                                type="text" 
                                placeholder="Search Name or Course..." 
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
                                value={searchTerm}
                                onChange={handleGeneralChange}
                                onFocus={() => { setShowGeneralSuggestions(true); setActiveSuggestion(-1); }}
                                onBlur={() => setTimeout(() => setShowGeneralSuggestions(false), 200)}
                                onKeyDown={(e) => handleKeyDown(e, generalSuggestions, setSearchTerm, () => setShowGeneralSuggestions(false))}
                            />
                            {/* Suggestions Dropdown */}
                            {showGeneralSuggestions && generalSuggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                                    {generalSuggestions.map((s, i) => (
                                        <button
                                            key={i}
                                            className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors border-b border-slate-50 last:border-0 ${i === activeSuggestion ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50 text-slate-700'}`}
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

                        {/* 2. Email Search Input */}
                        <div className="relative w-full md:w-80 group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 pointer-events-none" />
                            <input 
                                type="text" 
                                placeholder="Filter by Email..." 
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
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
                                            className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors border-b border-slate-50 last:border-0 ${i === activeSuggestion ? 'bg-purple-50 text-purple-700' : 'hover:bg-slate-50 text-slate-700'}`}
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

                        {/* 3. Export Button */}
                        <button 
                            onClick={handleExport}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl cursor-pointer hover:bg-slate-800 font-bold transition shadow-md hover:shadow-lg transform active:scale-95 whitespace-nowrap"
                        >
                            <Download size={18} />
                            <span>Export Report</span>
                        </button>
                    </div>

                    {/* RIGHT SIDE: Category Filters */}
                    <div className="flex items-center gap-2 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0 scrollbar-hide">
                        <div className="p-2 bg-slate-100 rounded-full mr-2 shrink-0 text-slate-500">
                            <Filter size={16} />
                        </div>
                        {categories.map(cat => (
                            <button 
                                key={cat}
                                onClick={() => setFilterCategory(cat)}
                                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                                    filterCategory === cat 
                                    ? 'bg-slate-800 text-white border-slate-800 shadow-md' 
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative z-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Student</th>
                                    <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Course</th>
                                    <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider w-1/3">Progress</th>
                                    <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Last Active</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredData.length > 0 ? (
                                    filteredData.map((item) => (
                                        <tr key={item._id} className="hover:bg-slate-50/50 transition-colors group">
                                            
                                            {/* Clickable Student Column */}
                                            <td className="p-5">
                                                <div 
                                                    onClick={() => {
                                                        if (item.studentId) {
                                                            navigate(`/admin/student/${item.studentId}`, { 
                                                                state: { student: { name: item.studentName, email: item.studentEmail } } 
                                                            });
                                                        }
                                                    }}
                                                    className="flex items-center gap-3 cursor-pointer group/student"
                                                >
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0 transition-transform group-hover/student:scale-110">
                                                        {item.studentName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-700 text-sm group-hover/student:text-indigo-600 transition-colors flex items-center gap-1">
                                                            {item.studentName}
                                                            <ChevronRight size={12} className="opacity-0 group-hover/student:opacity-100 transition-opacity -ml-1 group-hover/student:ml-0" />
                                                        </p>
                                                        <p className="text-xs text-slate-400">{item.studentEmail}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Course Column */}
                                            <td className="p-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                                                        {item.thumbnail ? (
                                                            <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <BookOpen className="w-full h-full p-2 text-slate-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-700 text-sm line-clamp-1">{item.courseTitle}</p>
                                                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 uppercase">
                                                            {item.courseCategory}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Progress Column */}
                                            <td className="p-5">
                                                <div className="flex items-center gap-3 mb-1.5">
                                                    <span className={`text-sm font-bold ${item.isCompleted ? 'text-emerald-600' : 'text-slate-700'}`}>
                                                        {item.progressPercentage}%
                                                    </span>
                                                    {item.isCompleted && (
                                                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                            <CheckCircle size={10} /> Completed
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                                    <div 
                                                        className={`h-full rounded-full transition-all duration-500 ${
                                                            item.isCompleted ? 'bg-emerald-500' : 'bg-indigo-500'
                                                        }`} 
                                                        style={{ width: `${item.progressPercentage}%` }} 
                                                    />
                                                </div>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    {item.completedLessons} / {item.totalLessons} lessons
                                                </p>
                                            </td>

                                            {/* Last Active Column */}
                                            <td className="p-5 text-right">
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className="text-sm font-medium text-slate-600 flex items-center gap-1">
                                                        <Calendar size={14} className="text-slate-400" />
                                                        {new Date(item.lastActive).toLocaleDateString()}
                                                    </span>
                                                    <span className="text-xs text-slate-400">
                                                        {new Date(item.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="p-10 text-center text-slate-400">
                                            No enrollment data found matching your filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default StudentProgress;