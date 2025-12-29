// src/pages/Test.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Search, Clock, HelpCircle, ArrowRight, CheckCircle, RotateCcw, LayoutDashboard, X, ChevronLeft, ChevronRight, Trophy, AlertTriangle, Maximize, Minimize, Sparkles } from 'lucide-react';

// Define the API URL based on the environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const Test = () => {
  const [availableTests, setAvailableTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTest, setActiveTest] = useState(null); 
  const [searchQuery, setSearchQuery] = useState("");
  
  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  // --- TIMER STATE ---
  const [timeLeft, setTimeLeft] = useState(null); 

  // --- FULLSCREEN STATE ---
  const [isFullscreen, setIsFullscreen] = useState(false);
  const quizContainerRef = useRef(null);

  useEffect(() => {
    fetchTests();

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // --- TIMER LOGIC ---
  useEffect(() => {
    if (!activeTest || showResult || timeLeft === null) return;

    if (timeLeft === 0) {
        calculateScore(); 
        return;
    }

    const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, activeTest, showResult]);

  // --- HELPERS ---
  const parseDurationToSeconds = (durationStr) => {
    if (!durationStr) return 900; 
    let totalSeconds = 0;
    const hrMatch = durationStr.match(/(\d+)\s*hr/);
    if (hrMatch) totalSeconds += parseInt(hrMatch[1]) * 3600;
    const minMatch = durationStr.match(/(\d+)\s*min/);
    if (minMatch) totalSeconds += parseInt(minMatch[1]) * 60;
    return totalSeconds > 0 ? totalSeconds : 900; 
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
        if (quizContainerRef.current) {
            quizContainerRef.current.requestFullscreen().catch(err => {
                console.error(`Error enabling full-screen mode: ${err.message}`);
            });
        }
    } else {
        document.exitFullscreen();
    }
  };

  const fetchTests = async () => {
    try {
      // ✅ UPDATED: Uses API_BASE_URL
      const response = await fetch(`${API_BASE_URL}/api/tests`);
      if (response.ok) {
        const data = await response.json();
        setAvailableTests(data);
      }
    } catch (error) {
      console.error("Error connecting to backend:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = async (testId) => {
    setLoading(true);
    try {
      // ✅ UPDATED: Uses API_BASE_URL
      const response = await fetch(`${API_BASE_URL}/api/tests/${testId}`);
      if (response.ok) {
        const fullTestData = await response.json();
        setActiveTest(fullTestData);
        
        const seconds = parseDurationToSeconds(fullTestData.duration);
        setTimeLeft(seconds);

        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setShowResult(false);
        setScore(0);
      }
    } catch (error) {
      console.error("Error loading test details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    setActiveTest(null);
    setTimeLeft(null);
    fetchTests(); 
  };

  const handleOptionSelect = (optionIndex) => setUserAnswers({ ...userAnswers, [currentQuestionIndex]: optionIndex });
  
  const handleNext = () => {
    if (currentQuestionIndex < activeTest.questions.length - 1) setCurrentQuestionIndex(currentQuestionIndex + 1);
    else calculateScore();
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1);
  };
  
  const calculateScore = () => {
    let newScore = 0;
    activeTest.questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctOptionIndex) newScore += 1;
    });
    setScore(newScore);
    setShowResult(true);
  };

  const getIcon = (iconName) => {
    switch (iconName) {
        case 'psychology': return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
        case 'community': return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
        case 'oncology': return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
        case 'child': return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
        case 'research': return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
        case 'nursing': return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>;
        default: return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
    }
  };

  const getGradient = (index) => {
    const gradients = ["from-blue-400 to-cyan-300", "from-purple-400 to-pink-300", "from-emerald-400 to-teal-300", "from-orange-400 to-amber-300"];
    return gradients[index % gradients.length];
  };

  const filteredTests = availableTests.filter(test => 
    test.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-x-hidden font-sans selection:bg-purple-200">
      
      {/* Background blobs - hidden in quiz mode to avoid distractions */}
      {!activeTest && (
        <div className="fixed inset-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-300/30 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-rose-300/30 rounded-full blur-[120px]" />
        </div>
      )}

      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-12">
          
          {!activeTest ? (
            <>
              {/* --- DASHBOARD VIEW --- */}
              {/* UPDATED: Centered Header with Sparkles (Matching Resource.jsx) */}
              <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/50 text-purple-900 text-sm font-bold mb-4">
                      <Sparkles size={16} />
                      <span>Self Discovery</span>
                  </div>
                  <h1 className="text-5xl font-bold text-slate-900 mb-4 font-serif">
                    Assessment Library
                  </h1>
                  <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                    Explore our curated collection of assessments designed to help you understand your emotional and mental strengths.
                  </p>
              </div>

              {/* Search Bar - Added mx-auto to center it */}
              <div className="relative mb-8 max-w-lg mx-auto">
                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                   <Search className="h-5 w-5 text-slate-500" />
                 </div>
                 <input 
                   type="text"
                   className="block w-full pl-11 pr-4 py-4 bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl leading-5 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white/60 shadow-sm transition-all duration-300"
                   placeholder="Search topics (e.g. Mental Health)..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTests.length === 0 ? (
                   <div className="col-span-full text-center py-20">
                     <div className="inline-flex justify-center items-center w-16 h-16 bg-white/50 rounded-full mb-4">
                        <Search className="w-8 h-8 text-slate-400" />
                     </div>
                     <p className="text-slate-500 text-lg">{availableTests.length === 0 ? "No tests available." : "No tests match your search."}</p>
                   </div>
                ) : filteredTests.map((test, index) => (
                  <div key={test._id} className="group relative bg-white/50 backdrop-blur-md rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-purple-900/10 border border-white/60 transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden">
                    <div className={`h-1.5 w-full bg-gradient-to-r ${getGradient(index)} opacity-80`} />
                    
                    <div className="p-8 flex-1">
                      <div className="flex justify-between items-start mb-6">
                        <div className={`p-3.5 rounded-2xl bg-white/80 shadow-sm text-slate-700 border border-white group-hover:scale-110 transition-transform duration-300`}>
                           {getIcon(test.icon)}
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-purple-700 transition-colors">
                        {test.title}
                      </h3>
                      
                      <div className="flex items-center gap-6 text-sm font-medium text-slate-500 mt-6">
                        <div className="flex items-center gap-1.5">
                          <HelpCircle className="w-4 h-4 text-purple-400" />
                          {test.questions ? test.questions.length : 0} Questions
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-pink-400" />
                          {test.duration ? test.duration : "15 mins"} 
                        </div>
                      </div>
                    </div>

                    <div className="p-8 pt-0 mt-auto">
                      <button 
                        onClick={() => handleStartTest(test._id)} 
                        className="w-full py-3.5 px-4 bg-slate-900/90 hover:bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:shadow-purple-500/20 transition-all duration-300 flex justify-center items-center group-hover:gap-2"
                      >
                        Start Quiz
                        <ArrowRight className="w-0 h-4 group-hover:w-4 transition-all duration-300 opacity-0 group-hover:opacity-100" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            // --- ACTIVE QUIZ VIEW ---
            <div className="flex flex-col items-center justify-center min-h-[70vh]">
                
              {/* THE QUIZ CARD (Wrapped in Ref) */}
              <div 
                ref={quizContainerRef}
                className={`w-full overflow-hidden relative flex flex-col transition-all duration-300 ${
                  isFullscreen 
                  ? 'h-full bg-indigo-50 fixed inset-0 z-50 rounded-none' // Fullscreen styles
                  : 'max-w-3xl bg-white/60 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/50' // Default styles
                }`}
              >
                
                {/* HEADER */}
                <div className="bg-slate-900 p-6 md:p-8 text-white flex justify-between items-center relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-slate-900 opacity-50" />
                    
                    <div className="relative z-10 flex-1">
                        <h1 className="text-xl md:text-2xl font-bold tracking-tight mb-1">{activeTest.title}</h1>
                        {!showResult && (
                             <div className="flex items-center gap-4 text-slate-300 font-medium text-sm">
                                <span>Question {currentQuestionIndex + 1} of {activeTest.questions.length}</span>
                             </div>
                        )}
                    </div>

                    {/* CONTROLS: Timer + Fullscreen + Close */}
                    <div className="relative z-10 flex items-center gap-2">
                        
                        {/* 1. Timer */}
                        {!showResult && (
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg shadow-inner transition-colors duration-300 ${
                                timeLeft < 60 ? 'bg-red-500/20 text-red-300 animate-pulse border border-red-500/50' : 'bg-white/10 text-white border border-white/10'
                            }`}>
                                {timeLeft < 60 && <AlertTriangle size={18} />}
                                <Clock size={18} className={timeLeft >= 60 ? "text-purple-300" : ""} />
                                <span>{formatTime(timeLeft)}</span>
                            </div>
                        )}
                        
                        {/* 2. Fullscreen Toggle */}
                        <button 
                            onClick={toggleFullScreen}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white/80 hover:text-white"
                            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                        >
                            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                        </button>

                        {/* 3. Exit Quiz */}
                        <button 
                            onClick={handleBackToList} 
                            className="p-2 ml-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white/80 hover:text-white"
                            title="Exit Quiz"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* PROGRESS BAR */}
                {!showResult && (
                    <div className="w-full bg-white/50 h-1.5 shrink-0">
                        <div 
                            className="bg-gradient-to-r from-purple-600 to-pink-500 h-1.5 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
                            style={{ width: `${((currentQuestionIndex + 1) / activeTest.questions.length) * 100}%` }}
                        />
                    </div>
                )}

                {/* CONTENT AREA (Scrollable in fullscreen) */}
                <div className={`p-8 md:p-10 flex-1 overflow-y-auto ${isFullscreen ? 'flex flex-col justify-center max-w-5xl mx-auto w-full' : ''}`}>
                  {showResult ? (
                    <div className="text-center py-6">
                      <div className="mb-8 relative inline-block">
                          <div className="absolute inset-0 bg-green-200 rounded-full blur-xl opacity-40 animate-pulse" />
                          <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-50 rounded-full shadow-inner border border-green-200">
                             <Trophy className="w-12 h-12 text-green-600" />
                          </div>
                      </div>
                      
                      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Test Completed!</h2>
                      <p className="text-slate-500 mb-10 text-lg">Here is your performance summary</p>
                      
                      <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mb-12">
                        <div className="p-5 bg-white/60 rounded-2xl border border-white w-32 shadow-sm">
                            <p className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-1">Total</p>
                            <p className="text-3xl font-bold text-slate-800">{activeTest.questions.length}</p>
                        </div>
                        <div className="p-5 bg-green-50/60 rounded-2xl border border-green-100 w-32 shadow-sm">
                            <p className="text-green-600 text-xs uppercase tracking-wider font-bold mb-1">Score</p>
                            <p className="text-3xl font-bold text-green-700">{score}</p>
                        </div>
                        <div className="p-5 bg-purple-50/60 rounded-2xl border border-purple-100 w-32 shadow-sm">
                            <p className="text-purple-600 text-xs uppercase tracking-wider font-bold mb-1">Accuracy</p>
                            <p className="text-3xl font-bold text-purple-700">{Math.round((score / activeTest.questions.length) * 100)}%</p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-center gap-4">
                          <button 
                            onClick={handleBackToList} 
                            className="flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-white hover:border-slate-300 transition-all"
                          >
                             <LayoutDashboard size={18} />
                             Dashboard
                          </button>
                          <button 
                            onClick={() => { setShowResult(false); setCurrentQuestionIndex(0); setScore(0); setUserAnswers({}); handleStartTest(activeTest._id); }} 
                            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl"
                          >
                             <RotateCcw size={18} />
                             Retake Test
                          </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-snug">
                        {activeTest.questions[currentQuestionIndex].questionText}
                      </h3>
                      
                      <div className="space-y-4">
                        {activeTest.questions[currentQuestionIndex].options.map((option, index) => {
                          const isSelected = userAnswers[currentQuestionIndex] === index;
                          return (
                            <div 
                                key={index} 
                                onClick={() => handleOptionSelect(index)} 
                                className={`group flex items-center p-4 md:p-5 border-2 rounded-2xl cursor-pointer transition-all duration-200 relative overflow-hidden ${
                                    isSelected 
                                    ? 'border-purple-500 bg-purple-50/60 shadow-md' 
                                    : 'border-slate-100 bg-white/40 hover:border-purple-200 hover:bg-white/70'
                                }`}
                            >
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-5 shrink-0 transition-colors ${
                                  isSelected ? 'border-purple-600 bg-purple-600' : 'border-slate-300 group-hover:border-purple-400'
                              }`}>
                                  {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                              </div>
                              <span className={`text-lg ${isSelected ? 'text-purple-900 font-semibold' : 'text-slate-600 group-hover:text-slate-900'}`}>
                                {option}
                              </span>
                            </div>
                          )
                        })}
                      </div>

                      <div className="flex justify-between items-center mt-12 pt-8 border-t border-slate-200/60">
                        <button 
                            onClick={handlePrevious} 
                            disabled={currentQuestionIndex === 0} 
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-colors ${
                                currentQuestionIndex === 0 
                                ? 'text-slate-400 cursor-not-allowed' 
                                : 'text-slate-500 hover:bg-white/50 hover:text-slate-800'
                            }`}
                        >
                            <ChevronLeft size={20} />
                            Previous
                        </button>
                        <button 
                            onClick={handleNext} 
                            className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-slate-800 shadow-lg hover:shadow-purple-500/20 transition-all transform active:scale-95"
                        >
                            {currentQuestionIndex === activeTest.questions.length - 1 ? 'Finish Test' : 'Next Question'}
                            {currentQuestionIndex !== activeTest.questions.length - 1 && <ChevronRight size={20} />}
                            {currentQuestionIndex === activeTest.questions.length - 1 && <CheckCircle size={20} />}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Test;
