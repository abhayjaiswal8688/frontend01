// src/pages/Admin/TestResultDetails.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, MessageSquare, HelpCircle, Award, Clock } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TestResultDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // We expect resultData (from history) and studentName
    const { resultData, studentName } = location.state || {};

    const [loading, setLoading] = useState(true);
    const [testDetails, setTestDetails] = useState(null);

    useEffect(() => {
        if (!resultData || !resultData.testId) {
            navigate('/admin'); 
            return;
        }
        fetchTestDetails();
    }, [resultData]);

    const fetchTestDetails = async () => {
        try {
            // Fetch the original test to get options and correct answers context
            const res = await fetch(`${API_BASE_URL}/tests/${resultData.testId}`);
            if (res.ok) {
                const data = await res.json();
                setTestDetails(data);
            }
        } catch (err) {
            console.error("Failed to load test details", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50 font-bold text-slate-400">Loading Results...</div>;

    if (!resultData || !testDetails) return <div className="p-8 text-center">Data not found.</div>;

    // Helper to check if passed (assuming 50% cutoff, or usage of logic from previous components)
    const passed = (resultData.score / resultData.totalQuestions) >= 0.5;

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
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assessment Result</span>
                                <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">{testDetails.category}</span>
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-1">{resultData.testTitle}</h1>
                            <p className="text-slate-500 font-medium">
                                Student: <span className="text-slate-800">{studentName}</span> • Date: <span className="text-slate-800">{new Date(resultData.createdAt).toLocaleDateString()}</span>
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Score</div>
                                <div className={`text-4xl font-bold ${passed ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {resultData.score}<span className="text-xl text-slate-300">/{resultData.totalQuestions}</span>
                                </div>
                            </div>
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg ${passed ? 'bg-emerald-500 shadow-emerald-200' : 'bg-red-500 shadow-red-200'}`}>
                                <Award size={32} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Questions Review */}
                <div className="space-y-6">
                    {resultData.responses && resultData.responses.length > 0 ? (
                        resultData.responses.map((response, index) => {
                            // Match with original question by Index
                            const originalQuestion = testDetails.questions[index];
                            
                            // If question was deleted/edited in the meantime, handle gracefully
                            if (!originalQuestion) return null; 

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
                                            {originalQuestion.options.map((opt, optIdx) => {
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
                                        
                                        {!response.reasoning && originalQuestion.requiresReasoning && (
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
                            <p>No detailed response data available.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TestResultDetails;