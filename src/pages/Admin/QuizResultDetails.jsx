// src/pages/Admin/QuizResultDetails.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, MessageSquare, HelpCircle, Award } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const QuizResultDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // We expect these to be passed via state
    const { quizData, courseId, studentName, courseTitle } = location.state || {};

    const [loading, setLoading] = useState(true);
    const [lessonDetails, setLessonDetails] = useState(null);

    useEffect(() => {
        if (!quizData || !courseId) {
            navigate('/admin'); 
            return;
        }
        fetchCourseDetails();
    }, [courseId]);

    const fetchCourseDetails = async () => {
        try {
            // We fetch the course to get the actual text for options (since responses only store indices)
            const res = await fetch(`${API_BASE_URL}/courses/${courseId}`);
            if (res.ok) {
                const data = await res.json();
                // Find the specific lesson inside the course modules
                let foundLesson = null;
                if (data.course && data.course.modules) {
                    for (const mod of data.course.modules) {
                        const lesson = mod.lessons.find(l => l._id === quizData.lessonId);
                        if (lesson) {
                            foundLesson = lesson;
                            break;
                        }
                    }
                }
                setLessonDetails(foundLesson);
            }
        } catch (err) {
            console.error("Failed to load course details for context", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50 font-bold text-slate-400">Loading Results...</div>;

    if (!quizData) return <div>No Data Found</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-800">
            <div className="max-w-4xl mx-auto space-y-6">
                
                {/* Header */}
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold transition mb-4">
                    <ArrowLeft size={20} /> Back to Student Profile
                </button>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-center gap-6">
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Quiz Result</div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-1">{quizData.lessonTitle}</h1>
                            <p className="text-slate-500 font-medium">
                                Student: <span className="text-slate-800">{studentName}</span> • Course: <span className="text-slate-800">{courseTitle}</span>
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Score</div>
                                <div className={`text-4xl font-bold ${quizData.passed ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {quizData.score}<span className="text-xl text-slate-300">/{quizData.totalQuestions}</span>
                                </div>
                            </div>
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg ${quizData.passed ? 'bg-emerald-500 shadow-emerald-200' : 'bg-red-500 shadow-red-200'}`}>
                                <Award size={32} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Questions Review */}
                <div className="space-y-6">
                    {/* We iterate through the RESPONSES stored in the user's history.
                       We try to match them with lessonDetails (the original course content) to show option text.
                    */}
                    {quizData.responses && quizData.responses.length > 0 ? (
                        quizData.responses.map((response, index) => {
                            // Find matching question in original lesson data (by index or text match fallback)
                            // Note: Relying on index alignment is standard if questions aren't shuffled. 
                            const originalQuestion = lessonDetails?.questions?.[index];

                            return (
                                <div key={index} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                                    <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex gap-4">
                                        <span className="font-bold text-slate-300 text-xl">#{index + 1}</span>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-slate-800">{response.questionText}</h3>
                                        </div>
                                        <div className="shrink-0">
                                            {response.isCorrect ? (
                                                <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-200">
                                                    <CheckCircle size={14} /> Correct
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-bold border border-red-200">
                                                    <XCircle size={14} /> Incorrect
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-6">
                                        {/* OPTIONS GRID */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {originalQuestion?.options.map((opt, optIdx) => {
                                                const isSelected = response.selectedOptionIndices.includes(optIdx);
                                                const isActualCorrect = originalQuestion.correctOptionIndices.includes(optIdx);
                                                
                                                let styleClass = "border-slate-200 bg-white text-slate-600";
                                                
                                                if (isSelected && isActualCorrect) {
                                                    styleClass = "border-emerald-500 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500";
                                                } else if (isSelected && !isActualCorrect) {
                                                    styleClass = "border-red-400 bg-red-50 text-red-800";
                                                } else if (!isSelected && isActualCorrect) {
                                                    styleClass = "border-emerald-200 bg-emerald-50/50 text-emerald-600 border-dashed";
                                                }

                                                return (
                                                    <div key={optIdx} className={`p-3 rounded-xl border-2 text-sm font-medium flex justify-between items-center ${styleClass}`}>
                                                        <span>{opt}</span>
                                                        {isSelected && <span className="text-xs font-bold uppercase tracking-wide opacity-70">Selected</span>}
                                                        {!isSelected && isActualCorrect && <CheckCircle size={14} className="opacity-50"/>}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* STUDENT REASONING */}
                                        {response.reasoning && (
                                            <div className="mt-4 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                                                <div className="flex items-center gap-2 text-indigo-800 font-bold text-xs uppercase tracking-wider mb-2">
                                                    <MessageSquare size={14} /> Student Reasoning
                                                </div>
                                                <p className="text-slate-700 text-sm leading-relaxed italic">
                                                    "{response.reasoning}"
                                                </p>
                                            </div>
                                        )}
                                        
                                        {!response.reasoning && originalQuestion?.requiresReasoning && (
                                            <div className="mt-4 text-xs text-slate-400 italic flex items-center gap-1">
                                                <MessageSquare size={12} /> No reasoning provided.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300 text-slate-400">
                            <HelpCircle size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No detailed response data available for this quiz attempt.</p>
                            <p className="text-xs mt-2 opacity-60">This might be an older quiz taken before response tracking was enabled.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizResultDetails;