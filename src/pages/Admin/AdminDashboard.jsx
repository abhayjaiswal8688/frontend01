// src/pages/Admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // --- CONFIG: Get API URL from .env ---
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [tests, setTests] = useState([]);
  const [resources, setResources] = useState([]); // New State
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token'); 

    if (!token || storedUser.role !== 'admin') {
      navigate('/'); 
      return;
    }
    setUser(storedUser);

    // Fetch Tests & Resources in parallel
    // UPDATED: Using API_BASE_URL without adding /api (since it's in the env var)
    Promise.all([
        fetch(`${API_BASE_URL}/tests`).then(res => res.json()),
        fetch(`${API_BASE_URL}/resources`).then(res => res.json())
    ])
    .then(([testsData, resourcesData]) => {
        setTests(testsData);
        setResources(resourcesData);
        setLoading(false);
    })
    .catch(err => {
        console.error(err);
        setLoading(false);
    });
  }, [navigate, API_BASE_URL]);

  // --- REORDER LOGIC ---
  const saveOrder = async (endpoint, items) => {
     const ids = items.map(t => t._id);
     try {
        const body = endpoint.includes('tests') ? { testIds: ids } : { resourceIds: ids };
        await fetch(endpoint, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify(body)
        });
     } catch (err) { console.error("Failed to save order:", err); }
  };

  const handleMove = (list, setList, endpoint, index, direction) => {
    const newList = [...list];
    if (direction === 'up' && index > 0) {
        [newList[index], newList[index - 1]] = [newList[index - 1], newList[index]];
    } else if (direction === 'down' && index < newList.length - 1) {
        [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
    } else return;
    setList(newList);
    saveOrder(endpoint, newList);
  };

  // --- DELETE LOGIC ---
  const handleDelete = async (endpoint, id, title, list, setList) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
        const res = await fetch(`${endpoint}/${id}`, { 
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) setList(list.filter(item => item._id !== id));
    } catch (err) { alert("Server error."); }
  };

  const totalQuestions = tests.reduce((acc, test) => acc + (test.questions ? test.questions.length : 0), 0);
  
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div></div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-purple-600 text-white p-2 rounded-lg">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Admin Console</h1>
              <p className="text-xs text-slate-500">Welcome back, {user?.name}</p>
            </div>
          </div>
          <button onClick={() => { 
            localStorage.removeItem('user'); 
            localStorage.removeItem('token'); 
            window.dispatchEvent(new Event('local-storage-changed')); 
            navigate('/login'); 
          }} className="text-sm font-medium text-slate-500 hover:text-red-600 transition">
            Log Out
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        
        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div onClick={() => navigate('/admin/create-test')} className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg shadow-purple-200 cursor-pointer hover:scale-[1.02] transition-transform">
                <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg></div>
                <h3 className="text-xl font-bold mb-1">Create Test</h3>
                <p className="text-purple-100 text-xs">New assessment</p>
            </div>

            <div onClick={() => navigate('/admin/add-resource')} className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 text-white shadow-lg shadow-pink-200 cursor-pointer hover:scale-[1.02] transition-transform">
                <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></div>
                <h3 className="text-xl font-bold mb-1">Add Video</h3>
                <p className="text-pink-100 text-xs">New resource</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex justify-between items-start mb-4">
                    <div className="bg-purple-50 text-purple-600 w-10 h-10 rounded-lg flex items-center justify-center"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></div>
                    <span className="text-3xl font-bold text-slate-800">{tests.length}</span>
                </div>
                <h3 className="font-semibold text-slate-700">Active Tests</h3>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex justify-between items-start mb-4">
                    <div className="bg-emerald-50 text-emerald-600 w-10 h-10 rounded-lg flex items-center justify-center"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                    <span className="text-3xl font-bold text-slate-800">{totalQuestions}</span>
                </div>
                <h3 className="font-semibold text-slate-700">Total Questions</h3>
            </div>
        </div>

        {/* 1. ASSESSMENTS LIST */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-10">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span> Assessments
                </h3>
                <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full">{tests.length} total</span>
            </div>
            
            <div className="divide-y divide-slate-100">
                {tests.map((test, index) => (
                    <div key={test._id} className="p-4 sm:p-5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 font-bold text-sm">{index + 1}</div>
                            <div>
                                <h4 className="font-bold text-slate-800">{test.title}</h4>
                                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                    <span>{test.questions.length} Questions</span>
                                    <span>•</span>
                                    <span>{test.duration}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                             {/* UPDATED: Dynamic URLs for Reordering */}
                             <button onClick={() => handleMove(tests, setTests, `${API_BASE_URL}/tests/reorder`, index, 'up')} disabled={index === 0} className={`p-2 rounded hover:bg-slate-200 ${index === 0 ? 'text-slate-300' : 'text-slate-500'}`}><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg></button>
                             <button onClick={() => handleMove(tests, setTests, `${API_BASE_URL}/tests/reorder`, index, 'down')} disabled={index === tests.length - 1} className={`p-2 rounded hover:bg-slate-200 ${index === tests.length - 1 ? 'text-slate-300' : 'text-slate-500'}`}><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg></button>
                             <div className="h-6 w-px bg-slate-200 mx-1"></div>
                             <button onClick={() => navigate(`/admin/edit-test/${test._id}`)} className="p-2 text-purple-500 hover:bg-purple-50 rounded"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                             
                             {/* UPDATED: Dynamic URL for Delete */}
                             <button onClick={() => handleDelete(`${API_BASE_URL}/tests`, test._id, test.title, tests, setTests)} className="p-2 text-red-500 hover:bg-red-50 rounded"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* 2. LEARNING RESOURCES LIST (NEW) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pink-500"></span> Learning Resources
                </h3>
                <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full">{resources.length} total</span>
            </div>
            
            <div className="divide-y divide-slate-100">
                {resources.length === 0 ? (
                      <div className="p-8 text-center text-slate-400">No videos added yet.</div>
                ) : resources.map((item, index) => (
                    <div key={item._id} className="p-4 sm:p-5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 font-bold text-sm">{index + 1}</div>
                            <div>
                                <h4 className="font-bold text-slate-800">{item.title}</h4>
                                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{item.category}</span>
                                    <a href={item.url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline truncate max-w-[200px]">{item.url}</a>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                             {/* UPDATED: Dynamic URLs for Reordering */}
                             <button onClick={() => handleMove(resources, setResources, `${API_BASE_URL}/resources/reorder`, index, 'up')} disabled={index === 0} className={`p-2 rounded hover:bg-slate-200 ${index === 0 ? 'text-slate-300' : 'text-slate-500'}`}><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg></button>
                             <button onClick={() => handleMove(resources, setResources, `${API_BASE_URL}/resources/reorder`, index, 'down')} disabled={index === resources.length - 1} className={`p-2 rounded hover:bg-slate-200 ${index === resources.length - 1 ? 'text-slate-300' : 'text-slate-500'}`}><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg></button>
                             <div className="h-6 w-px bg-slate-200 mx-1"></div>
                             <button onClick={() => navigate(`/admin/edit-resource/${item._id}`)} className="p-2 text-purple-500 hover:bg-purple-50 rounded"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                             
                             {/* UPDATED: Dynamic URL for Delete */}
                             <button onClick={() => handleDelete(`${API_BASE_URL}/resources`, item._id, item.title, resources, setResources)} className="p-2 text-red-500 hover:bg-red-50 rounded"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
