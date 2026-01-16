// src/pages/Admin/AdminEnrollments.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, User, BookOpen, ArrowLeft, Clock } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminEnrollments = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${API_BASE_URL}/courses/admin/enrollments`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const data = await res.json();
            setRequests(data);
        }
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    const token = localStorage.getItem('token');
    try {
        // Optimistic UI update: Remove it from the list immediately
        setRequests(requests.filter(req => req._id !== id));

        const res = await fetch(`${API_BASE_URL}/courses/admin/enrollments/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ status })
        });

        if (res.ok) {
            // Optional: Show a toast notification here
            console.log(`Request ${status}`);
        } else {
            // If failed, revert the list (optional complexity, usually not needed for simple admins)
            alert("Action failed on server.");
            fetchEnrollments(); 
        }
    } catch (err) {
        console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center gap-4">
            <button onClick={() => navigate('/admin')} className="p-2 hover:bg-slate-100 rounded-full transition">
                <ArrowLeft className="text-slate-500" />
            </button>
            <div>
                <h1 className="text-xl font-bold text-slate-900">Course Enrollments</h1>
                <p className="text-xs text-slate-500">Manage student access requests</p>
            </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        
        {loading ? (
             <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div></div>
        ) : requests.length === 0 ? (
             <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
                <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-800">All Caught Up!</h3>
                <p className="text-slate-500">There are no pending enrollment requests.</p>
             </div>
        ) : (
            <div className="space-y-4">
                {requests.map((req) => (
                    <div key={req._id} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 animate-fade-in">
                        
                        {/* Student & Course Info */}
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
                                <User size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg">{req.student?.name || "Unknown Student"}</h3>
                                <p className="text-slate-500 text-sm mb-2">{req.student?.email}</p>
                                
                                <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-bold border border-purple-100">
                                    <BookOpen size={12} />
                                    Is requesting access to: {req.course?.title}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => handleAction(req._id, 'rejected')}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition"
                            >
                                <X size={18} /> Reject
                            </button>
                            <button 
                                onClick={() => handleAction(req._id, 'approved')}
                                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-slate-900 text-white font-bold hover:bg-green-600 shadow-lg hover:shadow-green-200 transition transform active:scale-95"
                            >
                                <Check size={18} /> Approve
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminEnrollments;