// src/pages/Courses/CourseCatalog.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Clock, User, Lock, PlayCircle, CheckCircle, AlertCircle, Globe } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CourseCatalog = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [enrollmentMap, setEnrollmentMap] = useState({}); // Stores status by courseId
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      // 1. Fetch All Courses
      const coursesRes = await fetch(`${API_BASE_URL}/courses`);
      const coursesData = await coursesRes.json();
      setCourses(coursesData);

      // 2. Fetch My Enrollment Statuses (If logged in)
      if (token && user.id) {
          const statusRes = await fetch(`${API_BASE_URL}/courses/student/status`, {
              headers: { 
                  'Authorization': `Bearer ${token}`,
                  'x-user-id': user.id 
              }
          });
          if (statusRes.ok) {
              const statusData = await statusRes.json();
              // Convert array to map: { "courseId1": "approved", "courseId2": "pending" }
              const map = {};
              statusData.forEach(item => {
                  map[item.course] = item.status;
              });
              setEnrollmentMap(map);
          }
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    const token = localStorage.getItem('token');
    if (!token) {
        navigate('/login');
        return;
    }
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    try {
        const res = await fetch(`${API_BASE_URL}/courses/${courseId}/enroll`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ userId: user.id })
        });

        if (res.ok) {
            const data = await res.json();
            
            // Update map with the actual status returned (approved or pending)
            setEnrollmentMap(prev => ({ ...prev, [courseId]: data.status }));

            if (data.status === 'approved') {
                alert("Enrolled Successfully! You can start learning immediately.");
                navigate(`/courses/${courseId}/learn`);
            } else {
                alert("Request Sent! Waiting for Admin approval.");
            }
        } else {
            const err = await res.json();
            alert(err.message);
        }
    } catch (err) {
        console.error(err);
    }
  };

  const filteredCourses = courses.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()));

  // Helper to render the correct button
  const renderButton = (course) => {
      const status = enrollmentMap[course._id]; // 'approved', 'pending', 'rejected', or undefined

      if (status === 'approved') {
          return (
            <button 
                onClick={() => navigate(`/courses/${course._id}/learn`)}
                className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200"
            >
                Enter Class <PlayCircle size={16} />
            </button>
          );
      } else if (status === 'pending') {
          return (
            <button 
                disabled
                className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-yellow-100 text-yellow-700 cursor-not-allowed border border-yellow-200"
            >
                <Clock size={16} /> Request Pending
            </button>
          );
      } else if (status === 'rejected') {
          return (
            <button 
                disabled
                className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-red-100 text-red-600 cursor-not-allowed border border-red-200"
            >
                <AlertCircle size={16} /> Access Denied
            </button>
          );
      } else {
          // --- NOT ENROLLED YET ---
          
          // Check if Public
          if (course.isPublic) {
              return (
                <button 
                    onClick={() => handleEnroll(course._id)}
                    className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                >
                    Start Learning <Globe size={16} />
                </button>
              );
          }

          // Private Course
          return (
            <button 
                onClick={() => handleEnroll(course._id)}
                className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors bg-slate-900 text-white hover:bg-purple-600"
            >
                Request Access <Lock size={16} />
            </button>
          );
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-20 px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Course Library</h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">Master new skills with our structured learning paths.</p>
          
          <div className="max-w-xl mx-auto mt-8 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search courses..." 
                className="w-full pl-12 pr-4 py-4 rounded-full bg-white/10 border border-white/20 backdrop-blur-md focus:outline-none focus:bg-white/20 transition text-white placeholder-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
             <div className="text-center py-20">Loading courses...</div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map(course => (
                    <div key={course._id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 group flex flex-col">
                        <div className="h-48 bg-slate-200 relative overflow-hidden">
                            {course.thumbnail ? (
                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
                                    <BookOpen size={48} opacity={0.5} />
                                </div>
                            )}
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide text-slate-800 shadow-sm">
                                {course.difficulty}
                            </div>
                            
                            {/* Public Badge overlay */}
                            {course.isPublic && (
                                <div className="absolute top-4 left-4 bg-indigo-500/90 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                    <Globe size={12} /> Public
                                </div>
                            )}
                        </div>
                        
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="text-xs text-purple-600 font-bold uppercase tracking-wider mb-2">{course.category}</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">{course.title}</h3>
                            <p className="text-slate-500 text-sm line-clamp-2 mb-6 flex-1">{course.description}</p>
                            
                            <div className="flex items-center gap-4 text-xs text-slate-400 mb-6 border-t border-slate-100 pt-4">
                                <div className="flex items-center gap-1"><User size={14} /> <span>{course.enrolledCount || 0} Students</span></div>
                                <div className="flex items-center gap-1"><Clock size={14} /> <span>{course.modules?.length || 0} Modules</span></div>
                            </div>

                            {/* DYNAMIC BUTTON */}
                            {renderButton(course)}
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default CourseCatalog;