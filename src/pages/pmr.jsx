import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Brain, Moon, Sparkles, ArrowRight, Quote, Zap, 
    BookOpen, Coffee, Smile, Activity, Layers, CheckCircle,
    Calendar, Clock, Headphones, User
} from 'lucide-react';

// --- 1. HELPER: SOPHISTICATED TYPEWRITER (Letter Stagger) ---
const LetterStagger = ({ text, delay = 0 }) => {
    const letters = text.split("");
  
    const container = {
      hidden: { opacity: 0 },
      visible: (i = 1) => ({
        opacity: 1,
        transition: { staggerChildren: 0.05, delayChildren: delay }
      })
    };
  
    const child = {
      visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", damping: 12, stiffness: 100 }
      },
      hidden: {
        opacity: 0,
        y: 20,
        transition: { type: "spring", damping: 12, stiffness: 100 }
      }
    };
  
    return (
      <motion.span
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="inline-block"
      >
        {letters.map((letter, index) => (
          <motion.span key={index} variants={child}>
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </motion.span>
    );
};

// --- 2. HELPER: RUNNING GRADIENT TEXT (Wipe Reveal) ---
const RunningGradientText = ({ text, delay = 0 }) => {
    return (
        <div className="relative inline-block px-2"> 
            <motion.span
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ 
                    duration: 1.5, 
                    ease: "easeOut", 
                    delay: delay 
                }}
                className="absolute top-0 left-0 bottom-0 overflow-hidden whitespace-nowrap pb-2"
            >
                <motion.span 
                    animate={{ 
                        backgroundPosition: ["0% center", "200% center"] 
                    }}
                    transition={{ 
                        duration: 6, 
                        repeat: Infinity, 
                        ease: "linear" 
                    }}
                    style={{
                        backgroundImage: "linear-gradient(to right, #059669, #34d399, #059669, #10b981)", // Teal/Emerald Gradient
                        backgroundSize: "200% auto",
                    }}
                    className="text-transparent bg-clip-text font-extrabold tracking-tight"
                >
                    {text}
                </motion.span>
            </motion.span>
            
            {/* Invisible Duplicate for container sizing */}
            <span className="opacity-0">{text}</span>
        </div>
    );
};

// --- ANIMATION VARIANTS ---
const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
        opacity: 1, 
        y: 0, 
        transition: { duration: 0.6, ease: "easeOut" } 
    }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
        opacity: 1, 
        scale: 1,
        transition: { duration: 0.6 }
    }
};

const blobAnimation = {
    animate: {
        y: [0, -20, 0],
        x: [0, 10, 0],
        scale: [1, 1.1, 1],
        transition: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

export function PMR() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-100 text-slate-800 font-sans selection:bg-teal-200 relative overflow-hidden">
            
            {/* BACKGROUND BLOBS */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <motion.div variants={blobAnimation} animate="animate" className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-300/40 rounded-full blur-[120px] mix-blend-multiply" />
                <motion.div variants={blobAnimation} animate="animate" transition={{ delay: 2 }} className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-300/40 rounded-full blur-[120px] mix-blend-multiply" />
                <motion.div variants={blobAnimation} animate="animate" transition={{ delay: 4 }} className="absolute top-[40%] left-[40%] w-[40%] h-[40%] bg-cyan-200/40 rounded-full blur-[100px] mix-blend-multiply" />
            </div>

            {/* --- HERO SECTION --- */}
            <div className="relative z-10 pt-16 pb-32 px-6">
                <div className="max-w-6xl mx-auto text-center space-y-8">
                    
                    {/* Badge */}
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/50 text-teal-900 text-sm font-bold mb-4 shadow-sm hover:scale-105 transition-transform cursor-default"
                    >
                        <Sparkles size={16} className="text-teal-600 animate-pulse" />
                        <span>Student Wellness & Performance</span>
                    </motion.div>
                    
                    {/* --- UPDATED HEADING --- */}
                    <h1 className="font-bold tracking-tight text-slate-900 leading-[1.1] drop-shadow-sm flex flex-col items-center">
                        
                        {/* Line 1: Mastering */}
                        <div className="text-4xl md:text-6xl lg:text-7xl text-slate-900">
                            <LetterStagger text="Mastering" delay={0.2} />
                        </div>

                        {/* Line 2: Progressive Muscle Relaxation (PMR) */}
                        {/* Note: Font size adjusted to 'text-2xl md:text-5xl' to accommodate the long text length without breaking layout */}
                        <div className="-mt-1 md:-mt-2 pb-2 text-2xl md:text-5xl lg:text-6xl"> 
                            <RunningGradientText text="Progressive Muscle Relaxation (PMR)" delay={1.0} />
                        </div>

                    </h1>
                    
                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 2.2, duration: 1 }} 
                        className="text-xl text-slate-700 max-w-2xl mx-auto leading-relaxed font-medium"
                    >
                        Unlock your full potential through a scientifically proven technique to reduce stress, improve focus, and master test anxiety.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2.4, duration: 0.8 }}
                        className="pt-8"
                    >
                        <button 
                            onClick={() => navigate('/login')}
                            className="group relative inline-flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-full text-lg font-semibold hover:bg-slate-800 transition-all hover:scale-105 shadow-xl hover:shadow-teal-900/20"
                        >
                            Start Practicing
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* --- CONTENT CONTAINER --- */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24 space-y-32">

                {/* SECTION 1: DEFINITION */}
                <motion.section 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeInUp}
                    className="bg-white/60 backdrop-blur-xl rounded-[3rem] p-8 md:p-16 shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/50 relative overflow-hidden group"
                >
                    <div className="relative z-10 grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" className="space-y-8">
                            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold font-serif text-slate-900 leading-tight">
                                What is PMR?
                            </motion.h2>
                            <div className="space-y-6">
                                <motion.div variants={fadeInUp} className="bg-white/60 p-6 rounded-2xl text-slate-800 leading-relaxed text-lg border-l-4 border-teal-400 shadow-sm">
                                    Progressive Muscle Relaxation (PMR) is a systematic technique developed by Dr. Edmund Jacobson in the 1920s. It involves actively tensing and then relaxing specific muscle groups to develop a deep awareness of physical sensations.
                                </motion.div>
                                <motion.div variants={fadeInUp} className="bg-white/60 p-6 rounded-2xl text-slate-800 leading-relaxed text-lg border-l-4 border-emerald-400 shadow-sm">
                                    For students, PMR is a "reset button" for the nervous system. By learning to distinguish between tension and relaxation, you can physically turn off the stress response that blocks memory and concentration during exams.
                                </motion.div>
                            </div>
                        </motion.div>

                        <div className="flex flex-col gap-8">
                            <motion.div variants={scaleIn} className="rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/40 bg-black aspect-square md:aspect-auto h-full max-h-[500px]">
                                <img 
                                    src="https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=2070&auto=format&fit=crop" 
                                    alt="Student meditating" 
                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700" 
                                />
                            </motion.div>
                        </div>
                    </div>
                </motion.section>

                {/* SECTION 2: BENEFITS (The Four Pillars) */}
                <section>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16 max-w-2xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif text-slate-900">Benefits for Students</h2>
                        <p className="text-slate-700 text-lg font-medium">How relaxation directly translates to better grades and mental health.</p>
                    </motion.div>

                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* 1. Stress Reduction */}
                        <motion.div variants={fadeInUp} className="bg-white/60 backdrop-blur-md p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl border border-white/50 transition-all hover:-translate-y-2">
                            <div className="w-14 h-14 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center mb-6 shadow-sm"><Smile size={28} /></div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900">Stress Reduction</h3>
                            <p className="text-slate-600 leading-relaxed">Lowers cortisol levels, reducing the "fight or flight" response that hinders learning.</p>
                        </motion.div>

                        {/* 2. Enhanced Focus */}
                        <motion.div variants={fadeInUp} className="bg-white/60 backdrop-blur-md p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl border border-white/50 transition-all hover:-translate-y-2">
                            <div className="w-14 h-14 bg-teal-100 text-teal-700 rounded-2xl flex items-center justify-center mb-6 shadow-sm"><Brain size={28} /></div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900">Sharper Focus</h3>
                            <p className="text-slate-600 leading-relaxed">Clears mental clutter, allowing for longer, more productive study sessions.</p>
                        </motion.div>

                        {/* 3. Sleep Quality */}
                        <motion.div variants={fadeInUp} className="bg-white/60 backdrop-blur-md p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl border border-white/50 transition-all hover:-translate-y-2">
                            <div className="w-14 h-14 bg-indigo-100 text-indigo-700 rounded-2xl flex items-center justify-center mb-6 shadow-sm"><Moon size={28} /></div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900">Better Sleep</h3>
                            <p className="text-slate-600 leading-relaxed">Combats insomnia, ensuring your brain consolidates memory effectively at night.</p>
                        </motion.div>

                        {/* 4. Test Anxiety */}
                        <motion.div variants={fadeInUp} className="md:col-span-2 bg-gradient-to-br from-white/70 to-emerald-100/50 backdrop-blur-md p-8 md:p-10 rounded-[2.5rem] border border-white/50 relative group overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm"><Zap size={28} /></div>
                                <h3 className="text-2xl font-bold mb-4 text-slate-900">Overcoming Test Anxiety</h3>
                                <p className="text-slate-600 leading-relaxed max-w-md mb-8">Eliminates physical symptoms of panic—like shaking hands or a racing heart—before they take over.</p>
                            </div>
                            <div className="relative z-10 bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/50 max-w-lg ml-auto mt-4 md:-mt-12 md:translate-y-4">
                                <p className="text-emerald-900 font-medium italic leading-relaxed text-sm">"A relaxed body leads to a calm mind. When you control your physical tension, you control your exam performance."</p>
                            </div>
                        </motion.div>

                        {/* 5. Success Metric */}
                        <motion.div variants={fadeInUp} className="bg-slate-900 text-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-900/20 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-white backdrop-blur-sm"><Activity size={28} /></div>
                                <h3 className="text-2xl font-bold mb-4">The Science</h3>
                                <p className="text-slate-300 leading-relaxed">Research shows that just 20 minutes of PMR daily can significantly lower blood pressure and improve cognitive recall in students.</p>
                            </div>
                            <div className="mt-8 pt-8 border-t border-white/10 relative z-10">
                                <span className="text-sm font-medium text-teal-300 uppercase tracking-widest">Evidence Based</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* SECTION 3: THE TECHNIQUE (How-To) */}
                <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 lg:p-16 shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/50 overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" className="space-y-12">
                            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold font-serif text-slate-900 leading-tight">Mastering the Technique</motion.h2>
                            <div className="space-y-8">
                                {[
                                    { icon: Layers, color: 'purple', title: '1. Isolate Muscle Groups', text: 'Focus on one group at a time (e.g., right hand, then right arm, then face).' },
                                    { icon: Activity, color: 'pink', title: '2. Create Tension', text: 'Inhale and squeeze the muscle group hard for 5-7 seconds. Feel the tightness.' },
                                    { icon: CheckCircle, color: 'green', title: '3. Sudden Release', text: 'Exhale and instantly let go. Feel the tension drain away for 15-20 seconds.' },
                                    { icon: Sparkles, color: 'blue', title: '4. Notice the Difference', text: 'Pay close attention to the contrast between the tension you felt and the relaxation you feel now.' }
                                ].map((item, index) => (
                                    <motion.div variants={fadeInUp} key={index} className="flex gap-6 group">
                                        <div className={`shrink-0 w-12 h-12 bg-${item.color}-100 text-${item.color}-600 rounded-xl flex items-center justify-center mt-1 group-hover:scale-110 transition-transform shadow-sm`}>
                                            <item.icon size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                                            <p className="text-slate-600 leading-relaxed">{item.text}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                        <motion.div variants={scaleIn} className="h-full min-h-[500px] md:h-auto relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/50">
                            <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2000&auto=format&fit=crop" alt="Yoga and relaxation" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                        </motion.div>
                    </div>
                </motion.section>

                {/* --- ACADEMIC APPLICATIONS --- */}
                <section>
                     <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16 max-w-2xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif text-slate-900">Academic Applications</h2>
                    </motion.div>

                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div variants={fadeInUp} className="bg-white/60 backdrop-blur-md p-8 rounded-[2rem] shadow-sm border border-white/50 hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm"><BookOpen size={28} /></div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900">Before Study Sessions</h3>
                            <p className="text-slate-600 leading-relaxed">A quick 5-minute PMR session clears the mind of daily distractions, priming your brain for deep work and information retention.</p>
                        </motion.div>
                        <motion.div variants={fadeInUp} className="bg-white/60 backdrop-blur-md p-8 rounded-[2rem] shadow-sm border border-white/50 hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="w-14 h-14 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm"><Clock size={28} /></div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900">During Exam Blocks</h3>
                            <p className="text-slate-600 leading-relaxed">Feeling blank during a test? Tense and release your fists or feet discretely under the desk to reset your panic response.</p>
                        </motion.div>
                        <motion.div variants={fadeInUp} className="bg-white/60 backdrop-blur-md p-8 rounded-[2rem] shadow-sm border border-white/50 hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm"><Moon size={28} /></div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900">The Night Before</h3>
                            <p className="text-slate-600 leading-relaxed">Instead of cramming until 3 AM, use PMR to fall asleep faster. Sleep is when your brain moves information from short-term to long-term memory.</p>
                        </motion.div>
                    </motion.div>
                </section>

                {/* --- LIFESTYLE & WELLNESS --- */}
                <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-gradient-to-br from-white/60 to-emerald-50/50 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-16 shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/50">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif text-slate-900">Beyond the Classroom</h2>
                    </div>

                    <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" className="grid md:grid-cols-3 gap-12 items-center">
                        <div className="space-y-12">
                            <motion.div variants={fadeInUp} className="text-center md:text-right">
                                <div className="inline-flex justify-center md:justify-end w-full mb-3 text-emerald-600"><Coffee size={32} /></div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Energy Management</h3>
                                <p className="text-slate-600 leading-relaxed">Chronic tension drains your battery. Releasing it gives you more energy for hobbies and social life.</p>
                            </motion.div>
                            <motion.div variants={fadeInUp} className="text-center md:text-right">
                                <div className="inline-flex justify-center md:justify-end w-full mb-3 text-emerald-600"><Smile size={32} /></div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Emotional Resilience</h3>
                                <p className="text-slate-600 leading-relaxed">A relaxed body interprets the world as less threatening, helping you handle social conflicts with grace.</p>
                            </motion.div>
                        </div>
                        <motion.div variants={scaleIn} className="relative aspect-square rounded-full border-[6px] border-white/50 shadow-2xl overflow-hidden hidden md:block">
                             <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" alt="Students laughing" className="w-full h-full object-cover" />
                        </motion.div>
                        <div className="space-y-12">
                             <motion.div variants={fadeInUp} className="text-center md:text-left">
                                <div className="inline-flex justify-center md:justify-start w-full mb-3 text-emerald-600"><Brain size={32} /></div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Mental Clarity</h3>
                                <p className="text-slate-600 leading-relaxed">PMR clears "brain fog," helping you make better decisions about your future and career path.</p>
                            </motion.div>
                            <motion.div variants={fadeInUp} className="text-center md:text-left">
                                <div className="inline-flex justify-center md:justify-start w-full mb-3 text-emerald-600"><User size={32} /></div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Self-Awareness</h3>
                                <p className="text-slate-600 leading-relaxed">You become attuned to your body's early stress signals, allowing you to intervene before you burnout.</p>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.section>

                {/* --- GETTING STARTED (Resources) --- */}
                <section>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16 max-w-2xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif text-slate-900">Start Your Practice</h2>
                    </motion.div>
                    
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div variants={fadeInUp} className="bg-white/70 backdrop-blur-md rounded-[2rem] overflow-hidden shadow-sm border border-white/50 hover:shadow-lg transition-all">
                            <div className="h-48 overflow-hidden"><img src="https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?q=80&w=2070&auto=format&fit=crop" alt="Audio Guides" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" /></div>
                            <div className="p-8">
                                <h3 className="text-xl font-bold mb-3 text-slate-900">Audio Guides</h3>
                                <p className="text-slate-600 leading-relaxed">Download our guided 15-minute PMR audio tracks to walk you through the full body relaxation sequence.</p>
                            </div>
                        </motion.div>
                         <motion.div variants={fadeInUp} className="bg-white/70 backdrop-blur-md rounded-[2rem] overflow-hidden shadow-sm border border-white/50 hover:shadow-lg transition-all">
                            <div className="h-48 overflow-hidden"><img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop" alt="Routine" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" /></div>
                            <div className="p-8">
                                <h3 className="text-xl font-bold mb-3 text-slate-900">Daily Routine</h3>
                                <p className="text-slate-600 leading-relaxed">Integrate PMR into your schedule. The best times are right after waking up or right before going to sleep.</p>
                            </div>
                        </motion.div>
                         <motion.div variants={fadeInUp} className="bg-white/70 backdrop-blur-md rounded-[2rem] overflow-hidden shadow-sm border border-white/50 hover:shadow-lg transition-all">
                            <div className="h-48 overflow-hidden"><img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop" alt="Group Session" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" /></div>
                            <div className="p-8">
                                <h3 className="text-xl font-bold mb-3 text-slate-900">Group Sessions</h3>
                                <p className="text-slate-600 leading-relaxed">Join our weekly workshops to practice with peers and learn advanced relaxation strategies.</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* --- FOUNDER SECTION --- */}
                <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-16 shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/50 text-center relative">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500" />
                    <div className="max-w-3xl mx-auto pt-8">
                        <motion.div variants={scaleIn} className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"><Quote size={32} /></motion.div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">Meet the Founder</h2>
                        <p className="text-xl md:text-2xl text-slate-700 italic leading-relaxed mb-10 font-serif">"I created this platform because I believe that <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 font-bold">Mental Resilience</span> is the missing link in modern education. It's not just about feeling better—it's about being better."</p>
                        <div className="flex flex-col items-center justify-center gap-4">
                            <motion.div variants={scaleIn} className="p-1.5 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full shadow-lg">
                                <img src="/images/Homepage/mam.png" alt="Founder" className="w-20 h-20 rounded-full border-4 border-white object-cover" />
                            </motion.div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Pushpa Oraon</h3>
                                <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mt-1">ASSOCIATE PROFESSOR</p>
                                <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mt-1">SHRI MATA VAISHNO DEVI COLLEGE OF NURSING,KATRA, JAMMU</p>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* FOOTER CTA */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center pb-8">
                    <h2 className="text-3xl font-bold mb-8 text-slate-900">Ready to master your mind?</h2>
                    <motion.button 
                         whileHover={{ scale: 1.05 }}
                         whileTap={{ scale: 0.95 }}
                         onClick={() => navigate('/login')}
                         className="px-12 py-4 bg-slate-900 hover:bg-slate-800 text-white text-lg font-bold rounded-full transition-all shadow-xl hover:shadow-2xl"
                    >
                        Join the Community
                    </motion.button>
                </motion.div>

            </div>
        </div>
    );
}