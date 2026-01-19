// src/pages/Admin/CreateCourse.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, Save, BookOpen, Video, FileText, Layers, HelpCircle, Clock, X, Globe, MessageSquare } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CreateCourse = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  
  // Track which lesson's timer is currently open { mIndex, lIndex }
  const [activeTimer, setActiveTimer] = useState(null);

  const [courseData, setCourseData] = useState({
    title: '', description: '', category: 'General', difficulty: 'Beginner', thumbnail: '', isPublic: false
  });

  const [modules, setModules] = useState([
    { title: 'Module 1: Introduction', lessons: [] }
  ]);
  
  const timeOptions = ['5 mins', '10 mins', '15 mins', '30 mins', '60 mins'];

  // --- INITIAL FETCH ---
  useEffect(() => {
    if (isEditMode) {
        setLoading(true);
        fetch(`${API_BASE_URL}/courses/${id}`)
            .then(res => {
                if(!res.ok) throw new Error("Failed to load course");
                return res.json();
            })
            .then(data => {
                const c = data.course;
                setCourseData({
                    title: c.title,
                    description: c.description,
                    category: c.category,
                    difficulty: c.difficulty,
                    thumbnail: c.thumbnail,
                    isPublic: c.isPublic || false 
                });
                
                // DATA MIGRATION
                if (c.modules) {
                    const migratedModules = c.modules.map(m => ({
                        ...m,
                        lessons: m.lessons.map(l => ({
                            ...l,
                            questions: l.questions ? l.questions.map(q => ({
                                ...q,
                                type: q.type || 'single',
                                correctOptionIndices: q.correctOptionIndices || (q.correctOptionIndex !== undefined ? [q.correctOptionIndex] : [0]),
                                requiresReasoning: q.requiresReasoning || false // Default for old data
                            })) : []
                        }))
                    }));
                    setModules(migratedModules);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false); 
            });
    }
  }, [id, isEditMode]);

  const handleCourseChange = (e) => {
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      setCourseData({ ...courseData, [e.target.name]: value });
  };

  // --- HELPER: Parse duration string to numbers ---
  const parseDuration = (durationStr) => {
    if (!durationStr) return { h: 0, m: 0 };
    const hMatch = durationStr.match(/(\d+)\s*hr/);
    const mMatch = durationStr.match(/(\d+)\s*min/);
    return {
        h: hMatch ? parseInt(hMatch[1]) : 0,
        m: mMatch ? parseInt(mMatch[1]) : 0
    };
  };

  // --- MODULE ACTIONS ---
  const addModule = () => setModules([...modules, { title: `Module ${modules.length + 1}`, lessons: [] }]);
  const updateModuleTitle = (index, value) => {
    const newModules = [...modules];
    newModules[index].title = value;
    setModules(newModules);
  };
  const removeModule = (index) => setModules(modules.filter((_, i) => i !== index));

  // --- LESSON ACTIONS ---
  const addLesson = (moduleIndex) => {
    const newModules = [...modules];
    newModules[moduleIndex].lessons.push({
      title: '', type: 'video', contentUrl: '', textContent: '', duration: '10 mins', isFree: false,
      questions: []
    });
    setModules(newModules);
  };

  const updateLesson = (mIndex, lIndex, field, value) => {
    const newModules = [...modules];
    newModules[mIndex].lessons[lIndex][field] = value;
    setModules(newModules);
  };

  // --- HANDLE DURATION CHANGE ---
  const handleDurationUpdate = (mIndex, lIndex, type, val) => {
    const currentDurationStr = modules[mIndex].lessons[lIndex].duration;
    let { h, m } = parseDuration(currentDurationStr);

    if (type === 'preset') {
        updateLesson(mIndex, lIndex, 'duration', val);
        return;
    }
    
    if (type === 'hours') h = Math.max(0, parseInt(val) || 0);
    if (type === 'minutes') m = Math.max(0, Math.min(59, parseInt(val) || 0));

    const hPart = h > 0 ? `${h} hr` : '';
    const mPart = m > 0 ? `${m} mins` : '';
    let finalStr = (h === 0 && m === 0) ? '0 mins' : `${hPart} ${mPart}`.trim();
    
    updateLesson(mIndex, lIndex, 'duration', finalStr);
  };

  const removeLesson = (mIndex, lIndex) => {
    const newModules = [...modules];
    newModules[mIndex].lessons = newModules[mIndex].lessons.filter((_, i) => i !== lIndex);
    setModules(newModules);
  };

  // --- QUIZ QUESTION ACTIONS ---
  
  const addQuestion = (mIndex, lIndex) => {
    const newModules = [...modules];
    newModules[mIndex].lessons[lIndex].questions.push({
        questionText: '',
        options: ['', ''], // Start with 2 empty options
        correctOptionIndices: [0], 
        type: 'single',
        requiresReasoning: false 
    });
    setModules(newModules);
  };

  const updateQuestion = (mIndex, lIndex, qIndex, field, value, optionIndex = null) => {
    const newModules = [...modules];
    const question = newModules[mIndex].lessons[lIndex].questions[qIndex];
    
    if (field === 'options') {
        question.options[optionIndex] = value;
    } else if (field === 'type') {
        question.type = value;
        question.correctOptionIndices = [0]; 
    } else {
        question[field] = value;
    }
    setModules(newModules);
  };

  // --- DYNAMIC OPTIONS LOGIC ---
  const addOptionToQuestion = (mIndex, lIndex, qIndex) => {
    const newModules = [...modules];
    newModules[mIndex].lessons[lIndex].questions[qIndex].options.push('');
    setModules(newModules);
  };

  const removeOptionFromQuestion = (mIndex, lIndex, qIndex, optIndex) => {
    const newModules = [...modules];
    const question = newModules[mIndex].lessons[lIndex].questions[qIndex];
    
    // Don't allow less than 2 options
    if (question.options.length <= 2) return;

    // Remove the option
    question.options = question.options.filter((_, i) => i !== optIndex);

    // Re-calculate correct indices
    // 1. If the removed option was correct, we must remove it from correctIndices
    // 2. If a correct option was AFTER the removed one, its index shifts down by 1
    question.correctOptionIndices = question.correctOptionIndices
        .filter(idx => idx !== optIndex) // Remove if it was the one deleted
        .map(idx => (idx > optIndex ? idx - 1 : idx)); // Shift down if needed

    // Fallback: If no correct answer remains, default to 0
    if (question.correctOptionIndices.length === 0) {
        question.correctOptionIndices = [0];
    }

    setModules(newModules);
  };

  const handleQuestionOptionToggle = (mIndex, lIndex, qIndex, optIndex) => {
    const newModules = [...modules];
    const q = newModules[mIndex].lessons[lIndex].questions[qIndex];
    
    if (q.type === 'single') {
        q.correctOptionIndices = [optIndex];
    } else {
        if (q.correctOptionIndices.includes(optIndex)) {
            if (q.correctOptionIndices.length > 1) {
                 q.correctOptionIndices = q.correctOptionIndices.filter(i => i !== optIndex);
            }
        } else {
            q.correctOptionIndices.push(optIndex);
        }
    }
    setModules(newModules);
  };

  const removeQuestion = (mIndex, lIndex, qIndex) => {
    const newModules = [...modules];
    newModules[mIndex].lessons[lIndex].questions = newModules[mIndex].lessons[lIndex].questions.filter((_, i) => i !== qIndex);
    setModules(newModules);
  };

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const token = localStorage.getItem('token');
        const url = isEditMode ? `${API_BASE_URL}/courses/${id}` : `${API_BASE_URL}/courses`;
        const method = isEditMode ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ ...courseData, modules })
        });
        if (!res.ok) throw new Error("Failed to create/update course");
        alert(`Course ${isEditMode ? 'Updated' : 'Created'} Successfully!`);
        navigate('/admin');
    } catch (err) { alert(err.message); } 
    finally { setLoading(false); }
  };

  if (loading && isEditMode) return <div className="h-screen flex items-center justify-center">Loading Course Data...</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">{isEditMode ? 'Edit Course' : 'Create New Course'}</h1>
                <p className="text-slate-500">Design your curriculum with Videos, Text, and Quizzes.</p>
            </div>
            <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition shadow-lg">
                <Save size={20} /> {loading ? 'Saving...' : (isEditMode ? 'Update Course' : 'Publish Course')}
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Metadata */}
            <div className="lg:col-span-1 space-y-6">
                {/* ... Metadata inputs (Unchanged) ... */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><BookOpen size={18} /> Course Details</h3>
                    <div className="space-y-4">
                        <input type="text" name="title" value={courseData.title} onChange={handleCourseChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-purple-500" placeholder="Course Title" />
                        
                        <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-purple-200 transition-colors">
                            <input 
                                type="checkbox" 
                                name="isPublic" 
                                checked={courseData.isPublic} 
                                onChange={handleCourseChange} 
                                className="w-5 h-5 accent-purple-600 cursor-pointer"
                                id="publicToggle"
                            />
                            <label htmlFor="publicToggle" className="text-sm font-semibold text-slate-700 cursor-pointer select-none flex-1">
                                <div className="flex items-center gap-1.5"><Globe size={14} className="text-purple-600" /> Make Publicly Available</div>
                                <span className="block text-xs text-slate-400 font-normal mt-0.5">Users can join without approval.</span>
                            </label>
                        </div>

                        <textarea name="description" rows="4" value={courseData.description} onChange={handleCourseChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-purple-500" placeholder="Description" />
                        <select name="category" value={courseData.category} onChange={handleCourseChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none">
                            <option>General</option><option>Mental Health</option><option>Community Nursing</option><option>Pediatrics</option><option>Anatomy</option>
                        </select>
                        <select name="difficulty" value={courseData.difficulty} onChange={handleCourseChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none">
                            <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                        </select>
                        <input type="text" name="thumbnail" value={courseData.thumbnail} onChange={handleCourseChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-purple-500" placeholder="Thumbnail URL" />
                    </div>
                </div>
            </div>

            {/* Right: Modules */}
            <div className="lg:col-span-2 space-y-6">
                {modules.map((module, mIndex) => (
                    <div key={mIndex} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center gap-3">
                            <Layers size={20} className="text-slate-400" />
                            <input type="text" value={module.title} onChange={(e) => updateModuleTitle(mIndex, e.target.value)} className="bg-transparent font-bold text-slate-700 text-lg outline-none flex-1" placeholder="Module Title" />
                            <button onClick={() => removeModule(mIndex)} className="text-slate-400 hover:text-red-500"><Trash2 size={18} /></button>
                        </div>

                        <div className="p-4 space-y-4">
                            {module.lessons.map((lesson, lIndex) => {
                                const isTimerOpen = activeTimer?.mIndex === mIndex && activeTimer?.lIndex === lIndex;
                                const parsedTime = parseDuration(lesson.duration);
                                
                                return (
                                <div key={lIndex} className="bg-white border-2 border-slate-100 rounded-xl p-4 hover:border-purple-100 transition-colors">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="mt-1 p-2 bg-slate-50 rounded-lg text-purple-600">
                                            {lesson.type === 'video' ? <Video size={18} /> : lesson.type === 'quiz' ? <HelpCircle size={18} /> : <FileText size={18} />}
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <div className="flex justify-between gap-2">
                                                <input type="text" value={lesson.title} onChange={(e) => updateLesson(mIndex, lIndex, 'title', e.target.value)} className="bg-transparent font-bold text-slate-800 outline-none w-full" placeholder="Lesson Title" />
                                                <button onClick={() => removeLesson(mIndex, lIndex)} className="text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                                            </div>
                                            
                                            {/* Type & Duration */}
                                            <div className="flex flex-wrap items-center gap-3">
                                                <select value={lesson.type} onChange={(e) => updateLesson(mIndex, lIndex, 'type', e.target.value)} className="bg-slate-50 border border-slate-200 text-xs rounded-lg px-2 py-1.5 outline-none font-medium text-slate-600">
                                                    <option value="video">Video</option>
                                                    <option value="text">Text</option>
                                                    <option value="quiz">Quiz</option>
                                                </select>
                                                
                                                <div className="relative">
                                                    <button 
                                                        onClick={() => setActiveTimer(isTimerOpen ? null : { mIndex, lIndex })}
                                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${isTimerOpen ? 'bg-purple-100 border-purple-300 text-purple-700' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}
                                                    >
                                                        <Clock size={14} />
                                                        {lesson.duration || "Set Duration"}
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            {/* Clock UI (Unchanged) */}
                                            {isTimerOpen && (
                                                <div className="p-4 bg-slate-50 rounded-xl border border-purple-100 animate-in fade-in slide-in-from-top-2">
                                                    {/* ... (Clock UI code remains same) ... */}
                                                    <div className="flex justify-between items-center mb-3">
                                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Set Duration</span>
                                                        <button onClick={() => setActiveTimer(null)} className="text-slate-400 hover:text-slate-600"><X size={14} /></button>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {timeOptions.map((t) => (
                                                            <button key={t} onClick={() => handleDurationUpdate(mIndex, lIndex, 'preset', t)} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${lesson.duration === t ? 'bg-purple-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-500 hover:border-purple-300'}`}>{t}</button>
                                                        ))}
                                                    </div>
                                                    <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-sm w-fit">
                                                        <div className="flex flex-col items-center">
                                                            <input type="number" min="0" max="23" value={parsedTime.h} onChange={(e) => handleDurationUpdate(mIndex, lIndex, 'hours', e.target.value)} className="w-12 text-center p-1 border border-purple-200 rounded-md text-sm font-bold text-purple-900 outline-none focus:ring-2 focus:ring-purple-200" />
                                                            <span className="text-[10px] text-slate-400 font-bold mt-1">HRS</span>
                                                        </div>
                                                        <span className="text-purple-300 font-bold">:</span>
                                                        <div className="flex flex-col items-center">
                                                            <input type="number" min="0" max="59" value={parsedTime.m} onChange={(e) => handleDurationUpdate(mIndex, lIndex, 'minutes', e.target.value)} className="w-12 text-center p-1 border border-purple-200 rounded-md text-sm font-bold text-purple-900 outline-none focus:ring-2 focus:ring-purple-200" />
                                                            <span className="text-[10px] text-slate-400 font-bold mt-1">MINS</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* CONTENT INPUTS */}
                                            {lesson.type === 'video' && (
                                                <input type="text" value={lesson.contentUrl} onChange={(e) => updateLesson(mIndex, lIndex, 'contentUrl', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none" placeholder="Video URL" />
                                            )}
                                            {lesson.type === 'text' && (
                                                <textarea value={lesson.textContent} onChange={(e) => updateLesson(mIndex, lIndex, 'textContent', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none" placeholder="Lesson content..." rows="2" />
                                            )}
                                        </div>
                                    </div>

                                    {/* QUIZ BUILDER UI */}
                                    {lesson.type === 'quiz' && (
                                        <div className="ml-12 mt-4 space-y-4 border-l-2 border-purple-100 pl-4">
                                            <p className="text-xs font-bold text-slate-400 uppercase">Quiz Questions</p>
                                            {lesson.questions.map((q, qIndex) => (
                                                <div key={qIndex} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                                                    
                                                    {/* QUESTION HEADER */}
                                                    <div className="flex flex-col gap-3 mb-3">
                                                        <div className="flex justify-between items-start gap-2">
                                                            <input 
                                                                type="text" 
                                                                value={q.questionText} 
                                                                onChange={(e) => updateQuestion(mIndex, lIndex, qIndex, 'questionText', e.target.value)} 
                                                                className="flex-1 bg-transparent font-medium outline-none text-sm border-b border-transparent focus:border-purple-300" 
                                                                placeholder="Enter Question..." 
                                                            />
                                                            <button onClick={() => removeQuestion(mIndex, lIndex, qIndex)} className="text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                                                        </div>
                                                        
                                                        {/* SETTINGS ROW */}
                                                        <div className="flex items-center gap-4">
                                                            <select 
                                                                value={q.type} 
                                                                onChange={(e) => updateQuestion(mIndex, lIndex, qIndex, 'type', e.target.value)}
                                                                className="text-[10px] font-bold bg-white border border-slate-300 rounded px-2 py-1 outline-none text-slate-600 focus:border-purple-500"
                                                            >
                                                                <option value="single">Single Choice</option>
                                                                <option value="multiple">Multiple Choice</option>
                                                            </select>

                                                            {/* REASONING TOGGLE */}
                                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                                <div className="relative">
                                                                    <input 
                                                                        type="checkbox" 
                                                                        className="sr-only peer"
                                                                        checked={q.requiresReasoning || false}
                                                                        onChange={(e) => updateQuestion(mIndex, lIndex, qIndex, 'requiresReasoning', e.target.checked)}
                                                                    />
                                                                    <div className="w-8 h-4 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-purple-600"></div>
                                                                </div>
                                                                <span className="text-[10px] font-bold text-slate-500 group-hover:text-purple-600 flex items-center gap-1">
                                                                    <MessageSquare size={12}/> Require Reasoning
                                                                </span>
                                                            </label>
                                                        </div>
                                                    </div>

                                                    {/* DYNAMIC OPTIONS GRID */}
                                                    <div className="space-y-2">
                                                        {q.options.map((opt, optIndex) => (
                                                            <div key={optIndex} className="flex items-center gap-2 group">
                                                                <input 
                                                                    type={q.type === 'single' ? 'radio' : 'checkbox'} 
                                                                    name={`correct-${mIndex}-${lIndex}-${qIndex}`} 
                                                                    checked={q.correctOptionIndices.includes(optIndex)} 
                                                                    onChange={() => handleQuestionOptionToggle(mIndex, lIndex, qIndex, optIndex)} 
                                                                    className={`cursor-pointer ${q.type === 'single' ? 'accent-purple-600' : 'accent-indigo-600 w-4 h-4'}`} 
                                                                />
                                                                
                                                                <input 
                                                                    type="text" 
                                                                    value={opt} 
                                                                    onChange={(e) => updateQuestion(mIndex, lIndex, qIndex, 'options', e.target.value, optIndex)} 
                                                                    className={`w-full bg-white border rounded px-2 py-1 text-xs outline-none transition-colors ${
                                                                        q.correctOptionIndices.includes(optIndex) 
                                                                        ? 'border-purple-300 bg-purple-50/50' 
                                                                        : 'border-slate-200 focus:border-purple-300'
                                                                    }`} 
                                                                    placeholder={`Option ${optIndex + 1}`} 
                                                                />
                                                                
                                                                {/* Remove Option Button */}
                                                                <button 
                                                                    onClick={() => removeOptionFromQuestion(mIndex, lIndex, qIndex, optIndex)}
                                                                    disabled={q.options.length <= 2}
                                                                    className="text-slate-300 hover:text-red-500 disabled:opacity-0"
                                                                >
                                                                    <X size={14} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                        
                                                        {/* Add Option Button */}
                                                        <button 
                                                            onClick={() => addOptionToQuestion(mIndex, lIndex, qIndex)}
                                                            className="text-[10px] font-bold text-slate-400 hover:text-purple-600 flex items-center gap-1 mt-1 ml-6"
                                                        >
                                                            <Plus size={12} /> Add Option
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            <button onClick={() => addQuestion(mIndex, lIndex)} className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1">
                                                <Plus size={14} /> Add Question
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )})}
                            <button onClick={() => addLesson(mIndex)} className="w-full py-2 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-semibold hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 transition flex items-center justify-center gap-2">
                                <Plus size={18} /> Add Lesson
                            </button>
                        </div>
                    </div>
                ))}
                <button onClick={addModule} className="w-full py-4 bg-slate-800 text-slate-200 rounded-2xl font-bold hover:bg-slate-900 transition shadow-lg flex items-center justify-center gap-2">
                    <Plus size={20} /> Add New Module
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
export default CreateCourse;