// src/pages/Admin/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    User, Mail, Clock, Calendar, BookOpen, 
    TrendingUp, Award, PlayCircle, CheckCircle, 
    ChevronRight, BarChart2, ChevronDown, ChevronUp, FileText,
    Download, Eye, EyeOff, Lock // <--- Added EyeOff
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [testHistory, setTestHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [expandedCourseId, setExpandedCourseId] = useState(null);

  const [stats, setStats] = useState({
      coursesInProgress: 0,
      coursesCompleted: 0,
      totalQuizzesTaken: 0,
      avgScore: 0
  });

  // --- PASSWORD MODAL STATE ---
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passData, setPassData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passMessage, setPassMessage] = useState({ type: '', text: '' });
  const [passLoading, setPassLoading] = useState(false);

  // --- PASSWORD VISIBILITY STATE ---
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }

        try {
            const userRes = await fetch(`${API_BASE_URL}/users/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const user = await userRes.json();
            setUserData(user);

            const coursesRes = await fetch(`${API_BASE_URL}/courses/student/my-courses`, {
                headers: { 'x-user-id': user._id, 'Authorization': `Bearer ${token}` }
            });
            const coursesData = coursesRes.ok ? await coursesRes.json() : [];
            setEnrollments(coursesData);

            const resultsRes = await fetch(`${API_BASE_URL}/results/user/${user._id}`);
            const resultsData = resultsRes.ok ? await resultsRes.json() : [];
            setTestHistory(resultsData);

            calculateUnifiedStats(coursesData, resultsData);

        } catch (err) {
            console.error("Dashboard Load Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    fetchDashboardData();
  }, [navigate]);

  const calculateUnifiedStats = (courses, tests) => {
      const completed = courses.filter(e => (e.courseProgress || 0) >= 100).length;
      const inProgress = courses.length - completed;
      let totalScores = 0;
      let count = 0;
      tests.forEach(t => { totalScores += t.percentage; count++; });
      courses.forEach(c => {
          if (c.quizScores) {
              c.quizScores.forEach(q => { totalScores += q.percentage; count++; });
          }
      });
      setStats({
          coursesInProgress: inProgress,
          coursesCompleted: completed,
          totalQuizzesTaken: count,
          avgScore: count > 0 ? Math.round(totalScores / count) : 0
      });
  };

  const handleExport = () => {
      const headers = ["Type,Item,Category,Details,Status,Date"];
      const rows = [];

      // 1. Courses
      enrollments.forEach(e => {
          rows.push(`"Course","${e.course.title}","${e.course.category}","Progress: ${e.courseProgress}%","${e.courseProgress >= 100 ? 'Completed' : 'In Progress'}","${new Date(e.lastActive).toLocaleDateString()}"`);
      });

      // 2. Standalone Assessments
      testHistory.forEach(t => {
           rows.push(`"Assessment","${t.testTitle}","${t.category || 'General'}","Score: ${t.score}/${t.totalQuestions} (${t.percentage}%)","${t.percentage >= 50 ? 'Passed' : 'Failed'}","${new Date(t.createdAt).toLocaleDateString()}"`);
      });

      // 3. Course Quizzes
      enrollments.forEach(e => {
          if(e.quizScores) {
              e.quizScores.forEach(q => {
                  rows.push(`"Course Quiz","${q.lessonTitle} (in ${e.course.title})","${e.course.category}","Score: ${q.score}/${q.totalQuestions} (${q.percentage}%)","${q.passed ? 'Passed' : 'Failed'}","${new Date(q.attemptedAt).toLocaleDateString()}"`);
              });
          }
      });

      if (rows.length === 0) return alert("No data to export.");

      const csvContent = [headers, ...rows].join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'my_learning_report.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  // --- PASSWORD HANDLER ---
  const handlePasswordUpdate = async (e) => {
      e.preventDefault();
      setPassMessage({ type: '', text: '' });

      if (passData.newPassword !== passData.confirmPassword) {
          return setPassMessage({ type: 'error', text: "New passwords do not match." });
      }
      if (passData.newPassword.length < 6) {
          return setPassMessage({ type: 'error', text: "Password must be at least 6 characters." });
      }

      setPassLoading(true);
      try {
          const token = localStorage.getItem('token');
          const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
              method: 'PUT',
              headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` 
              },
              body: JSON.stringify({ 
                  currentPassword: passData.currentPassword,
                  newPassword: passData.newPassword 
              })
          });

          const data = await res.json();
          if (res.ok) {
              setPassMessage({ type: 'success', text: "Password updated successfully!" });
              setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
              // Reset visibility
              setShowCurrent(false);
              setShowNew(false);
              setShowConfirm(false);
              
              setTimeout(() => {
                  setShowPasswordModal(false);
                  setPassMessage({ type: '', text: '' });
              }, 2000);
          } else {
              setPassMessage({ type: 'error', text: data.message || "Failed to update password." });
          }
      } catch (err) {
          setPassMessage({ type: 'error', text: "Server error. Please try again." });
      } finally {
          setPassLoading(false);
      }
  };

  // --- NAVIGATION HELPERS ---
  const handleViewQuiz = (quizData, courseId, courseTitle) => {
      navigate('/admin/quiz-result', {
          state: {
              quizData: quizData,
              courseId: courseId,
              courseTitle: courseTitle,
              studentName: userData?.name 
          }
      });
  };

  const handleViewTest = (resultData) => {
      navigate('/admin/test-result', {
          state: {
              resultData: resultData,
              studentName: userData?.name
          }
      });
  };

  const getRecentActivity = () => {
      const activities = [];
      testHistory.forEach(t => {
          activities.push({
              id: t._id, 
              type: 'Assessment', 
              title: t.testTitle, 
              category: t.category || 'General',
              date: new Date(t.createdAt), 
              score: t.score, 
              total: t.totalQuestions, 
              percentage: t.percentage, 
              context: 'Standalone',
              rawResultData: t 
          });
      });
      enrollments.forEach(e => {
          if (e.quizScores) {
              e.quizScores.forEach(q => {
                  activities.push({
                      id: `${e._id}-${q.lessonId}`, 
                      type: 'Course Quiz', 
                      title: q.lessonTitle, 
                      category: e.course.category,
                      date: new Date(q.attemptedAt), 
                      score: q.score, 
                      total: q.totalQuestions, 
                      percentage: q.percentage, 
                      context: e.course.title,
                      rawQuizData: q,
                      courseId: e.course._id,
                      courseTitle: e.course.title
                  });
              });
          }
      });
      return activities.sort((a, b) => b.date - a.date).slice(0, 5); 
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (percentage >= 50) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const toggleExpand = (id) => {
      setExpandedCourseId(expandedCourseId === id ? null : id);
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-slate-50"><div className="animate-pulse text-slate-400 font-bold">Loading Dashboard...</div></div>;

  const recentActivity = getRecentActivity();

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-800 relative">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* === HEADER === */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100 to-indigo-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/4"></div>
            <div className="relative z-10 w-20 h-20 md:w-24 md:h-24 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-purple-200">
                <span className="text-3xl font-bold">{userData?.name?.charAt(0)}</span>
            </div>
            <div className="text-center md:text-left flex-1 relative z-10">
                <h1 className="text-3xl font-bold text-slate-900">Welcome back, {userData?.name}!</h1>
                <div className="flex items-center justify-center md:justify-start gap-4 text-slate-500 mt-2 text-sm font-medium">
                    <span className="flex items-center gap-1.5"><Mail size={14} /> {userData?.email}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="flex items-center gap-1.5"><Award size={14} /> Student</span>
                </div>
            </div>
            
            {/* Action Group */}
            <div className="flex flex-col items-end gap-3 relative z-10">
                <div className="flex gap-4">
                    <div className="bg-white/50 backdrop-blur border border-slate-100 p-4 rounded-2xl text-center min-w-[100px]">
                        <div className="text-2xl font-bold text-slate-800">{stats.coursesInProgress}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Courses</div>
                    </div>
                    <div className="bg-white/50 backdrop-blur border border-slate-100 p-4 rounded-2xl text-center min-w-[100px]">
                        <div className="text-2xl font-bold text-emerald-600">{stats.avgScore}%</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Score</div>
                    </div>
                </div>
                
                {/* Buttons Row */}
                <div className="flex gap-2">
                    <button 
                        onClick={() => setShowPasswordModal(true)}
                        className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-white text-slate-600 hover:text-purple-600 hover:border-purple-200 text-xs font-bold rounded-xl transition shadow-sm border border-slate-100"
                    >
                        <Lock size={14} /> Change Password
                    </button>
                    <button 
                        onClick={handleExport}
                        className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-slate-900 text-white hover:bg-purple-600 text-xs font-bold rounded-xl transition shadow-md shadow-purple-100"
                    >
                        <Download size={14} /> Export My Report
                    </button>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ... (Main Content Layout - Unchanged) ... */}
            {/* === LEFT COL: MY COURSES === */}
            <div className="lg:col-span-2 space-y-6">
                <div className="flex justify-between items-end">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <BookOpen size={20} className="text-purple-600" /> My Learning
                    </h2>
                    <button onClick={() => navigate('/courses')} className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1">
                        Browse Library <ChevronRight size={14} />
                    </button>
                </div>

                {enrollments.length > 0 ? (
                    <div className="flex flex-col gap-5">
                        {enrollments.map(enrollment => {
                            const isExpanded = expandedCourseId === enrollment._id;
                            return (
                                <div key={enrollment._id} className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-purple-200 shadow-md' : 'border-slate-100 shadow-sm'}`}>
                                    {/* Card Header */}
                                    <div className="p-5 flex flex-col md:flex-row gap-5 items-start">
                                        <div className="w-full md:w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                                            {enrollment.course.thumbnail ? (
                                                <img src={enrollment.course.thumbnail} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-400"><BookOpen size={24} /></div>
                                            )}
                                        </div>
                                        
                                        <div className="flex-1 w-full">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{enrollment.course.category}</div>
                                                    <h3 className="font-bold text-slate-900 text-lg mb-1">{enrollment.course.title}</h3>
                                                </div>
                                                <button onClick={() => toggleExpand(enrollment._id)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
                                                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-4 mt-2">
                                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full ${enrollment.courseProgress >= 100 ? 'bg-emerald-500' : 'bg-purple-500'}`} style={{ width: `${enrollment.courseProgress}%` }} />
                                                </div>
                                                <span className="text-xs font-bold text-slate-600 min-w-[3rem] text-right">{enrollment.courseProgress}%</span>
                                            </div>
                                            
                                            <div className="flex gap-3 mt-4">
                                                <button 
                                                    onClick={() => navigate(`/courses/${enrollment.course._id}/learn`)}
                                                    className="flex-1 py-2 bg-slate-900 text-white hover:bg-purple-700 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                                                >
                                                    {enrollment.courseProgress >= 100 ? 'Review Course' : 'Continue Learning'} <PlayCircle size={14} />
                                                </button>
                                                <button 
                                                    onClick={() => toggleExpand(enrollment._id)}
                                                    className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold rounded-lg transition-colors"
                                                >
                                                    {isExpanded ? 'Hide Details' : 'View Details'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* EXPANDABLE DETAILS */}
                                    {isExpanded && (
                                        <div className="border-t border-slate-100 bg-slate-50/50 p-6 animate-in fade-in slide-in-from-top-2">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                
                                                {/* MODULE PROGRESS */}
                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Module Progress</h4>
                                                    <div className="space-y-3">
                                                        {enrollment.moduleProgress && enrollment.moduleProgress.length > 0 ? (
                                                            enrollment.moduleProgress.map((mod, i) => (
                                                                <div key={i} className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                                                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                                                                        <span>{mod.moduleTitle}</span>
                                                                        <span className={mod.percentage >= 100 ? "text-emerald-600" : "text-slate-500"}>{mod.percentage}%</span>
                                                                    </div>
                                                                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                                                                        <div className={`h-full rounded-full transition-all ${mod.percentage >= 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${mod.percentage}%` }} />
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="text-xs text-slate-400 italic">No module data available.</div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* QUIZ SCORES */}
                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quiz Performance</h4>
                                                    <div className="space-y-2">
                                                        {enrollment.quizScores && enrollment.quizScores.length > 0 ? (
                                                            enrollment.quizScores.map((quiz, i) => (
                                                                <div 
                                                                    key={i} 
                                                                    onClick={() => handleViewQuiz(quiz, enrollment.course._id, enrollment.course.title)}
                                                                    className="flex justify-between items-center p-2 rounded hover:bg-white transition-colors cursor-pointer group"
                                                                >
                                                                    <div className="flex items-center gap-2 overflow-hidden">
                                                                        <div className={`w-2 h-2 rounded-full shrink-0 ${quiz.passed ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                                                        <span className="text-xs font-medium text-slate-700 truncate group-hover:text-purple-700" title={quiz.lessonTitle}>{quiz.lessonTitle}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-3 shrink-0">
                                                                        <span className="text-xs text-slate-400">{quiz.score}/{quiz.totalQuestions}</span>
                                                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getScoreColor(quiz.percentage)}`}>
                                                                            {quiz.percentage}%
                                                                        </span>
                                                                        <Eye size={12} className="text-slate-300 group-hover:text-purple-500" />
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="text-xs text-slate-400 italic p-2 border border-dashed border-slate-200 rounded">No quizzes taken yet.</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400"><BookOpen size={32} /></div>
                        <h3 className="text-slate-800 font-bold mb-2">No courses yet</h3>
                        <p className="text-slate-500 text-sm mb-6">Start your learning journey today.</p>
                        <button onClick={() => navigate('/courses')} className="px-6 py-2 bg-purple-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-purple-200 hover:bg-purple-700 transition">Explore Catalog</button>
                    </div>
                )}
            </div>

            {/* === RIGHT COL: PERFORMANCE === */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <TrendingUp size={20} className="text-emerald-500" /> Recent Activity
                </h2>
                
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    {recentActivity.length > 0 ? (
                        <div className="divide-y divide-slate-50">
                            {recentActivity.map((activity, idx) => (
                                <div 
                                    key={idx} 
                                    onClick={() => {
                                        if (activity.type === 'Course Quiz') handleViewQuiz(activity.rawQuizData, activity.courseId, activity.courseTitle);
                                        if (activity.type === 'Assessment') handleViewTest(activity.rawResultData);
                                    }}
                                    className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group"
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wide ${activity.type === 'Assessment' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'}`}>
                                                    {activity.type}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                                                    <Calendar size={10} /> {activity.date.toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h4 className="font-bold text-slate-800 text-sm group-hover:text-purple-700 transition-colors">{activity.title}</h4>
                                            {activity.context !== 'Standalone' && (
                                                <p className="text-xs text-slate-400 mt-0.5">in {activity.context}</p>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <div className={`px-2 py-1 rounded-md text-xs font-bold border ${getScoreColor(activity.percentage)}`}>
                                                {activity.percentage}%
                                            </div>
                                            <Eye size={12} className="text-slate-300 group-hover:text-purple-500" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-slate-400 text-sm">
                            No quiz activity recorded yet.
                        </div>
                    )}
                </div>

                {/* Performance Summary Card */}
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full blur-2xl opacity-50 -mr-10 -mt-10"></div>
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-900">
                        <BarChart2 size={18} className="text-purple-600" /> Statistics
                    </h3>
                    <div className="space-y-4 relative z-10">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-sm font-medium">Total Quizzes</span>
                            <span className="font-bold text-slate-800">{stats.totalQuizzesTaken}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-sm font-medium">Courses Completed</span>
                            <span className="font-bold text-emerald-600">{stats.coursesCompleted}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1 mt-2">
                            <div className="bg-purple-500 h-full rounded-full" style={{ width: `${stats.avgScore}%` }}></div>
                        </div>
                        <div className="text-center text-xs text-slate-500 mt-2">
                            You are averaging <span className="text-slate-900 font-bold">{stats.avgScore}%</span> across all assessments.
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </div>

      {/* --- CHANGE PASSWORD MODAL --- */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Lock size={20} className="text-purple-600" /> Change Password
                </h3>
                
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    
                    {/* Current Password */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Current Password</label>
                        <div className="relative">
                            <input 
                                type={showCurrent ? "text" : "password"} 
                                required
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-50 transition-all text-sm pr-10"
                                value={passData.currentPassword}
                                onChange={(e) => setPassData({...passData, currentPassword: e.target.value})}
                            />
                            <button 
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600"
                            >
                                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">New Password</label>
                        <div className="relative">
                            <input 
                                type={showNew ? "text" : "password"} 
                                required
                                minLength={6}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-50 transition-all text-sm pr-10"
                                value={passData.newPassword}
                                onChange={(e) => setPassData({...passData, newPassword: e.target.value})}
                            />
                            <button 
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600"
                            >
                                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Confirm New Password</label>
                        <div className="relative">
                            <input 
                                type={showConfirm ? "text" : "password"} 
                                required
                                minLength={6}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-50 transition-all text-sm pr-10"
                                value={passData.confirmPassword}
                                onChange={(e) => setPassData({...passData, confirmPassword: e.target.value})}
                            />
                            <button 
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600"
                            >
                                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {passMessage.text && (
                        <div className={`text-xs font-bold p-3 rounded-lg text-center ${passMessage.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                            {passMessage.text}
                        </div>
                    )}

                    <div className="flex gap-3 mt-6">
                        <button 
                            type="button" 
                            onClick={() => { 
                                setShowPasswordModal(false); 
                                setPassMessage({type:'', text:''}); 
                                setPassData({currentPassword:'', newPassword:'', confirmPassword:''}); 
                                setShowCurrent(false);
                                setShowNew(false);
                                setShowConfirm(false);
                            }}
                            className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors text-sm"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={passLoading}
                            className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {passLoading ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;