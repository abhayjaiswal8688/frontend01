// src/pages/Admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, FileText, Video, Users, BarChart2, 
    Layers, Trash2, Edit2, ChevronUp, ChevronDown, BookOpen, 
    HelpCircle, TrendingUp, AlertTriangle, X 
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [tests, setTests] = useState([]);
  const [courses, setCourses] = useState([]); 
  const [resources, setResources] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // --- DELETE MODAL STATE ---
  const [deleteModal, setDeleteModal] = useState({ 
      open: false, 
      item: null, // { id, title, endpoint, list, setList }
      type: ''    // 'course' or 'other'
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token'); 

    if (!token || storedUser.role !== 'admin') {
      navigate('/'); 
      return;
    }
    setUser(storedUser);

    Promise.all([
        fetch(`${API_BASE_URL}/tests`).then(res => res.json()),
        fetch(`${API_BASE_URL}/resources`).then(res => res.json()),
        fetch(`${API_BASE_URL}/courses`).then(res => res.json()) 
    ])
    .then(([testsData, resourcesData, coursesData]) => {
        setTests(testsData || []);
        setResources(resourcesData || []);
        setCourses(coursesData || []);
        setLoading(false);
    })
    .catch(err => {
        console.error(err);
        setLoading(false);
    });
  }, [navigate, API_BASE_URL]);

  // --- REORDER LOGIC ---
  const saveOrder = async (endpoint, items, type) => {
     const ids = items.map(t => t._id);
     try {
        let body = {};
        if (type === 'tests') body = { testIds: ids };
        else if (type === 'resources') body = { resourceIds: ids };
        else if (type === 'courses') body = { courseIds: ids };

        await fetch(endpoint, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify(body)
        });
     } catch (err) { console.error("Failed to save order:", err); }
  };

  const handleMove = (list, setList, endpoint, index, direction, type) => {
    const newList = [...list];
    if (direction === 'up' && index > 0) {
        [newList[index], newList[index - 1]] = [newList[index - 1], newList[index]];
    } else if (direction === 'down' && index < newList.length - 1) {
        [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
    } else return;
    setList(newList);
    saveOrder(endpoint, newList, type);
  };

  // --- DELETE LOGIC ---
  const initiateDelete = (endpoint, id, title, list, setList, isCourse = false) => {
    if (isCourse) {
        // OPEN MODAL FOR COURSES
        setDeleteModal({
            open: true,
            item: { id, title, endpoint, list, setList },
            type: 'course'
        });
        setDeleteConfirmation('');
    } else {
        // SIMPLE CONFIRM FOR OTHERS
        if (window.confirm(`Delete "${title}"?`)) {
            performDelete(endpoint, id, list, setList);
        }
    }
  };

  const performDelete = async (endpoint, id, list, setList) => {
    try {
        const res = await fetch(`${endpoint}/${id}`, { 
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) {
            setList(list.filter(item => item._id !== id));
            setDeleteModal({ open: false, item: null, type: '' }); // Close modal if open
        } else {
            alert("Failed to delete. Please try again.");
        }
    } catch (err) { alert("Server error."); }
  };

  const totalEnrollments = courses.reduce((acc, course) => acc + (course.enrolledCount || 0), 0);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div></div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans relative">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-purple-600 text-white p-2 rounded-lg">
              <LayoutDashboard size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Admin Console</h1>
              <p className="text-xs text-slate-500">Welcome back, {user?.name}</p>
            </div>
          </div>
          <button onClick={() => { 
            localStorage.removeItem('user'); localStorage.removeItem('token'); window.dispatchEvent(new Event('local-storage-changed')); navigate('/login'); 
          }} className="text-sm font-medium text-slate-500 hover:text-red-600 transition">Log Out</button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        
        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div onClick={() => navigate('/admin/create-test')} className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg shadow-purple-200 cursor-pointer hover:scale-[1.02] transition-transform">
                <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm"><FileText /></div>
                <h3 className="text-xl font-bold mb-1">Create Test</h3>
                <p className="text-purple-100 text-xs">New assessment</p>
            </div>
            
            <div onClick={() => navigate('/admin/add-resource')} className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 text-white shadow-lg shadow-pink-200 cursor-pointer hover:scale-[1.02] transition-transform">
                <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm"><Video /></div>
                <h3 className="text-xl font-bold mb-1">Add Video</h3>
                <p className="text-pink-100 text-xs">New resource</p>
            </div>

            <div onClick={() => navigate('/admin/create-course')} className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg shadow-orange-200 cursor-pointer hover:scale-[1.02] transition-transform">
                <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm"><Layers /></div>
                <h3 className="text-xl font-bold mb-1">New Course</h3>
                <p className="text-orange-100 text-xs">Build curriculum</p>
            </div>

            <div onClick={() => navigate('/admin/enrollments')} className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-200 cursor-pointer hover:scale-[1.02] transition-transform">
                <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm"><Users /></div>
                <h3 className="text-xl font-bold mb-1">Enrollments</h3>
                <p className="text-emerald-100 text-xs">Approve requests</p>
            </div>

            <div onClick={() => navigate('/admin/results')} className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200 cursor-pointer hover:scale-[1.02] transition-transform">
                <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm"><BarChart2 /></div>
                <h3 className="text-xl font-bold mb-1">Test Results</h3>
                <p className="text-blue-100 text-xs">Standalone scores</p>
            </div>

            <div onClick={() => navigate('/admin/analytics')} className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200 cursor-pointer hover:scale-[1.02] transition-transform">
                <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm"><TrendingUp /></div>
                <h3 className="text-xl font-bold mb-1">Student Progress</h3>
                <p className="text-indigo-100 text-xs">Course analytics</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex justify-between items-start mb-4">
                    <div className="bg-amber-50 text-amber-600 w-10 h-10 rounded-lg flex items-center justify-center"><BookOpen size={20} /></div>
                    <span className="text-3xl font-bold text-slate-800">{courses.length}</span>
                </div>
                <h3 className="font-semibold text-slate-700">Active Courses</h3>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex justify-between items-start mb-4">
                    <div className="bg-emerald-50 text-emerald-600 w-10 h-10 rounded-lg flex items-center justify-center"><Users size={20} /></div>
                    <span className="text-3xl font-bold text-slate-800">{totalEnrollments}</span>
                </div>
                <h3 className="font-semibold text-slate-700">Total Enrollments</h3>
            </div>
        </div>

        {/* 1. COURSES LIST */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-10">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                    <BookOpen size={20} className="text-amber-500" /> Courses & Curriculum
                </h3>
                <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full">{courses.length} total</span>
            </div>
            
            <div className="divide-y divide-slate-100">
                {courses.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">No courses created yet.</div>
                ) : courses.map((course, index) => (
                    <div key={course._id} className="p-4 sm:p-5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 font-bold text-sm">{index + 1}</div>
                            <div>
                                <h4 className="font-bold text-slate-800">{course.title}</h4>
                                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{course.modules.length} Modules</span>
                                    <span>•</span>
                                    <span>{course.difficulty}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                             <button onClick={() => handleMove(courses, setCourses, `${API_BASE_URL}/courses/reorder/all`, index, 'up', 'courses')} disabled={index === 0} className={`p-2 rounded hover:bg-slate-200 ${index === 0 ? 'text-slate-300' : 'text-slate-500'}`}><ChevronUp size={18} /></button>
                             <button onClick={() => handleMove(courses, setCourses, `${API_BASE_URL}/courses/reorder/all`, index, 'down', 'courses')} disabled={index === courses.length - 1} className={`p-2 rounded hover:bg-slate-200 ${index === courses.length - 1 ? 'text-slate-300' : 'text-slate-500'}`}><ChevronDown size={18} /></button>
                             <div className="h-6 w-px bg-slate-200 mx-1"></div>
                             <button onClick={() => navigate(`/admin/edit-course/${course._id}`)} className="p-2 text-purple-500 hover:bg-purple-50 rounded" title="Edit Course"><Edit2 size={18} /></button>
                             
                             {/* UPDATED: DELETE BUTTON TRIGGERS MODAL */}
                             <button onClick={() => initiateDelete(`${API_BASE_URL}/courses`, course._id, course.title, courses, setCourses, true)} className="p-2 text-red-500 hover:bg-red-50 rounded" title="Delete Course"><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* 2. ASSESSMENTS LIST */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-10">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                    <FileText size={20} className="text-purple-500" /> Assessments
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
                             <button onClick={() => handleMove(tests, setTests, `${API_BASE_URL}/tests/reorder`, index, 'up', 'tests')} disabled={index === 0} className={`p-2 rounded hover:bg-slate-200 ${index === 0 ? 'text-slate-300' : 'text-slate-500'}`}><ChevronUp size={18} /></button>
                             <button onClick={() => handleMove(tests, setTests, `${API_BASE_URL}/tests/reorder`, index, 'down', 'tests')} disabled={index === tests.length - 1} className={`p-2 rounded hover:bg-slate-200 ${index === tests.length - 1 ? 'text-slate-300' : 'text-slate-500'}`}><ChevronDown size={18} /></button>
                             <div className="h-6 w-px bg-slate-200 mx-1"></div>
                             <button onClick={() => navigate(`/admin/edit-test/${test._id}`)} className="p-2 text-purple-500 hover:bg-purple-50 rounded"><Edit2 size={18} /></button>
                             <button onClick={() => initiateDelete(`${API_BASE_URL}/tests`, test._id, test.title, tests, setTests)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* 3. LEARNING RESOURCES LIST */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                    <Video size={20} className="text-pink-500" /> Learning Resources
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
                             <button onClick={() => handleMove(resources, setResources, `${API_BASE_URL}/resources/reorder`, index, 'up', 'resources')} disabled={index === 0} className={`p-2 rounded hover:bg-slate-200 ${index === 0 ? 'text-slate-300' : 'text-slate-500'}`}><ChevronUp size={18} /></button>
                             <button onClick={() => handleMove(resources, setResources, `${API_BASE_URL}/resources/reorder`, index, 'down', 'resources')} disabled={index === resources.length - 1} className={`p-2 rounded hover:bg-slate-200 ${index === resources.length - 1 ? 'text-slate-300' : 'text-slate-500'}`}><ChevronDown size={18} /></button>
                             <div className="h-6 w-px bg-slate-200 mx-1"></div>
                             <button onClick={() => navigate(`/admin/edit-resource/${item._id}`)} className="p-2 text-purple-500 hover:bg-purple-50 rounded"><Edit2 size={18} /></button>
                             <button onClick={() => initiateDelete(`${API_BASE_URL}/resources`, item._id, item.title, resources, setResources)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-red-100 transform transition-all scale-100 relative">
                 <button onClick={() => setDeleteModal({ open: false, item: null, type: '' })} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20} /></button>
                 
                 <div className="flex items-center gap-3 text-red-600 mb-4">
                    <div className="p-3 bg-red-50 rounded-full"><AlertTriangle size={24} /></div>
                    <h3 className="text-xl font-bold">Delete Course?</h3>
                 </div>
                 
                 <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    This action cannot be undone. This will permanently delete 
                    <span className="font-bold text-slate-900 block mt-1 text-base">"{deleteModal.item?.title}"</span>
                    along with all its modules, lessons, and all student progress data associated with it.
                 </p>
                 
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                    Type <span className="select-all text-red-600 font-mono border border-red-100 bg-red-50 px-1.5 py-0.5 rounded">delete {deleteModal.item?.title}</span> to confirm:
                 </label>
                 
                 <input 
                    type="text" 
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 mb-6 font-medium text-slate-700 placeholder-slate-300 transition-all"
                    placeholder={`delete ${deleteModal.item?.title}`}
                    autoFocus
                 />
                 
                 <div className="flex gap-3">
                    <button 
                        onClick={() => setDeleteModal({ open: false, item: null, type: '' })}
                        className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => performDelete(deleteModal.item.endpoint, deleteModal.item.id, deleteModal.item.list, deleteModal.item.setList)}
                        disabled={deleteConfirmation !== `delete ${deleteModal.item?.title}`}
                        className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-200 transition-all"
                    >
                        Delete Course
                    </button>
                 </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;