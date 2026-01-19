// src/pages/Admin/StudentDetails.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
    User, Mail, ArrowLeft, BookOpen, TrendingUp, Award, 
    Calendar, CheckCircle, BarChart2, ChevronDown, ChevronUp, 
    Trash2, AlertTriangle, X, Download, Eye 
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const StudentDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const location = useLocation();
  
  const initialStudentInfo = location.state?.student || null;

  const [studentInfo, setStudentInfo] = useState(initialStudentInfo);
  const [enrollments, setEnrollments] = useState([]);
  const [testHistory, setTestHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCourseId, setExpandedCourseId] = useState(null);

  const [deleteModal, setDeleteModal] = useState({ open: false, item: null });
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const [stats, setStats] = useState({
      coursesInProgress: 0, coursesCompleted: 0, totalQuizzesTaken: 0, avgScore: 0
  });

  useEffect(() => {
    fetchData();
  }, [id, navigate]);

  const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      try {
          const coursesRes = await fetch(`${API_BASE_URL}/courses/student/my-courses`, {
              headers: { 'Authorization': `Bearer ${token}`, 'x-user-id': id }
          });
          const coursesData = coursesRes.ok ? await coursesRes.json() : [];
          setEnrollments(coursesData);

          const resultsRes = await fetch(`${API_BASE_URL}/results/user/${id}`);
          const resultsData = resultsRes.ok ? await resultsRes.json() : [];
          setTestHistory(resultsData);

          calculateUnifiedStats(coursesData, resultsData);
      } catch (err) { console.error(err); } 
      finally { setIsLoading(false); }
  };

  const calculateUnifiedStats = (courses, tests) => {
      const completed = courses.filter(e => (e.courseProgress || 0) >= 100).length;
      const inProgress = courses.length - completed;
      let totalScores = 0;
      let count = 0;
      tests.forEach(t => { totalScores += t.percentage; count++; });
      courses.forEach(c => {
          if (c.quizScores) c.quizScores.forEach(q => { totalScores += q.percentage; count++; });
      });
      setStats({
          coursesInProgress: inProgress,
          coursesCompleted: completed,
          totalQuizzesTaken: count,
          avgScore: count > 0 ? Math.round(totalScores / count) : 0
      });
  };

  const handleUnenroll = async () => {
      const courseId = deleteModal.item?.course._id;
      const token = localStorage.getItem('token');
      
      try {
          const res = await fetch(`${API_BASE_URL}/courses/${courseId}/enroll/${id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
              setEnrollments(prev => prev.filter(e => e.course._id !== courseId));
              setDeleteModal({ open: false, item: null });
              setDeleteConfirmation('');
          } else { alert("Failed to unenroll student."); }
      } catch (err) { console.error(err); }
  };

  const handleExport = () => {
      const headers = ["Type,Item,Category,Details,Status,Date"];
      const rows = [];
      enrollments.forEach(e => {
          rows.push(`"Course","${e.course.title}","${e.course.category}","Progress: ${e.courseProgress}%","${e.courseProgress >= 100 ? 'Completed' : 'In Progress'}","${new Date(e.lastActive).toLocaleDateString()}"`);
      });
      testHistory.forEach(t => {
           rows.push(`"Assessment","${t.testTitle}","${t.category || 'General'}","Score: ${t.score}/${t.totalQuestions} (${t.percentage}%)","${t.percentage >= 50 ? 'Passed' : 'Failed'}","${new Date(t.createdAt).toLocaleDateString()}"`);
      });
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
      link.setAttribute('download', `${studentInfo?.name || 'student'}_report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  // --- NAVIGATION HELPERS ---
  const handleViewQuiz = (quizData, courseId, courseTitle) => {
      navigate('/admin/quiz-result', {
          state: {
              quizData: quizData,
              courseId: courseId,
              courseTitle: courseTitle,
              studentName: studentInfo?.name
          }
      });
  };

  const handleViewTest = (resultData) => {
      navigate('/admin/test-result', {
          state: {
              resultData: resultData,
              studentName: studentInfo?.name
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
              
              // DATA FOR NAV
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
                      
                      // DATA FOR NAV
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

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-slate-50"><div className="animate-pulse text-slate-400 font-bold">Loading Student Profile...</div></div>;

  const recentActivity = getRecentActivity();

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-800 relative">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation Bar */}
        <div className="flex justify-between items-center">
            <button onClick={() => navigate('/admin/analytics')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold transition">
                <ArrowLeft size={20} /> Back to Analytics
            </button>
            <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-white text-black cursor-pointer hover:bg-black hover:text-white rounded-lg text-sm font-bold transition">
                <Download size={16} /> Export Report
            </button>
        </div>

        {/* Profile Card (Unchanged) */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/4"></div>
            <div className="relative z-10 w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-3xl font-bold">{studentInfo?.name?.charAt(0) || <User />}</span>
            </div>
            <div className="text-center md:text-left flex-1 relative z-10">
                <h1 className="text-3xl font-bold text-slate-900">{studentInfo?.name || "Student Profile"}</h1>
                <div className="flex items-center justify-center md:justify-start gap-4 text-slate-500 mt-2 text-sm font-medium">
                    <span className="flex items-center gap-1.5"><Mail size={14} /> {studentInfo?.email || "Email hidden"}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="flex items-center gap-1.5"><Award size={14} /> Student</span>
                </div>
            </div>
            <div className="flex gap-4 relative z-10">
                <div className="bg-white/50 backdrop-blur border border-slate-100 p-4 rounded-2xl text-center min-w-[100px]">
                    <div className="text-2xl font-bold text-slate-800">{stats.coursesCompleted}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed</div>
                </div>
                <div className="bg-white/50 backdrop-blur border border-slate-100 p-4 rounded-2xl text-center min-w-[100px]">
                    <div className="text-2xl font-bold text-emerald-600">{stats.avgScore}%</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Score</div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <BookOpen size={20} className="text-indigo-600" /> Enrolled Courses
                </h2>

                {enrollments.length > 0 ? (
                    <div className="flex flex-col gap-5">
                        {enrollments.map(enrollment => {
                            const isExpanded = expandedCourseId === enrollment._id;
                            return (
                                <div key={enrollment._id} className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-indigo-200 shadow-md' : 'border-slate-100 shadow-sm'}`}>
                                    <div className="p-5 flex flex-col md:flex-row gap-5 items-start">
                                        <div className="w-full md:w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                                            {enrollment.course.thumbnail ? (
                                                <img src={enrollment.course.thumbnail} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-400"><BookOpen size={24} /></div>
                                            )}
                                        </div>
                                        <div className="flex-1 w-full">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{enrollment.course.category}</div>
                                                    <h3 className="font-bold text-slate-900 text-lg mb-1">{enrollment.course.title}</h3>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => { setDeleteModal({ open: true, item: enrollment }); }} className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors" title="Unenroll Student"><Trash2 size={18} /></button>
                                                    <button onClick={() => setExpandedCourseId(isExpanded ? null : enrollment._id)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
                                                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 mt-2">
                                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full ${enrollment.courseProgress >= 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${enrollment.courseProgress}%` }} />
                                                </div>
                                                <span className="text-xs font-bold text-slate-600 min-w-[3rem] text-right">{enrollment.courseProgress}%</span>
                                            </div>
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className="border-t border-slate-100 bg-slate-50/50 p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Module Progress</h4>
                                                    <div className="space-y-3">
                                                        {enrollment.moduleProgress?.map((mod, i) => (
                                                            <div key={i} className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                                                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                                                                    <span>{mod.moduleTitle}</span><span className={mod.percentage >= 100 ? "text-emerald-600" : "text-slate-500"}>{mod.percentage}%</span>
                                                                </div>
                                                                <div className="w-full bg-slate-100 rounded-full h-1.5">
                                                                    <div className={`h-full rounded-full transition-all ${mod.percentage >= 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${mod.percentage}%` }} />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                
                                                {/* QUIZ PERFORMANCE LIST */}
                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quiz Performance</h4>
                                                    <div className="space-y-2">
                                                        {enrollment.quizScores?.map((quiz, i) => (
                                                            <div 
                                                                key={i} 
                                                                onClick={() => handleViewQuiz(quiz, enrollment.course._id, enrollment.course.title)}
                                                                className="flex justify-between items-center p-2 rounded-lg bg-white border border-transparent hover:border-slate-200 hover:shadow-sm cursor-pointer transition-all group"
                                                            >
                                                                <div className="flex items-center gap-2 overflow-hidden">
                                                                    <div className="p-1 rounded bg-slate-50 text-slate-400 group-hover:text-indigo-600 transition-colors"><Eye size={14} /></div>
                                                                    <span className="text-xs font-medium text-slate-700 truncate group-hover:text-indigo-900">{quiz.lessonTitle}</span>
                                                                </div>
                                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getScoreColor(quiz.percentage)}`}>{quiz.percentage}%</span>
                                                            </div>
                                                        ))}
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
                    <div className="p-8 text-center text-slate-400 border border-dashed border-slate-300 rounded-2xl">No enrolled courses.</div>
                )}
            </div>

            {/* Stats Sidebar */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <TrendingUp size={20} className="text-emerald-500" /> Recent Activity
                </h2>
                
                {/* RECENT ACTIVITY LIST - UPDATED */}
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
                                    className={`p-4 transition-colors cursor-pointer hover:bg-slate-50 group`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wide ${activity.type === 'Assessment' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'}`}>{activity.type}</span>
                                                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1"><Calendar size={10} /> {activity.date.toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <h4 className={`font-bold text-sm text-slate-800 group-hover:text-indigo-700`}>
                                                    {activity.title}
                                                </h4>
                                                <Eye size={12} className="text-slate-300 group-hover:text-indigo-500" />
                                            </div>
                                        </div>
                                        <div className={`px-2 py-1 rounded-md text-xs font-bold border ${getScoreColor(activity.percentage)}`}>{activity.percentage}%</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-slate-400 text-sm">No activity recorded.</div>
                    )}
                </div>

                {/* Overall Stats Chart (Unchanged) */}
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full blur-2xl opacity-50 -mr-10 -mt-10"></div>
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-900"><BarChart2 size={18} className="text-indigo-600" /> Overall Stats</h3>
                    <div className="space-y-4 relative z-10">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-sm font-medium">Total Quizzes</span><span className="font-bold text-slate-800">{stats.totalQuizzesTaken}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-sm font-medium">Courses Completed</span><span className="font-bold text-emerald-600">{stats.coursesCompleted}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1 mt-2">
                            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${stats.avgScore}%` }}></div>
                        </div>
                        <div className="text-center text-xs text-slate-500 mt-2">Averaging <span className="text-slate-900 font-bold">{stats.avgScore}%</span> score.</div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Unenroll Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-red-100 transform transition-all scale-100 relative">
                 <button onClick={() => setDeleteModal({ open: false, item: null })} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20} /></button>
                 <div className="flex items-center gap-3 text-red-600 mb-4">
                    <div className="p-3 bg-red-50 rounded-full"><AlertTriangle size={24} /></div>
                    <h3 className="text-xl font-bold">Unenroll Student?</h3>
                 </div>
                 <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    This will remove <strong>{studentInfo?.name}</strong> from <strong>"{deleteModal.item?.course.title}"</strong>. Their progress data for this course will be permanently deleted.
                 </p>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                    Type <span className="select-all text-red-600 font-mono border border-red-100 bg-red-50 px-1.5 py-0.5 rounded">remove</span> to confirm:
                 </label>
                 <input type="text" value={deleteConfirmation} onChange={(e) => setDeleteConfirmation(e.target.value)} className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 mb-6 font-medium text-slate-700 transition-all" placeholder="remove" autoFocus />
                 <div className="flex gap-3">
                    <button onClick={() => setDeleteModal({ open: false, item: null })} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                    <button onClick={handleUnenroll} disabled={deleteConfirmation !== 'remove'} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-200 transition-all">Unenroll</button>
                 </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default StudentDetails;