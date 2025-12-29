// src/pages/Admin/CreateTest.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Added useParams

const CreateTest = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL (if editing)
  const isEditMode = !!id;    // Boolean: true if editing, false if creating

  const [testTitle, setTestTitle] = useState('');
  
  // --- TIME STATE ---
  const [durationMode, setDurationMode] = useState('select'); 
  const [selectedDuration, setSelectedDuration] = useState('15 mins');
  const [customHours, setCustomHours] = useState(0);
  const [customMinutes, setCustomMinutes] = useState(0);
  
  // --- ICON STATE ---
  const [selectedIcon, setSelectedIcon] = useState('nursing'); 

  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctOptionIndex: 0 }
  ]);
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  // Options
  const iconOptions = [
    { id: 'psychology', label: 'Mental Health', desc: 'Brain & Mind' },
    { id: 'community', label: 'Community', desc: 'Social Health' },
    { id: 'oncology', label: 'Oncology', desc: 'Cancer Care' },
    { id: 'child', label: 'Adolescent', desc: 'Pediatrics' },
    { id: 'research', label: 'Research', desc: 'Methodology' },
    { id: 'nursing', label: 'General', desc: 'Nursing Foundations' },
  ];

  const timeOptions = ['5 mins', '10 mins', '15 mins', '30 mins', '60 mins'];

  // --- 1. FETCH DATA IF EDITING ---
  useEffect(() => {
    if (isEditMode) {
        setStatus({ loading: true, error: '', success: '' });
        fetch(`http://localhost:3001/api/tests/${id}`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch test data");
                return res.json();
            })
            .then(data => {
                // Populate Form
                setTestTitle(data.title);
                setQuestions(data.questions);
                setSelectedIcon(data.icon || 'nursing');
                
                // Parse Duration
                if (timeOptions.includes(data.duration)) {
                    setDurationMode('select');
                    setSelectedDuration(data.duration);
                } else {
                    setDurationMode('custom');
                    // Simple parser for "X hr Y mins"
                    const hMatch = data.duration.match(/(\d+)\s*hr/);
                    const mMatch = data.duration.match(/(\d+)\s*min/);
                    setCustomHours(hMatch ? parseInt(hMatch[1]) : 0);
                    setCustomMinutes(mMatch ? parseInt(mMatch[1]) : 0);
                }
                setStatus({ loading: false, error: '', success: '' });
            })
            .catch(err => {
                setStatus({ loading: false, error: err.message, success: '' });
            });
    }
  }, [id, isEditMode]);


  // --- LOGIC ---
  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const addNewQuestion = () => {
    setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctOptionIndex: 0 }]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);
    }
  };

  const moveQuestion = (index, direction) => {
    const newQuestions = [...questions];
    if (direction === 'up' && index > 0) {
      [newQuestions[index], newQuestions[index - 1]] = [newQuestions[index - 1], newQuestions[index]];
    } else if (direction === 'down' && index < questions.length - 1) {
      [newQuestions[index], newQuestions[index + 1]] = [newQuestions[index + 1], newQuestions[index]];
    }
    setQuestions(newQuestions);
  };

  const validateForm = () => {
    if (!testTitle.trim()) return "Test title is required.";
    if (durationMode === 'custom') {
        if (customHours === 0 && customMinutes === 0) return "Custom duration cannot be 0.";
        if (customHours > 24) return "Hours cannot exceed 24.";
        if (customMinutes > 59) return "Minutes cannot exceed 59.";
    }
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].questionText.trim()) return `Question ${i + 1} is empty.`;
      if (questions[i].options.some(opt => !opt.trim())) return `All options for Question ${i + 1} must be filled.`;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: false, error: '', success: '' });

    const errorMsg = validateForm();
    if (errorMsg) {
      setStatus({ loading: false, error: errorMsg, success: '' });
      return;
    }

    let finalDuration = selectedDuration;
    if (durationMode === 'custom') {
        const hPart = customHours > 0 ? `${customHours} hr` : '';
        const mPart = customMinutes > 0 ? `${customMinutes} mins` : '';
        finalDuration = `${hPart} ${mPart}`.trim();
    }

    const finalTestData = { 
      title: testTitle, 
      questions,
      duration: finalDuration,
      icon: selectedIcon
    };

    setStatus({ loading: true, error: '', success: '' });

    try {
      // --- DYNAMIC URL & METHOD ---
      const url = isEditMode 
        ? `http://localhost:3001/api/tests/${id}` 
        : 'http://localhost:3001/api/tests';
        
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalTestData),
      });

      if (!response.ok) throw new Error('Failed to save test.');

      setStatus({ loading: false, error: '', success: `Assessment ${isEditMode ? 'updated' : 'created'} successfully!` });
      
      // If editing, go back to dashboard after a delay
      // If creating, reset form to allow another
      if (isEditMode) {
          setTimeout(() => navigate('/admin'), 1500);
      } else {
          setTestTitle('');
          setQuestions([{ questionText: '', options: ['', '', '', ''], correctOptionIndex: 0 }]);
          setDurationMode('select');
          setSelectedDuration('15 mins');
          setCustomHours(0);
          setCustomMinutes(0);
      }

    } catch (err) {
      setStatus({ loading: false, error: err.message || 'Something went wrong', success: '' });
    }
  };

  const renderIconSvg = (id) => {
    switch(id) {
        case 'psychology': return <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>; 
        case 'community': return <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>; 
        case 'oncology': return <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>; 
        case 'child': return <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; 
        case 'research': return <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
        case 'nursing': return <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>; 
        default: return null;
    }
  };

  return (
    <div className="p-8 bg-white border-2 border-purple-400 rounded-xl shadow-lg max-w-4xl mx-auto mt-10 mb-10">
      <h2 className="text-3xl font-bold mb-2 text-gray-800">{isEditMode ? 'Edit Assessment' : 'Create Assessment'}</h2>
      <p className="text-gray-500 mb-8">{isEditMode ? 'Modify questions or settings for this test.' : 'Design a new test module for your students.'}</p>
      
      {status.error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">{status.error}</div>}
      {status.success && <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">{status.success}</div>}

      <form onSubmit={handleSubmit}>
        
        {/* ROW 1: Title */}
        <div className="mb-8">
            <label className="block text-gray-700 font-bold mb-2">Test Title</label>
            <input 
              type="text" 
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-lg"
              placeholder="e.g. Mental Health Nursing Finals"
              value={testTitle}
              onChange={(e) => setTestTitle(e.target.value)}
            />
        </div>

        {/* ROW 2: Duration Selector */}
        <div className="mb-8">
            <label className="block text-gray-700 font-bold mb-3">Duration Limit</label>
            <div className="flex flex-wrap gap-3 items-center">
                {timeOptions.map((time) => (
                    <button
                        key={time}
                        type="button"
                        onClick={() => { setDurationMode('select'); setSelectedDuration(time); }}
                        className={`px-5 py-2 rounded-full font-medium transition-all ${
                            durationMode === 'select' && selectedDuration === time 
                            ? 'bg-purple-600 text-white shadow-md' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {time}
                    </button>
                ))}
                
                <button
                    type="button"
                    onClick={() => setDurationMode('custom')}
                    className={`px-5 py-2 rounded-full font-medium transition-all ${
                        durationMode === 'custom'
                        ? 'bg-purple-600 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    Custom Time
                </button>
            </div>

            {durationMode === 'custom' && (
                <div className="mt-4 flex items-center gap-4 bg-white p-4 rounded-lg inline-flex border border-purple-100 animate-fade-in">
                    <div className="flex flex-col">
                        <label className="text-xs text-purple-800 font-bold mb-1">Hours</label>
                        <input 
                            type="number" min="0" max="23"
                            value={customHours}
                            onChange={(e) => setCustomHours(Math.max(0, Math.min(23, parseInt(e.target.value) || 0)))}
                            className="p-2 border border-purple-200 rounded-lg w-24 text-center focus:ring-2 focus:ring-purple-500 outline-none text-lg font-semibold text-purple-900"
                        />
                    </div>
                    <span className="text-purple-300 font-bold text-2xl mt-4">:</span>
                    <div className="flex flex-col">
                        <label className="text-xs text-purple-800 font-bold mb-1">Minutes</label>
                        <input 
                            type="number" min="0" max="59"
                            value={customMinutes}
                            onChange={(e) => setCustomMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                            className="p-2 border border-purple-200 rounded-lg w-24 text-center focus:ring-2 focus:ring-purple-500 outline-none text-lg font-semibold text-purple-900"
                        />
                    </div>
                </div>
            )}
        </div>

        {/* ROW 3: Icon Selection */}
        <div className="mb-10">
            <label className="block text-gray-700 font-bold mb-3">Specialization Category</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {iconOptions.map((icon) => (
                    <button
                        key={icon.id}
                        type="button"
                        onClick={() => setSelectedIcon(icon.id)}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                            selectedIcon === icon.id 
                            ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-sm' 
                            : 'border-gray-100 hover:border-purple-200 text-gray-400 hover:bg-gray-50'
                        }`}
                    >
                        <div className="mb-2">{renderIconSvg(icon.id)}</div>
                        <span className="text-sm font-semibold">{icon.label}</span>
                        <span className="text-[10px] text-gray-400">{icon.desc}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* QUESTION BUILDER */}
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="mb-8 p-6 border border-gray-200 rounded-xl bg-gray-50 relative transition-all hover:shadow-md">
            
            <div className="flex justify-between items-center mb-4 bg-gray-100 p-3 rounded-lg">
              <div className="flex items-center gap-3">
                 <h4 className="font-bold text-lg text-gray-700">Question {qIndex + 1}</h4>
                 <div className="flex gap-1 ml-4 bg-white rounded border border-gray-200">
                    <button 
                        type="button" 
                        disabled={qIndex === 0}
                        onClick={() => moveQuestion(qIndex, 'up')}
                        className={`p-1 hover:bg-gray-100 rounded-l ${qIndex === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-purple-600'}`}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>
                    </button>
                    <div className="w-px bg-gray-200"></div>
                    <button 
                        type="button" 
                        disabled={qIndex === questions.length - 1}
                        onClick={() => moveQuestion(qIndex, 'down')}
                        className={`p-1 hover:bg-gray-100 rounded-r ${qIndex === questions.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-purple-600'}`}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                 </div>
              </div>

              {questions.length > 1 && (
                <button type="button" onClick={() => removeQuestion(qIndex)} className="text-red-500 hover:text-red-700 text-sm font-semibold px-3 py-1 hover:bg-red-50 rounded transition-colors">
                  Remove
                </button>
              )}
            </div>
            
            <input 
                type="text" 
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-purple-500 outline-none" 
                placeholder="Question text..." 
                value={q.questionText} 
                onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)} 
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {q.options.map((opt, oIndex) => (
                <div key={oIndex} className="flex items-center group">
                    <input 
                      type="radio" 
                      name={`correct-${qIndex}`} 
                      className="w-5 h-5 text-green-600 mr-3 accent-green-600 cursor-pointer"
                      checked={q.correctOptionIndex === oIndex}
                      onChange={() => handleQuestionChange(qIndex, 'correctOptionIndex', oIndex)}
                    />
                    <input 
                        type="text" 
                        className={`w-full p-2 border rounded focus:ring-2 outline-none transition-colors ${
                            q.correctOptionIndex === oIndex 
                            ? 'border-green-500 bg-green-50 ring-1 ring-green-200 font-medium text-green-800' 
                            : 'border-gray-300 focus:ring-purple-500 group-hover:border-gray-400'
                        }`} 
                        placeholder={`Option ${oIndex + 1}`} 
                        value={opt} 
                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)} 
                    />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <button type="button" onClick={addNewQuestion} className="bg-white border-2 border-dashed border-purple-400 text-purple-600 px-6 py-2 rounded-lg hover:bg-purple-50 font-medium transition">+ Add Question</button>
          <button type="submit" disabled={status.loading} className={`px-8 py-3 rounded-lg font-bold text-white shadow-lg transition ${status.loading ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'}`}>
            {status.loading ? 'Saving...' : (isEditMode ? 'Update Assessment' : 'Create Assessment')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTest;