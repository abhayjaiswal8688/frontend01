// src/pages/Admin/CreateCourse.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, BookOpen, Video, FileText, Layers, HelpCircle, CheckCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CreateCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [courseData, setCourseData] = useState({
    title: '', description: '', category: 'General', difficulty: 'Beginner', thumbnail: ''
  });

  const [modules, setModules] = useState([
    { title: 'Module 1: Introduction', lessons: [] }
  ]);

  const handleCourseChange = (e) => setCourseData({ ...courseData, [e.target.name]: e.target.value });

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
      questions: [] // Initialize empty questions array
    });
    setModules(newModules);
  };

  const updateLesson = (mIndex, lIndex, field, value) => {
    const newModules = [...modules];
    newModules[mIndex].lessons[lIndex][field] = value;
    setModules(newModules);
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
        options: ['', '', '', ''],
        correctOptionIndex: 0
    });
    setModules(newModules);
  };

  const updateQuestion = (mIndex, lIndex, qIndex, field, value, optionIndex = null) => {
    const newModules = [...modules];
    const question = newModules[mIndex].lessons[lIndex].questions[qIndex];
    
    if (field === 'options') {
        question.options[optionIndex] = value;
    } else {
        question[field] = value;
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
        const res = await fetch(`${API_BASE_URL}/courses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ ...courseData, modules })
        });
        if (!res.ok) throw new Error("Failed to create course");
        alert("Course Created Successfully!");
        navigate('/admin');
    } catch (err) { alert(err.message); } 
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Create New Course</h1>
                <p className="text-slate-500">Design your curriculum with Videos, Text, and Quizzes.</p>
            </div>
            <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition shadow-lg">
                <Save size={20} /> {loading ? 'Saving...' : 'Publish Course'}
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Metadata */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><BookOpen size={18} /> Course Details</h3>
                    <div className="space-y-4">
                        <input type="text" name="title" value={courseData.title} onChange={handleCourseChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-purple-500" placeholder="Course Title" />
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
                            {module.lessons.map((lesson, lIndex) => (
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
                                            <div className="flex flex-wrap gap-3">
                                                <select value={lesson.type} onChange={(e) => updateLesson(mIndex, lIndex, 'type', e.target.value)} className="bg-slate-50 border border-slate-200 text-xs rounded-lg px-2 py-1 outline-none">
                                                    <option value="video">Video</option>
                                                    <option value="text">Text</option>
                                                    <option value="quiz">Quiz</option>
                                                </select>
                                                <input type="text" value={lesson.duration} onChange={(e) => updateLesson(mIndex, lIndex, 'duration', e.target.value)} className="bg-slate-50 border border-slate-200 text-xs rounded-lg px-2 py-1 w-20 outline-none" placeholder="10 mins" />
                                            </div>

                                            {/* CONTENT INPUTS BASED ON TYPE */}
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
                                                    <div className="flex justify-between mb-2">
                                                        <input type="text" value={q.questionText} onChange={(e) => updateQuestion(mIndex, lIndex, qIndex, 'questionText', e.target.value)} className="w-full bg-transparent font-medium outline-none text-sm border-b border-transparent focus:border-purple-300" placeholder="Enter Question..." />
                                                        <button onClick={() => removeQuestion(mIndex, lIndex, qIndex)} className="text-slate-400 hover:text-red-500 ml-2"><Trash2 size={14} /></button>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {q.options.map((opt, optIndex) => (
                                                            <div key={optIndex} className="flex items-center gap-2">
                                                                <input type="radio" name={`correct-${mIndex}-${lIndex}-${qIndex}`} checked={q.correctOptionIndex === optIndex} onChange={() => updateQuestion(mIndex, lIndex, qIndex, 'correctOptionIndex', optIndex)} className="accent-purple-600 cursor-pointer" />
                                                                <input type="text" value={opt} onChange={(e) => updateQuestion(mIndex, lIndex, qIndex, 'options', e.target.value, optIndex)} className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs outline-none focus:border-purple-300" placeholder={`Option ${optIndex + 1}`} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                            <button onClick={() => addQuestion(mIndex, lIndex)} className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1">
                                                <Plus size={14} /> Add Question
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
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