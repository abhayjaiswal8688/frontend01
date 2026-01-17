import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Heart, Users, Sparkles, ArrowRight, Quote, Scale, 
    Sprout, Star, Trophy, Eye, BookOpen, Lightbulb, RefreshCw,
    Briefcase, ShieldCheck, MessageCircle, UserPlus, Compass
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
// FIXED: Increased vertical height and removed bottom constraint to prevent clipping 'g'
const RunningGradientText = ({ text, delay = 0 }) => {
    return (
        <div className="relative inline-block px-2 py-4"> {/* Added py-4 to give space for descenders */}
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
                        backgroundImage: "linear-gradient(to right, #7e22ce, #db2777, #ef4444, #7e22ce)", 
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

export function Homepage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-purple-200 selection:text-purple-900 relative overflow-hidden">
            
            {/* BACKGROUND BLOBS */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <motion.div variants={blobAnimation} animate="animate" className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-200/50 rounded-full blur-[120px] mix-blend-multiply" />
                <motion.div variants={blobAnimation} animate="animate" transition={{ delay: 2 }} className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-200/50 rounded-full blur-[120px] mix-blend-multiply" />
                <motion.div variants={blobAnimation} animate="animate" transition={{ delay: 4 }} className="absolute top-[40%] left-[40%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[100px] mix-blend-multiply" />
            </div>

            {/* --- HERO SECTION --- */}
            <div className="relative z-10 pt-24 pb-32 px-6">
                <div className="max-w-5xl mx-auto text-center space-y-10">
                    
                    {/* Badge */}
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/80 text-purple-900 text-xs font-bold uppercase tracking-widest mb-4 shadow-sm hover:scale-105 transition-transform cursor-default"
                    >
                        <Sparkles size={14} className="text-purple-600 animate-pulse" />
                        <span>Personal & Professional Growth</span>
                    </motion.div>
                    
                    {/* HEADING (Fixed Clipping) */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-slate-900 leading-[0.95] flex flex-col items-center">
                        <div className="text-slate-900 drop-shadow-sm">
                            <LetterStagger text="Mastering" delay={0.2} />
                        </div>
                        <div className="mt-2"> 
                            <RunningGradientText text="Emotional Intelligence" delay={1.0} />
                        </div>
                    </h1>
                    
                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 2.2, duration: 1 }} 
                        className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium"
                    >
                        Your path to stronger relationships, better decision-making, and a more fulfilling life starts with understanding your emotions.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4, duration: 0.8 }}
                        className="pt-8"
                    >
                        <button 
                            onClick={() => navigate('/login')}
                            className="group relative inline-flex items-center gap-3 px-12 py-5 bg-slate-900 text-white rounded-full text-lg font-bold hover:bg-black transition-all hover:scale-105 shadow-2xl hover:shadow-purple-500/20"
                        >
                            Start Your Journey
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
                    className="bg-white/40 backdrop-blur-2xl rounded-[4rem] p-10 md:p-20 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white/80 relative overflow-hidden group"
                >
                    <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" className="space-y-10">
                            <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight tracking-tight">
                                What is Emotional Intelligence?
                            </motion.h2>
                            <div className="space-y-6">
                                <motion.div variants={fadeInUp} className="bg-white/80 backdrop-blur-md p-8 rounded-3xl text-slate-700 leading-relaxed text-lg border border-white shadow-sm">
                                    Emotional intelligence (EQ) is the ability to recognize, understand, and manage our own emotions while skillfully navigating the emotions of others. Unlike IQ, which measures cognitive abilities, EQ focuses on how we process emotional information.
                                </motion.div>
                                <motion.div variants={fadeInUp} className="bg-white/80 backdrop-blur-md p-8 rounded-3xl text-slate-700 leading-relaxed text-lg border border-white shadow-sm">
                                    First conceptualized by psychologists Peter Salovey and John Mayer in 1990, the concept was popularized by Daniel Goleman, whose research showed that EQ often matters more than IQ in determining success.
                                </motion.div>
                            </div>
                        </motion.div>

                        <div className="flex flex-col gap-8">
                            <motion.div variants={scaleIn} className="rounded-[3.5rem] overflow-hidden shadow-2xl border-[12px] border-white/50 bg-slate-900 aspect-square group">
                                <img src="/images/Homepage/brain.png" alt="3D Brain Illustration" className="w-full h-full object-cover opacity-90 group-hover:scale-110 group-hover:opacity-100 transition-all duration-1000" />
                            </motion.div>
                        </div>
                    </div>
                </motion.section>

                {/* SECTION 2: THE FOUR PILLARS */}
                <section>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-20 max-w-3xl mx-auto space-y-4">
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">The Four Pillars</h2>
                        <p className="text-slate-500 text-xl font-light">These components work together to create a complete framework for emotional mastery.</p>
                    </motion.div>

                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        
                        <motion.div variants={fadeInUp} className="group bg-white/60 backdrop-blur-xl p-10 rounded-[3rem] border border-white/80 hover:border-purple-200 transition-all hover:-translate-y-3">
                            <div className="w-16 h-16 bg-green-50 text-green-700 rounded-2xl flex items-center justify-center mb-8 shadow-inner transition-transform group-hover:scale-110"><Sprout size={32} /></div>
                            <h3 className="text-2xl font-bold mb-4 text-slate-900">Self-Awareness</h3>
                            <p className="text-slate-500 leading-relaxed text-lg">Recognizing your own emotions as they occur.</p>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="group bg-white/60 backdrop-blur-xl p-10 rounded-[3rem] border border-white/80 hover:border-purple-200 transition-all hover:-translate-y-3">
                            <div className="w-16 h-16 bg-indigo-50 text-indigo-700 rounded-2xl flex items-center justify-center mb-8 shadow-inner transition-transform group-hover:scale-110"><Scale size={32} /></div>
                            <h3 className="text-2xl font-bold mb-4 text-slate-900">Self-Regulation</h3>
                            <p className="text-slate-500 leading-relaxed text-lg">Managing emotions and adapting to circumstances.</p>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="group bg-white/60 backdrop-blur-xl p-10 rounded-[3rem] border border-white/80 hover:border-purple-200 transition-all hover:-translate-y-3">
                            <div className="w-16 h-16 bg-purple-50 text-purple-700 rounded-2xl flex items-center justify-center mb-8 shadow-inner transition-transform group-hover:scale-110"><Star size={32} /></div>
                            <h3 className="text-2xl font-bold mb-4 text-slate-900">Social Awareness</h3>
                            <p className="text-slate-500 leading-relaxed text-lg">Understanding others' emotions and perspectives.</p>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="md:col-span-2 bg-gradient-to-br from-white to-pink-50/50 backdrop-blur-xl p-12 rounded-[3.5rem] border border-white/80 relative group overflow-hidden flex flex-col justify-between hover:shadow-2xl transition-all">
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform"><Heart size={32} /></div>
                                <h3 className="text-3xl font-bold mb-4 text-slate-900">Relationship Management</h3>
                                <p className="text-slate-500 leading-relaxed text-xl max-w-md mb-8">Navigating interactions and resolving conflicts.</p>
                            </div>
                            <div className="relative z-10 bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-pink-100/50 max-w-lg ml-auto">
                                <p className="text-pink-900 font-medium italic leading-relaxed">"These four components work together as the foundation of emotional intelligence, each building upon the others."</p>
                            </div>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="bg-slate-900 text-white p-12 rounded-[3.5rem] shadow-2xl flex flex-col justify-between hover:scale-[1.03] transition-all duration-500 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px]" />
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 text-white backdrop-blur-md border border-white/10 group-hover:rotate-12 transition-transform"><Trophy size={32} /></div>
                                <h3 className="text-3xl font-bold mb-4">Why It Matters</h3>
                                <p className="text-slate-400 leading-relaxed text-lg">Research consistently shows that individuals with high EQ tend to have stronger relationships and greater workplace success.</p>
                            </div>
                            <div className="mt-8 pt-8 border-t border-white/10 relative z-10">
                                <span className="text-xs font-bold text-purple-400 uppercase tracking-[0.3em]">Success Metric</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* SECTION 3: DEVELOPING SELF-AWARENESS */}
                <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/40 backdrop-blur-3xl rounded-[4rem] p-10 md:p-20 border border-white/80 shadow-[0_30px_60px_rgba(0,0,0,0.02)]">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" className="space-y-14">
                            <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight tracking-tight">Developing Emotional Self-Awareness</motion.h2>
                            <div className="space-y-10">
                                {[
                                    { icon: Eye, color: 'purple', title: 'Recognize Emotions', text: 'Learn to identify what you\'re feeling in the moment, naming specific emotions rather than general states.' },
                                    { icon: BookOpen, color: 'pink', title: 'Track Patterns', text: 'Keep an emotion journal to document triggers, reactions, and patterns in your emotional responses.' },
                                    { icon: Lightbulb, color: 'blue', title: 'Identify Triggers', text: 'Pinpoint specific situations, interactions, or thoughts that consistently prompt strong emotional reactions.' },
                                    { icon: RefreshCw, color: 'green', title: 'Practice Reflection', text: 'Set aside time daily to reflect on emotional experiences and consider alternative perspectives.' }
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
                            <img src="https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1887&auto=format&fit=crop" alt="Woman writing in journal outdoors" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                        </motion.div>
                    </div>
                </motion.section>

                {/* --- WORKPLACE APPLICATIONS --- */}
                <section>
                     <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-20 space-y-4">
                        <h2 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight">Practical Applications in the Workplace</h2>
                    </motion.div>

                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <motion.div variants={fadeInUp} className="bg-white/60 backdrop-blur-xl p-10 rounded-[3rem] border border-white hover:border-slate-200 hover:shadow-2xl transition-all group">
                            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform"><Briefcase size={32} /></div>
                            <h3 className="text-2xl font-bold mb-4 text-slate-900">Emotionally Intelligent Leadership</h3>
                            <p className="text-slate-500 leading-relaxed text-lg">Leaders with high EQ create psychologically safe environments where team members feel valued, understood, and motivated to perform at their best.</p>
                        </motion.div>
                        <motion.div variants={fadeInUp} className="bg-white/60 backdrop-blur-xl p-10 rounded-[3rem] border border-white hover:border-slate-200 hover:shadow-2xl transition-all group">
                            <div className="w-16 h-16 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform"><ShieldCheck size={32} /></div>
                            <h3 className="text-2xl font-bold mb-4 text-slate-900">Conflict Resolution Mastery</h3>
                            <p className="text-slate-500 leading-relaxed text-lg">EQ enables professionals to address conflicts constructively by understanding underlying emotions, managing reactions, and finding win-win solutions.</p>
                        </motion.div>
                        <motion.div variants={fadeInUp} className="bg-white/60 backdrop-blur-xl p-10 rounded-[3rem] border border-white hover:border-slate-200 hover:shadow-2xl transition-all group">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform"><Users size={32} /></div>
                            <h3 className="text-2xl font-bold mb-4 text-slate-900">Enhanced Team Dynamics</h3>
                            <p className="text-slate-500 leading-relaxed text-lg">Teams with emotionally intelligent members communicate more effectively, collaborate more successfully, and demonstrate greater resilience during challenges.</p>
                        </motion.div>
                    </motion.div>
                </section>

                {/* --- PERSONAL RELATIONSHIPS --- */}
                <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/60 backdrop-blur-3xl rounded-[4rem] p-10 md:p-20 border border-white shadow-xl">
                    <div className="text-center mb-20 max-w-4xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight">Emotional Intelligence in Personal Relationships</h2>
                    </div>

                    <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" className="grid md:grid-cols-3 gap-16 items-center">
                        <div className="space-y-16">
                            <motion.div variants={fadeInUp} className="text-center md:text-right group">
                                <div className="inline-flex justify-center md:justify-end w-full mb-4 text-pink-600 group-hover:scale-110 transition-transform"><UserPlus size={40} /></div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">Deeper Connection</h3>
                                <p className="text-slate-500 leading-relaxed text-lg">Understanding your own and others' emotional needs creates authentic bonds built on mutual respect and empathy.</p>
                            </motion.div>
                            <motion.div variants={fadeInUp} className="text-center md:text-right group">
                                <div className="inline-flex justify-center md:justify-end w-full mb-4 text-pink-600 group-hover:scale-110 transition-transform"><Heart size={40} /></div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">Empathetic Presence</h3>
                                <p className="text-slate-500 leading-relaxed text-lg">Truly understanding others' perspectives creates space for genuine connection and mutual growth.</p>
                            </motion.div>
                        </div>
                        <motion.div variants={scaleIn} className="relative aspect-square rounded-full border-[10px] border-white shadow-2xl overflow-hidden hidden md:block">
                             <img src="https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2070&auto=format&fit=crop" alt="Friends connecting" className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700" />
                        </motion.div>
                        <div className="space-y-16">
                             <motion.div variants={fadeInUp} className="text-center md:text-left group">
                                <div className="inline-flex justify-center md:justify-start w-full mb-4 text-pink-600 group-hover:scale-110 transition-transform"><MessageCircle size={40} /></div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">Effective Communication</h3>
                                <p className="text-slate-500 leading-relaxed text-lg">Expressing feelings clearly while listening empathetically transforms how you share thoughts and resolve misunderstandings.</p>
                            </motion.div>
                            <motion.div variants={fadeInUp} className="text-center md:text-left group">
                                <div className="inline-flex justify-center md:justify-start w-full mb-4 text-pink-600 group-hover:scale-110 transition-transform"><Compass size={40} /></div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">Conflict Navigation</h3>
                                <p className="text-slate-500 leading-relaxed text-lg">Approaching disagreements with emotional awareness helps address the root causes rather than surface symptoms.</p>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.section>

                {/* --- TRAINING TECHNIQUES --- */}
                <section>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-20 space-y-4">
                        <h2 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight">Training and Improvement Techniques</h2>
                    </motion.div>
                    
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <Link to='/resource'>
                        <motion.div variants={fadeInUp} className="bg-white/60 backdrop-blur-xl rounded-[3rem] overflow-hidden shadow-sm border border-white hover:shadow-2xl transition-all group">
                            <div className="h-56 overflow-hidden"><img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2000&auto=format&fit=crop" alt="Meditation" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" /></div>
                            <div className="p-10">
                                <h3 className="text-2xl font-bold mb-4 text-slate-900">Mindfulness Practices</h3>
                                <p className="text-slate-500 leading-relaxed text-lg">Regular meditation and mindfulness exercises strengthen your ability to observe emotions without immediate reaction.</p>
                            </div>
                        </motion.div>
                        </Link>
                        <Link to='/courses'>
                         <motion.div variants={fadeInUp} className="bg-white/60 backdrop-blur-xl rounded-[3rem] overflow-hidden shadow-sm border border-white hover:shadow-2xl transition-all group">
                            <div className="h-56 overflow-hidden"><img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop" alt="Coaching" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" /></div>
                            <div className="p-10">
                                <h3 className="text-2xl font-bold mb-4 text-slate-900">Professional Coaching</h3>
                                <p className="text-slate-500 leading-relaxed text-lg">Working with an EQ coach provides personalized strategies and feedback to address specific emotional intelligence challenges.</p>
                            </div>
                        </motion.div>
                        </Link>
                         <Link to='/test'>
                         <motion.div variants={fadeInUp} className="bg-white/60 backdrop-blur-xl rounded-[3rem] overflow-hidden shadow-sm border border-white hover:shadow-2xl transition-all group">
                            <div className="h-56 overflow-hidden"><img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop" alt="Analysis" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" /></div>
                            <div className="p-10">
                                <h3 className="text-2xl font-bold mb-4 text-slate-900">Assessment Tools</h3>
                                <p className="text-slate-500 leading-relaxed text-lg">Validated EQ assessments like the Emotional and Social Competency Inventory (ESCI) provide objective feedback.</p>
                            </div>
                        </motion.div>
                        </Link>
                    </motion.div>
                </section>

                {/* --- FOUNDER SECTION --- */}
                <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/60 backdrop-blur-3xl rounded-[4rem] p-12 md:p-24 border border-white shadow-xl text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500" />
                    <div className="max-w-4xl mx-auto pt-8">
                        <motion.div variants={scaleIn} className="w-20 h-20 bg-purple-50 text-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-12 shadow-sm border border-white"><Quote size={40} /></motion.div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-slate-900 tracking-tight">Meet the Founder</h2>
                        <p className="text-2xl md:text-4xl text-slate-800 italic leading-snug mb-16 font-serif">"I created this platform because I believe that <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-black">Emotional Intelligence</span> is the missing link in modern education. It's not just about feeling better—it's about being better."</p>
                        <div className="flex flex-col items-center justify-center gap-6">
                            <motion.div variants={scaleIn} className="p-1.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-2xl">
                                <img src="/images/Homepage/mam.png" alt="Founder" className="w-28 h-28 rounded-full border-[6px] border-white object-cover shadow-inner" />
                            </motion.div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-slate-900">Pushpa Oraon</h3>
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm font-black text-purple-600 uppercase tracking-widest">ASSOCIATE PROFESSOR</p>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter max-w-xs mx-auto leading-relaxed">SHRI MATA VAISHNO DEVI COLLEGE OF NURSING,KATRA, JAMMU</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* FOOTER CTA */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center pt-10 pb-20 space-y-10">
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">Ready to start your journey?</h2>
                    <motion.button 
                         whileHover={{ scale: 1.05, y: -5 }}
                         whileTap={{ scale: 0.95 }}
                         onClick={() => navigate('/login')}
                         className="px-16 py-6 bg-slate-900 hover:bg-black text-white text-xl font-bold rounded-full transition-all shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:shadow-purple-500/20"
                    >
                        Join the Community
                    </motion.button>
                </motion.div>

            </div>
        </div>
    );
}