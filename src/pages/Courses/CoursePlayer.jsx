// src/pages/Courses/CoursePlayer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    PlayCircle, FileText, Lock, Menu, ChevronLeft, ChevronRight, 
    CheckCircle, Trophy, Circle, HelpCircle, Clock, AlertTriangle, 
    Maximize, Minimize, Square, CheckSquare, MessageSquare 
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CoursePlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null); 
  
  // State for tracking
  const [completedLessons, setCompletedLessons] = useState([]); 
  const [courseProgress, setCourseProgress] = useState(0); 
  
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // --- TIMER & FULLSCREEN STATE ---
  const [timeLeft, setTimeLeft] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerContainerRef = useRef(null);

  // --- QUIZ STATE (Updated) ---
  const [quizState, setQuizState] = useState({ 
      currentIndex: 0, 
      answers: {},        // { 0: [1], 1: [0, 2] } -> Stores indices
      reasoning: {},      // { 0: "Because X...", 1: "Reason Y..." } -> Stores text
      score: null, 
      showResult: false 
  });

  // --- INITIAL FETCH ---
  useEffect(() => {
    const fetchCourseDetails = async () => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        try {
            const res = await fetch(`${API_BASE_URL}/courses/${id}`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'x-user-id': user.id 
                } 
            });
            
            if (res.ok) {
                const data = await res.json();
                setCourse(data.course);
                setStatus(data.enrollmentStatus);
                if (data.enrollment) {
                    setCompletedLessons(data.enrollment.progress || []);
                    setCourseProgress(data.enrollment.courseProgress || 0);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    fetchCourseDetails();
  }, [id]);

  // --- RESET STATE ON LESSON CHANGE ---
  useEffect(() => {
    setQuizState({ currentIndex: 0, answers: {}, reasoning: {}, score: null, showResult: false });
    const currentLesson = course?.modules[activeModuleIndex]?.lessons[activeLessonIndex];
    if (currentLesson?.type === 'quiz') {
        const seconds = parseDurationToSeconds(currentLesson.duration || "10 mins");
        setTimeLeft(seconds);
    } else {
        setTimeLeft(null);
    }
  }, [activeLessonIndex, activeModuleIndex, course]);

  // --- TIMER COUNTDOWN ---
  useEffect(() => {
    if (timeLeft === null || timeLeft < 0 || quizState.showResult) return;
    if (timeLeft === 0) {
        submitQuiz(); 
        return;
    }
    const timerId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, quizState.showResult]);

  // --- FULLSCREEN LISTENER ---
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // --- HELPERS ---
  const isYouTube = (url) => url && (url.includes('youtube.com') || url.includes('youtu.be'));
  
  const getEmbedUrl = (url) => {
    if (!url) return '';
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[7].length === 11) {
        return `https://www.youtube.com/embed/${match[7]}?rel=0&modestbranding=1`;
    }
    return url;
  };

  const parseDurationToSeconds = (durationStr) => {
    if (!durationStr) return 600; 
    let totalSeconds = 0;
    const hrMatch = durationStr.match(/(\d+)\s*hr/);
    if (hrMatch) totalSeconds += parseInt(hrMatch[1]) * 3600;
    const minMatch = durationStr.match(/(\d+)\s*min/);
    if (minMatch) totalSeconds += parseInt(minMatch[1]) * 60;
    return totalSeconds > 0 ? totalSeconds : 600; 
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
        if (playerContainerRef.current) {
            playerContainerRef.current.requestFullscreen().catch(err => {
                console.error(err);
            });
        }
    } else {
        document.exitFullscreen();
    }
  };

  // --- SAVE PROGRESS (Generic) ---
  const saveProgressToBackend = async (lessonId, moduleId, type, quizData = null) => {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      try {
          const res = await fetch(`${API_BASE_URL}/courses/${id}/update-lesson-progress`, {
              method: 'POST',
              headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` 
              },
              body: JSON.stringify({ 
                  userId: user.id, 
                  lessonId, 
                  moduleId,
                  type,
                  quizData 
              })
          });

          if (res.ok) {
              const data = await res.json();
              setCompletedLessons(data.progress); 
              setCourseProgress(data.courseProgress); 
          }
      } catch (err) {
          console.error("Failed to save progress", err);
      }
  };

  // --- HANDLE LESSON COMPLETION ---
  const handleMarkComplete = async () => {
      const currentModule = course.modules[activeModuleIndex];
      const currentLesson = currentModule.lessons[activeLessonIndex];
      const isCurrentlyCompleted = completedLessons.includes(currentLesson._id);

      if (isCurrentlyCompleted) return; 

      await saveProgressToBackend(currentLesson._id, currentModule._id, currentLesson.type);
  };

  const handleNext = () => {
      const isLastLessonInModule = activeLessonIndex === course.modules[activeModuleIndex].lessons.length - 1;
      const isLastModule = activeModuleIndex === course.modules.length - 1;

      if (!isLastLessonInModule) {
          setActiveLessonIndex(prev => prev + 1);
      } else if (!isLastModule) {
          setActiveModuleIndex(prev => prev + 1);
          setActiveLessonIndex(0);
      } else {
          navigate('/courses');
      }
  };

  const handlePrev = () => {
      if(activeLessonIndex > 0) setActiveLessonIndex(prev => prev - 1);
      else if(activeModuleIndex > 0) {
          setActiveModuleIndex(prev => prev - 1);
          setActiveLessonIndex(course.modules[activeModuleIndex - 1].lessons.length - 1);
      }
  };

  // --- QUIZ HANDLERS ---
  const handleQuizOptionSelect = (optionIdx) => {
      const currentLesson = course.modules[activeModuleIndex].lessons[activeLessonIndex];
      const currentQuestion = currentLesson.questions[quizState.currentIndex];
      const isMultiple = currentQuestion.type === 'multiple';

      setQuizState(prev => {
          const currentAnswers = prev.answers[prev.currentIndex] || [];
          let newAnswers;
          if (isMultiple) {
              if (currentAnswers.includes(optionIdx)) {
                  newAnswers = currentAnswers.filter(i => i !== optionIdx);
              } else {
                  newAnswers = [...currentAnswers, optionIdx];
              }
          } else {
              newAnswers = [optionIdx];
          }
          return { ...prev, answers: { ...prev.answers, [prev.currentIndex]: newAnswers } };
      });
  };

  const handleReasoningChange = (e) => {
      const val = e.target.value;
      setQuizState(prev => ({
          ...prev,
          reasoning: { ...prev.reasoning, [prev.currentIndex]: val }
      }));
  };

  // --- UPDATED: SUBMIT QUIZ WITH DETAILS ---
  const submitQuiz = async () => {
      const currentModule = course.modules[activeModuleIndex];
      const currentLesson = currentModule.lessons[activeLessonIndex];
      let correctCount = 0;
      
      // 1. Calculate Results and Build Response Data
      const responses = currentLesson.questions.map((q, idx) => {
          const userAnswers = quizState.answers[idx] || [];
          const userReasoning = quizState.reasoning[idx] || "";
          
          const correctIndices = q.correctOptionIndices && q.correctOptionIndices.length > 0 
              ? q.correctOptionIndices 
              : [q.correctOptionIndex]; 

          const sortedUser = [...userAnswers].sort((a, b) => a - b);
          const sortedCorrect = [...correctIndices].sort((a, b) => a - b);

          const isCorrect = sortedUser.length === sortedCorrect.length && 
              sortedUser.every((val, i) => val === sortedCorrect[i]);
          
          if (isCorrect) correctCount++;

          return {
              questionText: q.questionText,
              selectedOptionIndices: userAnswers,
              reasoning: userReasoning,
              isCorrect: isCorrect
          };
      });

      setQuizState(prev => ({ ...prev, score: correctCount, showResult: true }));
      setTimeLeft(null); 
      
      const passed = (correctCount / currentLesson.questions.length) >= 0.5;

      // 2. Send detailed data to backend
      await saveProgressToBackend(
          currentLesson._id, 
          currentModule._id, 
          'quiz', 
          { 
              score: correctCount, 
              totalQuestions: currentLesson.questions.length, 
              passed,
              responses // <--- Sending detailed responses
          }
      );
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-900 text-white font-medium animate-pulse">Loading Classroom...</div>;

  if (status !== 'approved') return <div className="text-center p-20">Access Restricted</div>;

  const currentModule = course.modules[activeModuleIndex];
  const currentLesson = currentModule?.lessons[activeLessonIndex];
  const isLessonCompleted = completedLessons.includes(currentLesson?._id);

  // --- CURRENT QUESTION HELPERS ---
  const currentQuestion = currentLesson?.type === 'quiz' ? currentLesson.questions[quizState.currentIndex] : null;

  return (
    <div className="h-screen flex flex-col md:flex-row bg-slate-50 font-sans overflow-hidden">
        
        {/* === SIDEBAR (Unchanged) === */}
        {!isFullscreen && (
            <div 
                className={`
                    bg-white border-r border-slate-200 flex-shrink-0 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] flex flex-col 
                    ${sidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full opacity-0 overflow-hidden'} 
                    h-full z-30 shadow-xl md:shadow-none absolute md:relative
                `}
            >
                {/* ... Sidebar Header ... */}
                <div className="p-5 border-b border-slate-100 bg-white min-w-[20rem]">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-slate-800 leading-tight pr-2">{course.title}</h3>
                        <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 text-slate-400 hover:text-slate-600"><ChevronLeft /></button>
                    </div>
                    <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
                        <span>Overall Progress</span>
                        <span>{courseProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${courseProgress}%` }} />
                    </div>
                </div>
                
                {/* ... Sidebar Modules List ... */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 min-w-[20rem] scrollbar-thin scrollbar-thumb-slate-200">
                    {course.modules.map((module, mIndex) => (
                        <div key={mIndex}>
                            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 ml-2 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>{module.title}
                            </h4>
                            <div className="space-y-1">
                                {module.lessons.map((lesson, lIndex) => {
                                    const isActive = mIndex === activeModuleIndex && lIndex === activeLessonIndex;
                                    const isCompleted = completedLessons.includes(lesson._id);
                                    return (
                                        <button 
                                            key={lIndex} 
                                            onClick={() => { setActiveModuleIndex(mIndex); setActiveLessonIndex(lIndex); }} 
                                            className={`w-full flex items-center gap-3 p-3 rounded-xl text-left text-sm transition-all duration-200 border ${isActive ? 'bg-white border-purple-200 shadow-md shadow-purple-100/50 text-purple-700 font-bold scale-[1.02] z-10' : isCompleted ? 'bg-emerald-50/80 border-emerald-100 text-emerald-700' : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-50'}`}
                                        >
                                            <div className={`flex items-center justify-center w-6 h-6 rounded-full transition-colors ${isCompleted ? 'text-emerald-500' : isActive ? 'text-purple-500' : 'text-slate-400'}`}>
                                                {isCompleted ? <CheckCircle size={18} className="fill-emerald-100" /> : (lesson.type === 'video' ? <PlayCircle size={18} /> : lesson.type === 'quiz' ? <HelpCircle size={18} /> : <FileText size={18} />)}
                                            </div>
                                            <span className="truncate flex-1">{lesson.title}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* === MAIN CONTENT === */}
        <div ref={playerContainerRef} className={`flex-1 flex flex-col h-full relative bg-slate-50/50 ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
            
            {/* Top Navigation */}
            <div className="h-16 border-b border-slate-200 flex items-center px-6 bg-white shadow-sm z-20 shrink-0">
                {!isFullscreen && (
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 -ml-2 hover:bg-slate-100 rounded-lg mr-4 text-slate-500 transition-colors">
                        <Menu size={20} />
                    </button>
                )}
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Current Lesson</span>
                    <h2 className="text-sm md:text-base font-bold text-slate-800 truncate max-w-xs md:max-w-md">
                        {currentLesson?.title || "Select a Lesson"}
                    </h2>
                </div>
                
                <div className="ml-auto flex items-center gap-3">
                    {currentLesson?.type === 'quiz' && timeLeft !== null && !quizState.showResult && (
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono font-bold text-sm transition-colors ${timeLeft < 60 ? 'bg-red-100 text-red-600 animate-pulse border border-red-200' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
                            {timeLeft < 60 && <AlertTriangle size={14} />}
                            <Clock size={14} />
                            <span>{formatTime(timeLeft)}</span>
                        </div>
                    )}

                    <button 
                        onClick={toggleFullScreen}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                    >
                        {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                    </button>

                    {!isFullscreen && (
                        <button onClick={() => navigate('/courses')} className="text-sm font-semibold text-slate-500 hover:text-red-500 transition-colors ml-2">Exit</button>
                    )}
                </div>
            </div>

            {/* Viewer */}
            <div className={`flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center ${isFullscreen ? 'justify-center bg-slate-900' : ''}`}>
                <div className={`w-full max-w-5xl bg-white rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 min-h-[50vh] ${isFullscreen ? 'h-full max-w-none rounded-none border-none shadow-none' : ''}`}>
                    
                    {currentLesson?.type === 'video' ? (
                        <div className="w-full h-full bg-black flex items-center justify-center relative group">
                            {currentLesson.contentUrl ? (
                                isYouTube(currentLesson.contentUrl) ? (
                                    <iframe 
                                        src={getEmbedUrl(currentLesson.contentUrl)}
                                        className="h-full aspect-video w-auto" 
                                        allowFullScreen 
                                        title="Lesson Video"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    />
                                ) : (
                                    <video 
                                        src={currentLesson.contentUrl} 
                                        controls 
                                        controlsList="nodownload"
                                        className="w-3/4 aspect-video h-auto"
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                )
                            ) : (
                                <div className="text-white/50 flex flex-col items-center gap-2">
                                    <PlayCircle size={48} opacity={0.5} />
                                    <span>Video URL not provided</span>
                                </div>
                            )}
                        </div>
                    ) : currentLesson?.type === 'quiz' ? (
                        <div className={`p-8 md:p-12 h-full flex flex-col overflow-y-auto ${isFullscreen ? 'bg-white' : ''}`}>
                            {quizState.showResult ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                                    <div className="mb-8 relative inline-block">
                                        <div className="absolute inset-0 bg-green-200 rounded-full blur-xl opacity-40 animate-pulse" />
                                        <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-50 rounded-full shadow-inner border border-green-200">
                                            <Trophy className="w-12 h-12 text-green-600" />
                                        </div>
                                    </div>
                                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Quiz Complete!</h2>
                                    <p className="text-slate-500 mb-8 text-lg">
                                        You scored <span className="font-bold text-purple-700 text-xl">{quizState.score}</span> out of {currentLesson.questions.length}
                                    </p>
                                    <div className="flex gap-4">
                                        <button 
                                            onClick={() => setQuizState(prev => ({ ...prev, showResult: false, currentIndex: 0, score: null, answers: {}, reasoning: {} }))}
                                            className="px-8 py-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all"
                                        >
                                            Retry Quiz
                                        </button>
                                        <button 
                                            onClick={handleNext}
                                            className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-purple-600 transition-all shadow-lg hover:shadow-purple-500/20"
                                        >
                                            Continue
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="max-w-2xl mx-auto w-full">
                                    <div className="mb-8">
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                Question {quizState.currentIndex + 1} of {currentLesson.questions.length}
                                            </span>
                                            <span className="text-xs font-bold bg-purple-100 text-purple-700 px-3 py-1 rounded-full">Quiz Mode</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                            <div 
                                                className="bg-gradient-to-r from-purple-600 to-pink-500 h-full transition-all duration-300 ease-out"
                                                style={{ width: `${((quizState.currentIndex + 1) / currentLesson.questions.length) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    
                                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 leading-snug">
                                        {currentQuestion.questionText}
                                        {currentQuestion.type === 'multiple' && (
                                            <span className="block text-sm font-normal text-slate-500 mt-2">(Select all that apply)</span>
                                        )}
                                    </h2>
                                    
                                    <div className="space-y-4 mb-8">
                                        {currentQuestion.options.map((opt, idx) => {
                                            const currentAnswers = quizState.answers[quizState.currentIndex] || [];
                                            const isSelected = currentAnswers.includes(idx);
                                            const isMultiple = currentQuestion.type === 'multiple';

                                            return (
                                                <div 
                                                    key={idx} 
                                                    onClick={() => handleQuizOptionSelect(idx)}
                                                    className={`group flex items-center p-4 md:p-5 border-2 rounded-2xl cursor-pointer transition-all duration-200 relative overflow-hidden ${
                                                        isSelected 
                                                        ? 'border-purple-500 bg-purple-50/60 shadow-md scale-[1.01]' 
                                                        : 'border-slate-100 bg-white hover:border-purple-200 hover:bg-slate-50'
                                                    }`}
                                                >
                                                    <div className={`w-6 h-6 border-2 flex items-center justify-center mr-5 shrink-0 transition-colors ${
                                                        isMultiple ? 'rounded-md' : 'rounded-full' 
                                                    } ${
                                                        isSelected ? 'border-purple-600 bg-purple-600' : 'border-slate-300 group-hover:border-purple-400'
                                                    }`}>
                                                        {isSelected && (
                                                            isMultiple 
                                                            ? <CheckSquare size={14} className="text-white" />
                                                            : <div className="w-2 h-2 bg-white rounded-full"></div>
                                                        )}
                                                    </div>
                                                    <span className={`text-lg ${isSelected ? 'text-purple-900 font-semibold' : 'text-slate-600 group-hover:text-slate-900'}`}>
                                                        {opt}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    
                                    {/* REASONING FIELD (Dynamic) */}
                                    {currentQuestion.requiresReasoning && (
                                        <div className="mb-8 animate-in fade-in slide-in-from-bottom-2">
                                            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                                <MessageSquare size={16} className="text-purple-600" />
                                                Why did you choose this answer? <span className="text-slate-400 font-normal">(Required)</span>
                                            </label>
                                            <textarea 
                                                value={quizState.reasoning[quizState.currentIndex] || ""}
                                                onChange={handleReasoningChange}
                                                className="w-full p-4 border-2 border-slate-200 rounded-xl outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-50 transition-all text-slate-700"
                                                placeholder="Type your reasoning here..."
                                                rows={3}
                                            />
                                        </div>
                                    )}
                                    
                                    <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                                        <button 
                                            disabled={quizState.currentIndex === 0}
                                            onClick={() => setQuizState(prev => ({ ...prev, currentIndex: prev.currentIndex - 1 }))}
                                            className="text-slate-500 font-bold hover:text-slate-800 disabled:opacity-30 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                                        >
                                            <ChevronLeft size={20} /> Previous
                                        </button>
                                        
                                        {quizState.currentIndex === currentLesson.questions.length - 1 ? (
                                            <button 
                                                onClick={submitQuiz}
                                                className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-purple-600 shadow-lg hover:shadow-purple-500/20 transition-all transform active:scale-95 flex items-center gap-2"
                                            >
                                                Submit Quiz <CheckCircle size={20} />
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => setQuizState(prev => ({ ...prev, currentIndex: prev.currentIndex + 1 }))}
                                                className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-slate-800 shadow-lg transition-all transform active:scale-95 flex items-center gap-2"
                                            >
                                                Next Question <ChevronRight size={20} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        // --- TEXT LESSON ---
                        <div className={`p-8 md:p-16 prose max-w-none h-full overflow-y-auto ${isFullscreen ? 'bg-white' : ''}`}>
                            <h2 className="text-3xl font-bold mb-6 text-slate-900 border-b border-slate-100 pb-4">{currentLesson?.title}</h2>
                            <div className="text-slate-600 leading-relaxed whitespace-pre-wrap text-lg">
                                {currentLesson?.textContent || "No text content available."}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* FOOTER CONTROLS */}
            <div className="bg-white p-4 border-t border-slate-200 flex justify-between items-center shrink-0 z-20">
                <button 
                    disabled={activeLessonIndex === 0 && activeModuleIndex === 0}
                    onClick={handlePrev}
                    className="flex items-center gap-2 px-5 py-2.5 cursor-pointer rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronLeft size={18} /> <span className="hidden sm:inline">Previous</span>
                </button>
                
                <button 
                    onClick={handleMarkComplete}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl cursor-pointer font-bold transition-all transform active:scale-95 ${
                        isLessonCompleted 
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                        : 'bg-white border-2 border-slate-200 text-slate-500 hover:border-purple-300 hover:text-purple-600'
                    }`}
                >
                    {isLessonCompleted ? <CheckCircle size={20} className="fill-emerald-200" /> : <Circle size={20} />}
                    <span className="hidden sm:inline">{isLessonCompleted ? 'Completed' : 'Mark Complete'}</span>
                </button>

                <button 
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 cursor-pointer py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-purple-600 shadow-lg shadow-purple-200/50 hover:shadow-purple-500/30 transition-all transform active:scale-95"
                >
                    <span className="hidden sm:inline">
                        {activeModuleIndex === course.modules.length - 1 && activeLessonIndex === currentModule.lessons.length - 1
                            ? "Finish Course"
                            : activeLessonIndex === currentModule.lessons.length - 1
                                ? "Next Module"
                                : "Next Lesson"
                        }
                    </span> 
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    </div>
  );
};

export default CoursePlayer;