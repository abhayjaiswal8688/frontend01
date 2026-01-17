import React from 'react';
import { useNavigate,Link } from 'react-router-dom';
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
        <div className="relative inline-block px-2 py-4"> {/* py-4 added to prevent clipping 'g' */}
            <motion.span
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ 
                    duration: 1.5, 
                    ease: "easeOut", 
                    delay: delay 
                }}
                className="absolute top-0 left-0 h-[120%] overflow-hidden whitespace-nowrap z-10"
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
                        backgroundImage: "linear-gradient(to right, #059669, #34d399, #059669, #10b981)", 
                        backgroundSize: "200% auto",
                    }}
                    className="text-transparent bg-clip-text font-extrabold tracking-tight"
                >
                    {text}
                </motion.span>
            </motion.span>
            
            {/* Invisible Duplicate for container sizing */}
            <span className="opacity-0 font-extrabold tracking-tight">{text}</span>
        </div>
    );
};

// --- NEW HELPER: TEXT BLUR REVEAL ---
const BlurInText = ({ children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
        whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        transition={{ duration: 0.8, delay }}
        viewport={{ once: true }}
    >
        {children}
    </motion.div>
);

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
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
        opacity: 1, 
        scale: 1,
        transition: { duration: 0.6 }
    }
};

const blobAnimation = {
    animate: {
        y: [0, -30, 0],
        x: [0, 20, 0],
        scale: [1, 1.2, 1],
        transition: {
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

export function PMR() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#f0f9f9] text-slate-800 font-sans selection:bg-teal-200 selection:text-teal-900 relative overflow-hidden">
            
            {/* BACKGROUND BLOBS */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <motion.div variants={blobAnimation} animate="animate" className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-teal-300/20 rounded-full blur-[120px]" />
                <motion.div variants={blobAnimation} animate="animate" transition={{ delay: 2 }} className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-300/20 rounded-full blur-[120px]" />
                <motion.div variants={blobAnimation} animate="animate" transition={{ delay: 4 }} className="absolute top-[30%] left-[30%] w-[50%] h-[50%] bg-cyan-200/20 rounded-full blur-[120px]" />
            </div>

            {/* --- HERO SECTION --- */}
            <div className="relative z-10 pt-24 pb-32 px-6">
                <div className="max-w-6xl mx-auto text-center space-y-10">
                    
                    {/* Badge */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/40 backdrop-blur-xl border border-white/60 text-teal-950 text-xs font-bold uppercase tracking-widest mb-4 shadow-sm"
                    >
                        <Sparkles size={14} className="text-teal-600 animate-pulse" />
                        <span>Student Wellness & Performance</span>
                    </motion.div>
                    
                    {/* --- UPDATED HEADING --- */}
                    <h1 className="font-black tracking-tighter text-slate-900 leading-[0.95] flex flex-col items-center">
                        
                        <div className="text-5xl md:text-7xl lg:text-8xl drop-shadow-sm">
                            <LetterStagger text="Mastering" delay={0.2} />
                        </div>

                        <div className="mt-2 text-2xl md:text-5xl lg:text-6xl"> 
                            <RunningGradientText text="Progressive Muscle Relaxation (PMR)" delay={1.0} />
                        </div>

                    </h1>
                    
                    <BlurInText delay={2.2}>
                        <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-light">
                            Unlock your full potential through a scientifically proven technique to <span className="font-semibold text-teal-700">reduce stress</span>, improve focus, and master test anxiety.
                        </p>
                    </BlurInText>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2.6, duration: 0.8 }}
                        className="pt-4"
                    >
                        <button 
                            onClick={() => navigate('/login')}
                            className="group relative inline-flex items-center gap-3 px-12 py-5 bg-slate-900 text-white rounded-full text-lg font-bold hover:bg-black transition-all hover:scale-105 shadow-2xl hover:shadow-teal-500/20"
                        >
                            Start Practicing
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* --- CONTENT CONTAINER --- */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24 space-y-40">

                {/* SECTION 1: DEFINITION */}
                <motion.section 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeInUp}
                    className="bg-white/40 backdrop-blur-3xl saturate-150 rounded-[4rem] p-10 md:p-20 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white/80 relative overflow-hidden group hover:border-teal-200 transition-colors duration-500"
                >
                    <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" className="space-y-10">
                            <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight">
                                What is <span className="text-teal-600 font-serif italic">PMR?</span>
                            </motion.h2>
                            <div className="space-y-6">
                                <motion.div variants={fadeInUp} className="bg-white/80 backdrop-blur-md p-8 rounded-3xl text-slate-700 leading-relaxed text-lg border border-white shadow-sm hover:shadow-md transition-shadow">
                                    Progressive Muscle Relaxation (PMR) is a systematic technique developed by Dr. Edmund Jacobson in the 1920s. It involves actively tensing and then relaxing specific muscle groups to develop a deep awareness of physical sensations.
                                </motion.div>
                                <motion.div variants={fadeInUp} className="bg-white/80 backdrop-blur-md p-8 rounded-3xl text-slate-700 leading-relaxed text-lg border border-white shadow-sm hover:shadow-md transition-shadow">
                                    For students, PMR is a "reset button" for the nervous system. By learning to distinguish between tension and relaxation, you can physically turn off the stress response that blocks memory and concentration during exams.
                                </motion.div>
                            </div>
                        </motion.div>

                        <motion.div variants={scaleIn} className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-tr from-teal-500/20 to-emerald-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white/50 bg-white-900 aspect-square md:aspect-auto">
                                <img 
                                    src="https://imgs.search.brave.com/Akm00ZcB6rh8TY-0tVI21pNpGSLeHJ8VkAQfPP5_yjg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS12ZWN0b3Iv/ZmxhdC1wZW9wbGUt/bWVkaXRhdGluZ18y/My0yMTQ4OTY1Njcz/LmpwZz9zZW10PWFp/c19oeWJyaWQmdz03/NDAmcT04MA" 
                                    alt="Student meditating" 
                                    className="w-full h-full object-cover opacity-100 group-hover:scale-110 group-hover:opacity-100 transition-all duration-1000" 
                                />
                            </div>
                        </motion.div>
                    </div>
                </motion.section>

                {/* SECTION 2: BENEFITS */}
                <section>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-20 max-w-3xl mx-auto space-y-4">
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">Benefits for Students</h2>
                        <p className="text-slate-500 text-xl font-light">How relaxation directly translates to better grades and mental health.</p>
                    </motion.div>

                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        
                        {/* 1. Stress Reduction */}
                        <motion.div variants={fadeInUp} className="group bg-white/60 backdrop-blur-xl p-10 rounded-[3rem] border border-white/80 hover:border-teal-200 transition-all hover:-translate-y-3">
                            <div className="w-16 h-16 bg-green-50 text-green-700 rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-transform"><Smile size={32} /></div>
                            <h3 className="text-2xl font-bold mb-4 text-slate-900">Stress Reduction</h3>
                            <p className="text-slate-500 leading-relaxed text-lg">Lowers cortisol levels, reducing the "fight or flight" response that hinders learning.</p>
                        </motion.div>

                        {/* 2. Enhanced Focus */}
                        <motion.div variants={fadeInUp} className="group bg-white/60 backdrop-blur-xl p-10 rounded-[3rem] border border-white/80 hover:border-teal-200 transition-all hover:-translate-y-3">
                            <div className="w-16 h-16 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 group-hover:-rotate-6 transition-transform"><Brain size={32} /></div>
                            <h3 className="text-2xl font-bold mb-4 text-slate-900">Sharper Focus</h3>
                            <p className="text-slate-500 leading-relaxed text-lg">Clears mental clutter, allowing for longer, more productive study sessions.</p>
                        </motion.div>

                        {/* 3. Sleep Quality */}
                        <motion.div variants={fadeInUp} className="group bg-white/60 backdrop-blur-xl p-10 rounded-[3rem] border border-white/80 hover:border-teal-200 transition-all hover:-translate-y-3">
                            <div className="w-16 h-16 bg-indigo-50 text-indigo-700 rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-transform"><Moon size={32} /></div>
                            <h3 className="text-2xl font-bold mb-4 text-slate-900">Better Sleep</h3>
                            <p className="text-slate-500 leading-relaxed text-lg">Combats insomnia, ensuring your brain consolidates memory effectively at night.</p>
                        </motion.div>

                        {/* 4. Test Anxiety */}
                        <motion.div variants={fadeInUp} className="md:col-span-2 bg-gradient-to-br from-white to-emerald-50/50 backdrop-blur-xl p-12 rounded-[3.5rem] border border-white/80 relative group overflow-hidden flex flex-col justify-between hover:shadow-2xl transition-all">
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform"><Zap size={32} /></div>
                                <h3 className="text-3xl font-bold mb-4 text-slate-900">Overcoming Test Anxiety</h3>
                                <p className="text-slate-500 leading-relaxed text-xl max-w-md mb-8">Eliminates physical symptoms of panic—like shaking hands or a racing heart—before they take over.</p>
                            </div>
                            <div className="relative z-10 bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-emerald-100/50 max-w-lg ml-auto">
                                <p className="text-emerald-900 font-medium italic leading-relaxed">"A relaxed body leads to a calm mind. When you control your physical tension, you control your exam performance."</p>
                            </div>
                        </motion.div>

                        {/* 5. Success Metric */}
                        <motion.div variants={fadeInUp} className="bg-slate-900 text-white p-12 rounded-[3.5rem] shadow-2xl flex flex-col justify-between hover:scale-[1.03] transition-all duration-500 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-[80px]" />
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 text-white backdrop-blur-md border border-white/10 transition-transform group-hover:rotate-12"><Activity size={32} /></div>
                                <h3 className="text-3xl font-bold mb-4">The Science</h3>
                                <p className="text-slate-400 leading-relaxed text-lg">Research shows that just 20 minutes of PMR daily can significantly lower blood pressure and improve cognitive recall in students.</p>
                            </div>
                            <div className="mt-8 pt-8 border-t border-white/10 relative z-10">
                                <span className="text-xs font-bold text-teal-400 uppercase tracking-[0.3em]">Evidence Based</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* SECTION 3: THE TECHNIQUE */}
                <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/40 backdrop-blur-3xl rounded-[4rem] p-10 md:p-20 border border-white/80 shadow-[0_30px_60px_rgba(0,0,0,0.02)]">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" className="space-y-14">
                            <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight tracking-tight">Mastering the <span className="text-teal-600">Technique</span></motion.h2>
                            <div className="space-y-10">
                                {[
                                    { icon: Layers, color: 'purple', title: '1. Isolate Muscle Groups', text: 'Focus on one group at a time (e.g., right hand, then right arm, then face).' },
                                    { icon: Activity, color: 'pink', title: '2. Create Tension', text: 'Inhale and squeeze the muscle group hard for 5-7 seconds. Feel the tightness.' },
                                    { icon: CheckCircle, color: 'green', title: '3. Sudden Release', text: 'Exhale and instantly let go. Feel the tension drain away for 15-20 seconds.' },
                                    { icon: Sparkles, color: 'blue', title: '4. Notice the Difference', text: 'Pay close attention to the contrast between tension and relaxation.' }
                                ].map((item, index) => (
                                    <motion.div variants={fadeInUp} key={index} className="flex gap-8 group">
                                        <div className={`shrink-0 w-14 h-14 bg-${item.color}-50 text-${item.color}-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all border border-white shadow-sm`}>
                                            <item.icon size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-slate-900 mb-2">{item.title}</h3>
                                            <p className="text-slate-500 leading-relaxed text-lg">{item.text}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                        <motion.div variants={scaleIn} className="relative h-full min-h-[600px] rounded-[3.5rem] overflow-hidden shadow-2xl border-[12px] border-white group">
                            <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2000&auto=format&fit=crop" alt="Yoga and relaxation" className="absolute inset-0 w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                        </motion.div>
                    </div>
                </motion.section>

                {/* --- ACADEMIC APPLICATIONS --- */}
                <section>
                     <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-20 space-y-4">
                        <h2 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight">Academic Applications</h2>
                    </motion.div>

                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { icon: BookOpen, color: 'purple', title: 'Before Study Sessions', text: 'Clear the mind of distractions, priming your brain for deep work and retention.' },
                            { icon: Clock, color: 'pink', title: 'During Exam Blocks', text: 'Feeling blank? Tense and release discretely under the desk to reset panic.' },
                            { icon: Moon, color: 'blue', title: 'The Night Before', text: 'Instead of cramming, use PMR to fall asleep faster and consolidate memory.' }
                        ].map((card, i) => (
                            <motion.div key={i} variants={fadeInUp} className="bg-white/60 backdrop-blur-xl p-10 rounded-[3rem] border border-white hover:border-slate-200 transition-all hover:shadow-2xl group">
                                <div className={`w-16 h-16 bg-${card.color}-50 text-${card.color}-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}><card.icon size={32} /></div>
                                <h3 className="text-2xl font-bold mb-4 text-slate-900">{card.title}</h3>
                                <p className="text-slate-500 leading-relaxed text-lg">{card.text}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

                {/* --- LIFESTYLE & WELLNESS --- */}
                <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/60 backdrop-blur-3xl rounded-[4rem] p-10 md:p-20 border border-white shadow-xl">
                    <div className="text-center mb-20 max-w-4xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight">Beyond the Classroom</h2>
                    </div>

                    <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" className="grid md:grid-cols-3 gap-16 items-center">
                        <div className="space-y-16">
                            <motion.div variants={fadeInUp} className="text-center md:text-right group">
                                <div className="inline-flex justify-center md:justify-end w-full mb-4 text-emerald-600 group-hover:scale-110 transition-transform"><Coffee size={40} /></div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">Energy Management</h3>
                                <p className="text-slate-500 leading-relaxed text-lg">Chronic tension drains your battery. Releasing it gives you more energy for hobbies and life.</p>
                            </motion.div>
                            <motion.div variants={fadeInUp} className="text-center md:text-right group">
                                <div className="inline-flex justify-center md:justify-end w-full mb-4 text-emerald-600 group-hover:scale-110 transition-transform"><Smile size={40} /></div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">Emotional Resilience</h3>
                                <p className="text-slate-500 leading-relaxed text-lg">A relaxed body interprets the world as less threatening, helping you handle social conflicts.</p>
                            </motion.div>
                        </div>
                        <motion.div variants={scaleIn} className="relative aspect-square rounded-full border-[10px] border-white shadow-2xl overflow-hidden hidden md:block">
                             <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" alt="Students laughing" className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700" />
                        </motion.div>
                        <div className="space-y-16">
                             <motion.div variants={fadeInUp} className="text-center md:text-left group">
                                <div className="inline-flex justify-center md:justify-start w-full mb-4 text-emerald-600 group-hover:scale-110 transition-transform"><Brain size={40} /></div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">Mental Clarity</h3>
                                <p className="text-slate-500 leading-relaxed text-lg">PMR clears "brain fog," helping you make better decisions about your future and career path.</p>
                            </motion.div>
                            <motion.div variants={fadeInUp} className="text-center md:text-left group">
                                <div className="inline-flex justify-center md:justify-start w-full mb-4 text-emerald-600 group-hover:scale-110 transition-transform"><User size={40} /></div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">Self-Awareness</h3>
                                <p className="text-slate-500 leading-relaxed text-lg">You become attuned to your body's early stress signals, allowing you to intervene before burnout.</p>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.section>

                {/* --- START PRACTICE --- */}
                <section>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-20 space-y-4">
                        <h2 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight">Start Your Practice</h2>
                    </motion.div>
                    
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { img: 'https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f', title: 'Audio Guides', text: 'Download our guided tracks to walk you through the full relaxation sequence.',link:'/resource' },
                            { img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173', title: 'Daily Routine', text: 'The best times are right after waking up or right before going to sleep.',link:'/courses' },
                            { img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998', title: 'Group Sessions', text: 'Join our weekly workshops to practice with peers and learn advanced strategies.',link:'/CommunityFeed' }
                        ].map((card, i) => (
                            <Link to={card.link}>
                            <motion.div key={i} variants={fadeInUp} className="bg-white/60 backdrop-blur-xl rounded-[3rem] overflow-hidden shadow-sm border border-white hover:shadow-2xl transition-all group">
                                <div className="h-56 overflow-hidden"><img src={`${card.img}?q=80&w=2070&auto=format&fit=crop`} alt={card.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" /></div>
                                <div className="p-10">
                                    <h3 className="text-2xl font-bold mb-4 text-slate-900">{card.title}</h3>
                                    <p className="text-slate-500 leading-relaxed text-lg">{card.text}</p>
                                </div>
                            </motion.div>
                            </Link>
                        ))}
                    </motion.div>
                </section>

                {/* --- FOUNDER SECTION --- */}
                <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-600/5 via-emerald-600/5 to-cyan-600/5 rounded-[4rem] blur-3xl" />
                    <div className="relative bg-white/60 backdrop-blur-3xl rounded-[4.5rem] p-12 md:p-24 border border-white shadow-xl text-center overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500" />
                        <motion.div variants={scaleIn} className="w-20 h-20 bg-teal-50 text-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-12 shadow-sm border border-white"><Quote size={40} /></motion.div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-slate-900 tracking-tight">Meet the Founder</h2>
                        <motion.p className="text-2xl md:text-4xl text-slate-800 italic leading-snug mb-16 font-serif max-w-4xl mx-auto">
                            "I created this platform because I believe that <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 font-black">Mental Resilience</span> is the missing link in modern education."
                        </motion.p>
                        <div className="flex flex-col items-center gap-6">
                            <div className="relative">
                                <div className="absolute -inset-2 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full blur-lg opacity-40 animate-pulse" />
                                <img src="/images/Homepage/mam.png" alt="Founder" className="relative w-32 h-32 rounded-full border-4 border-white object-cover shadow-2xl" />
                            </div>
                            <div className="space-y-2 text-center">
                                <h3 className="text-2xl font-bold text-slate-900">Pushpa Oraon</h3>
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm font-black text-teal-600 uppercase tracking-widest">ASSOCIATE PROFESSOR</p>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter max-w-xs mx-auto leading-relaxed">SHRI MATA VAISHNO DEVI COLLEGE OF NURSING, KATRA</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* FOOTER CTA */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center pt-10 pb-20 space-y-10">
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">Ready to master your mind?</h2>
                    <motion.button 
                         whileHover={{ scale: 1.05, y: -5 }}
                         whileTap={{ scale: 0.95 }}
                         onClick={() => navigate('/login')}
                         className="px-16 py-6 bg-slate-900 hover:bg-black text-white text-xl font-bold rounded-full transition-all shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:shadow-teal-500/20"
                    >
                        Join the Community
                    </motion.button>
                </motion.div>

            </div>
        </div>
    );
}