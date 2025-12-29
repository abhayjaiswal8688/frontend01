// src/pages/Admin/AddResource.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const AddResource = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Check if we have an ID (Edit Mode)
    const isEditMode = !!id;
    
    // --- CONFIG: Get API URL from .env ---
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const [formData, setFormData] = useState({ title: '', url: '', category: 'General' });
    const [status, setStatus] = useState({ loading: false, error: '', success: '' });

    // Fetch data if editing
    useEffect(() => {
        if (isEditMode) {
            // UPDATED: Use API_BASE_URL
            fetch(`${API_BASE_URL}/resources/${id}`)
                .then(res => res.json())
                .then(data => setFormData({ title: data.title, url: data.url, category: data.category }))
                .catch(err => console.error(err));
        }
    }, [id, isEditMode, API_BASE_URL]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: '', success: '' });
        const token = localStorage.getItem('token');

        try {
            // UPDATED: Use API_BASE_URL
            const url = isEditMode 
                ? `${API_BASE_URL}/resources/${id}` 
                : `${API_BASE_URL}/resources`;
            
            const method = isEditMode ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setStatus({ loading: false, error: '', success: `Video ${isEditMode ? 'updated' : 'added'} successfully!` });
                setTimeout(() => navigate('/admin'), 1000);
            } else {
                setStatus({ loading: false, error: 'Operation failed.', success: '' });
            }
        } catch (err) {
            setStatus({ loading: false, error: 'Server connection failed.', success: '' });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6 flex justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl h-fit border-2 border-purple-400">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">{isEditMode ? 'Edit Resource' : 'Add Resource'}</h2>
                <p className="text-slate-500 mb-8">Curate content for the community.</p>

                {status.error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">{status.error}</div>}
                {status.success && <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg">{status.success}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div>
                        <label className="block text-slate-700 font-bold mb-2">Video Title</label>
                        <input 
                            type="text" required
                            className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                            placeholder="e.g. Understanding Anxiety"
                            value={formData.title} 
                            onChange={e => setFormData({...formData, title: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-slate-700 font-bold mb-2">YouTube URL</label>
                        <input 
                            type="url" required
                            className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                            placeholder="https://www.youtube.com/watch?v=..."
                            value={formData.url} 
                            onChange={e => setFormData({...formData, url: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-slate-700 font-bold mb-2">Category</label>
                        <select 
                            className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                            value={formData.category}
                            onChange={e => setFormData({...formData, category: e.target.value})}
                        >
                            <option>General</option>
                            <option>Mental Health</option>
                            <option>Self-Awareness</option>
                            <option>Productivity</option>
                            <option>Mindfulness</option>
                            <option>Community</option>
                            <option>Oncology</option>
                            <option>Research</option>
                        </select>
                    </div>
                    <div className="flex gap-4 mt-4">
                        <button type="button" onClick={() => navigate('/admin')} className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition">Cancel</button>
                        <button type="submit" disabled={status.loading} className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-lg transition">
                            {status.loading ? 'Saving...' : (isEditMode ? 'Update Video' : 'Add Video')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddResource;
