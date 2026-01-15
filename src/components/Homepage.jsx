import React from 'react';
import { useNavigate } from 'react-router-dom';
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
                        backgroundImage: "linear-gradient(to right, #7e22ce, #db2777, #ef4444, #7e22ce)", 
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

export function Homepage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-100 text-slate-800 font-sans selection:bg-pink-200 relative overflow-hidden">
            
            {/* BACKGROUND BLOBS */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <motion.div variants={blobAnimation} animate="animate" className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-300/40 rounded-full blur-[120px] mix-blend-multiply" />
                <motion.div variants={blobAnimation} animate="animate" transition={{ delay: 2 }} className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-300/40 rounded-full blur-[120px] mix-blend-multiply" />
                <motion.div variants={blobAnimation} animate="animate" transition={{ delay: 4 }} className="absolute top-[40%] left-[40%] w-[40%] h-[40%] bg-blue-200/40 rounded-full blur-[100px] mix-blend-multiply" />
            </div>

            {/* --- HERO SECTION --- */}
            <div className="relative z-10 pt-16 pb-32 px-6">
                <div className="max-w-5xl mx-auto text-center space-y-8">
                    
                    {/* Badge */}
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/50 text-purple-900 text-sm font-bold mb-4 shadow-sm hover:scale-105 transition-transform cursor-default"
                    >
                        <Sparkles size={16} className="text-purple-600 animate-pulse" />
                        <span>Personal & Professional Growth</span>
                    </motion.div>
                    
                    {/* --- NEW ANIMATED HEADING (Reduced Size) --- */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1] drop-shadow-sm flex flex-col items-center">
                        <div className="text-slate-900">
                            <LetterStagger text="Mastering" delay={0.2} />
                        </div>
                        <div className="-mt-1 md:-mt-2 pb-2"> 
                            <RunningGradientText text="Emotional Intelligence" delay={1.0} />
                        </div>
                    </h1>
                    
                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 2.2, duration: 1 }} 
                        className="text-xl text-slate-700 max-w-2xl mx-auto leading-relaxed font-medium"
                    >
                        Your path to stronger relationships, better decision-making, and a more fulfilling life starts with understanding your emotions.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2.4, duration: 0.8 }}
                        className="pt-8"
                    >
                        <button 
                            onClick={() => navigate('/login')}
                            className="group relative inline-flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-full text-lg font-semibold hover:bg-slate-800 transition-all hover:scale-105 shadow-xl hover:shadow-purple-900/20"
                        >
                            Start Your Journey
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
                                What is Emotional Intelligence?
                            </motion.h2>
                            <div className="space-y-6">
                                <motion.div variants={fadeInUp} className="bg-white/60 p-6 rounded-2xl text-slate-800 leading-relaxed text-lg border-l-4 border-pink-400 shadow-sm">
                                    Emotional intelligence (EQ) is the ability to recognize, understand, and manage our own emotions while skillfully navigating the emotions of others. Unlike IQ, which measures cognitive abilities, EQ focuses on how we process emotional information.
                                </motion.div>
                                <motion.div variants={fadeInUp} className="bg-white/60 p-6 rounded-2xl text-slate-800 leading-relaxed text-lg border-l-4 border-purple-400 shadow-sm">
                                    First conceptualized by psychologists Peter Salovey and John Mayer in 1990, the concept was popularized by Daniel Goleman, whose research showed that EQ often matters more than IQ in determining success.
                                </motion.div>
                            </div>
                        </motion.div>

                        <div className="flex flex-col gap-8">
                            <motion.div variants={scaleIn} className="rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/40 bg-black aspect-square md:aspect-auto h-full max-h-[500px]">
                                <img src="/images/Homepage/brain.png" alt="3D Brain Illustration" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700" />
                            </motion.div>
                        </div>
                    </div>
                </motion.section>

                {/* SECTION 2: THE FOUR PILLARS */}
                <section>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16 max-w-2xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif text-slate-900">The Four Pillars</h2>
                        <p className="text-slate-700 text-lg font-medium">These components work together to create a complete framework for emotional mastery.</p>
                    </motion.div>

                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* 1. Self-Awareness */}
                        <motion.div variants={fadeInUp} className="bg-white/60 backdrop-blur-md p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl border border-white/50 transition-all hover:-translate-y-2">
                            <div className="w-14 h-14 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center mb-6 shadow-sm"><Sprout size={28} /></div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900">Self-Awareness</h3>
                            <p className="text-slate-600 leading-relaxed">Recognizing your own emotions as they occur.</p>
                        </motion.div>

                        {/* 2. Self-Regulation */}
                        <motion.div variants={fadeInUp} className="bg-white/60 backdrop-blur-md p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl border border-white/50 transition-all hover:-translate-y-2">
                            <div className="w-14 h-14 bg-indigo-100 text-indigo-700 rounded-2xl flex items-center justify-center mb-6 shadow-sm"><Scale size={28} /></div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900">Self-Regulation</h3>
                            <p className="text-slate-600 leading-relaxed">Managing emotions and adapting to circumstances.</p>
                        </motion.div>

                        {/* 3. Social Awareness */}
                        <motion.div variants={fadeInUp} className="bg-white/60 backdrop-blur-md p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl border border-white/50 transition-all hover:-translate-y-2">
                            <div className="w-14 h-14 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center mb-6 shadow-sm"><Star size={28} /></div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900">Social Awareness</h3>
                            <p className="text-slate-600 leading-relaxed">Understanding others' emotions and perspectives.</p>
                        </motion.div>

                        {/* 4. Relationship Management */}
                        <motion.div variants={fadeInUp} className="md:col-span-2 bg-gradient-to-br from-white/70 to-pink-100/50 backdrop-blur-md p-8 md:p-10 rounded-[2.5rem] border border-white/50 relative group overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm"><Heart size={28} /></div>
                                <h3 className="text-2xl font-bold mb-4 text-slate-900">Relationship Management</h3>
                                <p className="text-slate-600 leading-relaxed max-w-md mb-8">Navigating interactions and resolving conflicts.</p>
                            </div>
                            <div className="relative z-10 bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/50 max-w-lg ml-auto mt-4 md:-mt-12 md:translate-y-4">
                                <p className="text-pink-900 font-medium italic leading-relaxed text-sm">"These four components work together as the foundation of emotional intelligence, each building upon the others."</p>
                            </div>
                        </motion.div>

                        {/* 5. Success Metric */}
                        <motion.div variants={fadeInUp} className="bg-slate-900 text-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-900/20 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-white backdrop-blur-sm"><Trophy size={28} /></div>
                                <h3 className="text-2xl font-bold mb-4">Why It Matters</h3>
                                <p className="text-slate-300 leading-relaxed">Research consistently shows that individuals with high EQ tend to have stronger relationships and greater workplace success.</p>
                            </div>
                            <div className="mt-8 pt-8 border-t border-white/10 relative z-10">
                                <span className="text-sm font-medium text-purple-300 uppercase tracking-widest">Success Metric</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* SECTION 3: DEVELOPING SELF-AWARENESS */}
                <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 lg:p-16 shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/50 overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" className="space-y-12">
                            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold font-serif text-slate-900 leading-tight">Developing Emotional Self-Awareness</motion.h2>
                            <div className="space-y-8">
                                {[
                                    { icon: Eye, color: 'purple', title: 'Recognize Emotions', text: 'Learn to identify what you\'re feeling in the moment, naming specific emotions rather than general states.' },
                                    { icon: BookOpen, color: 'pink', title: 'Track Patterns', text: 'Keep an emotion journal to document triggers, reactions, and patterns in your emotional responses.' },
                                    { icon: Lightbulb, color: 'blue', title: 'Identify Triggers', text: 'Pinpoint specific situations, interactions, or thoughts that consistently prompt strong emotional reactions.' },
                                    { icon: RefreshCw, color: 'green', title: 'Practice Reflection', text: 'Set aside time daily to reflect on emotional experiences and consider alternative perspectives.' }
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
                            <img src="https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1887&auto=format&fit=crop" alt="Woman writing in journal outdoors" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                        </motion.div>
                    </div>
                </motion.section>

                {/* --- WORKPLACE APPLICATIONS --- */}
                <section>
                     <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16 max-w-2xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif text-slate-900">Practical Applications in the Workplace</h2>
                    </motion.div>

                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div variants={fadeInUp} className="bg-white/60 backdrop-blur-md p-8 rounded-[2rem] shadow-sm border border-white/50 hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm"><Briefcase size={28} /></div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900">Emotionally Intelligent Leadership</h3>
                            <p className="text-slate-600 leading-relaxed">Leaders with high EQ create psychologically safe environments where team members feel valued, understood, and motivated to perform at their best.</p>
                        </motion.div>
                        <motion.div variants={fadeInUp} className="bg-white/60 backdrop-blur-md p-8 rounded-[2rem] shadow-sm border border-white/50 hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="w-14 h-14 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm"><ShieldCheck size={28} /></div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900">Conflict Resolution Mastery</h3>
                            <p className="text-slate-600 leading-relaxed">EQ enables professionals to address conflicts constructively by understanding underlying emotions, managing reactions, and finding win-win solutions.</p>
                        </motion.div>
                        <motion.div variants={fadeInUp} className="bg-white/60 backdrop-blur-md p-8 rounded-[2rem] shadow-sm border border-white/50 hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm"><Users size={28} /></div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900">Enhanced Team Dynamics</h3>
                            <p className="text-slate-600 leading-relaxed">Teams with emotionally intelligent members communicate more effectively, collaborate more successfully, and demonstrate greater resilience during challenges.</p>
                        </motion.div>
                    </motion.div>
                </section>

                {/* --- PERSONAL RELATIONSHIPS --- */}
                <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-gradient-to-br from-white/60 to-pink-50/50 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-16 shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/50">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif text-slate-900">Emotional Intelligence in Personal Relationships</h2>
                    </div>

                    <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" className="grid md:grid-cols-3 gap-12 items-center">
                        <div className="space-y-12">
                            <motion.div variants={fadeInUp} className="text-center md:text-right">
                                <div className="inline-flex justify-center md:justify-end w-full mb-3 text-pink-600"><UserPlus size={32} /></div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Deeper Connection</h3>
                                <p className="text-slate-600 leading-relaxed">Understanding your own and others' emotional needs creates authentic bonds built on mutual respect and empathy.</p>
                            </motion.div>
                            <motion.div variants={fadeInUp} className="text-center md:text-right">
                                <div className="inline-flex justify-center md:justify-end w-full mb-3 text-pink-600"><Heart size={32} /></div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Empathetic Presence</h3>
                                <p className="text-slate-600 leading-relaxed">Truly understanding others' perspectives creates space for genuine connection and mutual growth.</p>
                            </motion.div>
                        </div>
                        <motion.div variants={scaleIn} className="relative aspect-square rounded-full border-[6px] border-white/50 shadow-2xl overflow-hidden hidden md:block">
                             <img src="https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2070&auto=format&fit=crop" alt="Friends connecting" className="w-full h-full object-cover" />
                        </motion.div>
                        <div className="space-y-12">
                             <motion.div variants={fadeInUp} className="text-center md:text-left">
                                <div className="inline-flex justify-center md:justify-start w-full mb-3 text-pink-600"><MessageCircle size={32} /></div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Effective Communication</h3>
                                <p className="text-slate-600 leading-relaxed">Expressing feelings clearly while listening empathetically transforms how you share thoughts and resolve misunderstandings.</p>
                            </motion.div>
                            <motion.div variants={fadeInUp} className="text-center md:text-left">
                                <div className="inline-flex justify-center md:justify-start w-full mb-3 text-pink-600"><Compass size={32} /></div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Conflict Navigation</h3>
                                <p className="text-slate-600 leading-relaxed">Approaching disagreements with emotional awareness helps address the root causes rather than surface symptoms.</p>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.section>

                {/* --- TRAINING TECHNIQUES --- */}
                <section>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16 max-w-2xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif text-slate-900">Training and Improvement Techniques</h2>
                    </motion.div>
                    
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div variants={fadeInUp} className="bg-white/70 backdrop-blur-md rounded-[2rem] overflow-hidden shadow-sm border border-white/50 hover:shadow-lg transition-all">
                            <div className="h-48 overflow-hidden"><img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2000&auto=format&fit=crop" alt="Meditation" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" /></div>
                            <div className="p-8">
                                <h3 className="text-xl font-bold mb-3 text-slate-900">Mindfulness Practices</h3>
                                <p className="text-slate-600 leading-relaxed">Regular meditation and mindfulness exercises strengthen your ability to observe emotions without immediate reaction.</p>
                            </div>
                        </motion.div>
                         <motion.div variants={fadeInUp} className="bg-white/70 backdrop-blur-md rounded-[2rem] overflow-hidden shadow-sm border border-white/50 hover:shadow-lg transition-all">
                            <div className="h-48 overflow-hidden"><img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop" alt="Coaching" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" /></div>
                            <div className="p-8">
                                <h3 className="text-xl font-bold mb-3 text-slate-900">Professional Coaching</h3>
                                <p className="text-slate-600 leading-relaxed">Working with an EQ coach provides personalized strategies and feedback to address specific emotional intelligence challenges.</p>
                            </div>
                        </motion.div>
                         <motion.div variants={fadeInUp} className="bg-white/70 backdrop-blur-md rounded-[2rem] overflow-hidden shadow-sm border border-white/50 hover:shadow-lg transition-all">
                            <div className="h-48 overflow-hidden"><img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop" alt="Analysis" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" /></div>
                            <div className="p-8">
                                <h3 className="text-xl font-bold mb-3 text-slate-900">Assessment Tools</h3>
                                <p className="text-slate-600 leading-relaxed">Validated EQ assessments like the Emotional and Social Competency Inventory (ESCI) provide objective feedback.</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* --- FOUNDER SECTION --- */}
                <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-16 shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/50 text-center relative">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500" />
                    <div className="max-w-3xl mx-auto pt-8">
                        <motion.div variants={scaleIn} className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"><Quote size={32} /></motion.div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">Meet the Founder</h2>
                        <p className="text-xl md:text-2xl text-slate-700 italic leading-relaxed mb-10 font-serif">"I created this platform because I believe that <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-bold">Emotional Intelligence</span> is the missing link in modern education. It's not just about feeling better—it's about being better."</p>
                        <div className="flex flex-col items-center justify-center gap-4">
                            <motion.div variants={scaleIn} className="p-1.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg">
                                <img src="/images/Homepage/mam.png" alt="Founder" className="w-20 h-20 rounded-full border-4 border-white object-cover" />
                            </motion.div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Pushpa Oraon</h3>
                                <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mt-1">ASSOCIATE PROFESSOR</p>
                                <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mt-1">SHRI MATA VAISHNO DEVI COLLEGE OF NURSING,KATRA, JAMMU</p>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* FOOTER CTA */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center pb-8">
                    <h2 className="text-3xl font-bold mb-8 text-slate-900">Ready to start your journey?</h2>
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