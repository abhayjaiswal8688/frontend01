import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Heart, Users, Sparkles, ArrowRight, Quote, Scale, 
    Sprout, Star, Trophy, Eye, BookOpen, Lightbulb, RefreshCw,
    Briefcase, ShieldCheck, MessageCircle, UserPlus, Compass
} from 'lucide-react';

export function Homepage() {
    const navigate = useNavigate();

    return (
        // 1. CHANGED: Deep, vibrant gradient background instead of white
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-100 text-slate-800 font-sans selection:bg-pink-200 relative overflow-hidden">
            
            {/* 2. ADDED: Vivid Aurora Background Blobs */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-300/40 rounded-full blur-[120px] mix-blend-multiply animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-300/40 rounded-full blur-[120px] mix-blend-multiply" />
                <div className="absolute top-[40%] left-[40%] w-[40%] h-[40%] bg-blue-200/40 rounded-full blur-[100px] mix-blend-multiply" />
            </div>

            {/* --- HERO SECTION --- */}
            <div className="relative z-10 pt-12 pb-32 px-6">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    {/* Glass Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/50 text-purple-900 text-sm font-bold mb-4 shadow-sm hover:scale-105 transition-transform cursor-default">
                        <Sparkles size={16} className="text-purple-600" />
                        <span>Personal & Professional Growth</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1] drop-shadow-sm">
                        Mastering <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-pink-600 to-rose-600">
                            Emotional Intelligence
                        </span>
                    </h1>
                    
                    <p className="text-xl text-slate-700 max-w-2xl mx-auto leading-relaxed font-medium">
                        Your path to stronger relationships, better decision-making, and a more fulfilling life starts with understanding your emotions.
                    </p>

                    <div className="pt-8">
                        <button 
                            onClick={() => navigate('/login')}
                            className="group relative inline-flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-full text-lg font-semibold hover:bg-slate-800 transition-all hover:scale-105 shadow-xl hover:shadow-purple-900/20"
                        >
                            Start Your Journey
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* --- CONTENT CONTAINER --- */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24 space-y-32">

                {/* SECTION 1: DEFINITION */}
                {/* 3. CHANGED: Glassmorphism Card (bg-white/60) to let background show through */}
                <section className="bg-white/60 backdrop-blur-xl rounded-[3rem] p-8 md:p-16 shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/50 relative overflow-hidden group">
                    
                    <div className="relative z-10 grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div className="space-y-8">
                            <h2 className="text-4xl md:text-5xl font-bold font-serif text-slate-900 leading-tight">
                                What is Emotional Intelligence?
                            </h2>
                            <div className="space-y-6">
                                <div className="bg-white/60 p-6 rounded-2xl text-slate-800 leading-relaxed text-lg border-l-4 border-pink-400 shadow-sm">
                                    Emotional intelligence (EQ) is the ability to recognize, understand, and manage our own emotions while skillfully navigating the emotions of others. Unlike IQ, which measures cognitive abilities, EQ focuses on how we process emotional information.
                                </div>
                                <div className="bg-white/60 p-6 rounded-2xl text-slate-800 leading-relaxed text-lg border-l-4 border-purple-400 shadow-sm">
                                    First conceptualized by psychologists Peter Salovey and John Mayer in 1990, the concept was popularized by Daniel Goleman, whose research showed that EQ often matters more than IQ in determining success.
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-8">
                            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/40 bg-black aspect-square md:aspect-auto h-full max-h-[500px]">
                                <img 
                                    src="/images/Homepage/brain.png" 
                                    alt="3D Brain Illustration" 
                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 2: THE FOUR PILLARS */}
                <section>
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif text-slate-900">The Four Pillars</h2>
                        <p className="text-slate-700 text-lg font-medium">These components work together to create a complete framework for emotional mastery.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* 1. Self-Awareness */}
                        <div className="bg-white/60 backdrop-blur-md p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl border border-white/50 transition-all hover:-translate-y-2">
                            <div className="w-14 h-14 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                <Sprout size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900">Self-Awareness</h3>
                            <p className="text-slate-600 leading-relaxed">Recognizing your own emotions as they occur.</p>
                        </div>

                        {/* 2. Self-Regulation */}
                        <div className="bg-white/60 backdrop-blur-md p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl border border-white/50 transition-all hover:-translate-y-2">
                            <div className="w-14 h-14 bg-indigo-100 text-indigo-700 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                <Scale size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900">Self-Regulation</h3>
                            <p className="text-slate-600 leading-relaxed">Managing emotions and adapting to circumstances.</p>
                        </div>

                        {/* 3. Social Awareness */}
                        <div className="bg-white/60 backdrop-blur-md p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl border border-white/50 transition-all hover:-translate-y-2">
                            <div className="w-14 h-14 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                <Star size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900">Social Awareness</h3>
                            <p className="text-slate-600 leading-relaxed">Understanding others' emotions and perspectives.</p>
                        </div>

                        {/* 4. Relationship Management */}
                        <div className="md:col-span-2 bg-gradient-to-br from-white/70 to-pink-100/50 backdrop-blur-md p-8 md:p-10 rounded-[2.5rem] border border-white/50 relative group overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                    <Heart size={28} />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-slate-900">Relationship Management</h3>
                                <p className="text-slate-600 leading-relaxed max-w-md mb-8">
                                    Navigating interactions and resolving conflicts.
                                </p>
                            </div>
                            <div className="relative z-10 bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/50 max-w-lg ml-auto mt-4 md:-mt-12 md:translate-y-4">
                                <p className="text-pink-900 font-medium italic leading-relaxed text-sm">
                                    "These four components work together as the foundation of emotional intelligence, each building upon the others."
                                </p>
                            </div>
                        </div>

                        {/* 5. Success Metric */}
                        <div className="bg-slate-900 text-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-900/20 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden">
                             {/* Decorative glow */}
                             <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-white backdrop-blur-sm">
                                    <Trophy size={28} />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Why It Matters</h3>
                                <p className="text-slate-300 leading-relaxed">
                                    Research consistently shows that individuals with high EQ tend to have stronger relationships and greater workplace success.
                                </p>
                            </div>
                            <div className="mt-8 pt-8 border-t border-white/10 relative z-10">
                                <span className="text-sm font-medium text-purple-300 uppercase tracking-widest">Success Metric</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: DEVELOPING SELF-AWARENESS */}
                <section className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 lg:p-16 shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/50 overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div className="space-y-12">
                            <h2 className="text-4xl md:text-5xl font-bold font-serif text-slate-900 leading-tight">
                                Developing Emotional Self-Awareness
                            </h2>
                            <div className="space-y-8">
                                <div className="flex gap-6 group">
                                    <div className="shrink-0 w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mt-1 group-hover:scale-110 transition-transform shadow-sm">
                                        <Eye size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">Recognize Emotions</h3>
                                        <p className="text-slate-600 leading-relaxed">
                                            Learn to identify what you're feeling in the moment, naming specific emotions rather than general states like "good" or "bad."
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-6 group">
                                    <div className="shrink-0 w-12 h-12 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center mt-1 group-hover:scale-110 transition-transform shadow-sm">
                                        <BookOpen size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">Track Patterns</h3>
                                        <p className="text-slate-600 leading-relaxed">
                                            Keep an emotion journal to document triggers, reactions, and patterns in your emotional responses throughout the day.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-6 group">
                                    <div className="shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mt-1 group-hover:scale-110 transition-transform shadow-sm">
                                        <Lightbulb size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">Identify Triggers</h3>
                                        <p className="text-slate-600 leading-relaxed">
                                            Pinpoint specific situations, interactions, or thoughts that consistently prompt strong emotional reactions.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-6 group">
                                    <div className="shrink-0 w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mt-1 group-hover:scale-110 transition-transform shadow-sm">
                                        <RefreshCw size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">Practice Reflection</h3>
                                        <p className="text-slate-600 leading-relaxed">
                                            Set aside time daily to reflect on emotional experiences and consider alternative perspectives and responses.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="h-full min-h-[500px] md:h-auto relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/50">
                            <img 
                                src="https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1887&auto=format&fit=crop" 
                                alt="Woman writing in journal outdoors" 
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                            />
                        </div>
                    </div>
                </section>

                {/* --- NEW SECTION: WORKPLACE APPLICATIONS --- */}
                <section>
                     <div className="text-center mb-16 max-w-2xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif text-slate-900">Practical Applications in the Workplace</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* 1. Leadership */}
                        <div className="bg-white/60 backdrop-blur-md p-8 rounded-[2rem] shadow-sm border border-white/50 hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                <Briefcase size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900">Emotionally Intelligent Leadership</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Leaders with high EQ create psychologically safe environments where team members feel valued, understood, and motivated to perform at their best.
                            </p>
                        </div>

                        {/* 2. Conflict */}
                        <div className="bg-white/60 backdrop-blur-md p-8 rounded-[2rem] shadow-sm border border-white/50 hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="w-14 h-14 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                <ShieldCheck size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900">Conflict Resolution Mastery</h3>
                            <p className="text-slate-600 leading-relaxed">
                                EQ enables professionals to address conflicts constructively by understanding underlying emotions, managing reactions, and finding win-win solutions.
                            </p>
                        </div>

                        {/* 3. Team Dynamics */}
                        <div className="bg-white/60 backdrop-blur-md p-8 rounded-[2rem] shadow-sm border border-white/50 hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                <Users size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900">Enhanced Team Dynamics</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Teams with emotionally intelligent members communicate more effectively, collaborate more successfully, and demonstrate greater resilience during challenges.
                            </p>
                        </div>
                    </div>
                </section>

                {/* --- NEW SECTION: PERSONAL RELATIONSHIPS --- */}
                <section className="bg-gradient-to-br from-white/60 to-pink-50/50 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-16 shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/50">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif text-slate-900">Emotional Intelligence in Personal Relationships</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 items-center">
                        {/* LEFT COLUMN */}
                        <div className="space-y-12">
                            <div className="text-center md:text-right">
                                <div className="inline-flex justify-center md:justify-end w-full mb-3 text-pink-600">
                                    <UserPlus size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Deeper Connection</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Understanding your own and others' emotional needs creates authentic bonds built on mutual respect and empathy.
                                </p>
                            </div>
                            <div className="text-center md:text-right">
                                <div className="inline-flex justify-center md:justify-end w-full mb-3 text-pink-600">
                                    <Heart size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Empathetic Presence</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Truly understanding others' perspectives creates space for genuine connection and mutual growth.
                                </p>
                            </div>
                        </div>

                        {/* CENTER IMAGE */}
                        <div className="relative aspect-square rounded-full border-[6px] border-white/50 shadow-2xl overflow-hidden hidden md:block">
                             <img 
                                src="https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2070&auto=format&fit=crop" 
                                alt="Friends connecting" 
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="space-y-12">
                             <div className="text-center md:text-left">
                                <div className="inline-flex justify-center md:justify-start w-full mb-3 text-pink-600">
                                    <MessageCircle size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Effective Communication</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Expressing feelings clearly while listening empathetically transforms how you share thoughts and resolve misunderstandings.
                                </p>
                            </div>
                            <div className="text-center md:text-left">
                                <div className="inline-flex justify-center md:justify-start w-full mb-3 text-pink-600">
                                    <Compass size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Conflict Navigation</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Approaching disagreements with emotional awareness helps address the root causes rather than surface symptoms.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- NEW SECTION: TRAINING TECHNIQUES --- */}
                <section>
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif text-slate-900">Training and Improvement Techniques</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="bg-white/70 backdrop-blur-md rounded-[2rem] overflow-hidden shadow-sm border border-white/50 hover:shadow-lg transition-all">
                            <div className="h-48 overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2000&auto=format&fit=crop" alt="Meditation" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-8">
                                <h3 className="text-xl font-bold mb-3 text-slate-900">Mindfulness Practices</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Regular meditation and mindfulness exercises strengthen your ability to observe emotions without immediate reaction.
                                </p>
                            </div>
                        </div>

                         {/* Card 2 */}
                         <div className="bg-white/70 backdrop-blur-md rounded-[2rem] overflow-hidden shadow-sm border border-white/50 hover:shadow-lg transition-all">
                            <div className="h-48 overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop" alt="Coaching" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-8">
                                <h3 className="text-xl font-bold mb-3 text-slate-900">Professional Coaching</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Working with an EQ coach provides personalized strategies and feedback to address specific emotional intelligence challenges.
                                </p>
                            </div>
                        </div>

                         {/* Card 3 */}
                         <div className="bg-white/70 backdrop-blur-md rounded-[2rem] overflow-hidden shadow-sm border border-white/50 hover:shadow-lg transition-all">
                            <div className="h-48 overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop" alt="Analysis" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-8">
                                <h3 className="text-xl font-bold mb-3 text-slate-900">Assessment Tools</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Validated EQ assessments like the Emotional and Social Competency Inventory (ESCI) provide objective feedback.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- FOUNDER SECTION --- */}
                <section className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-16 shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/50 text-center relative">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500" />
                    
                    <div className="max-w-3xl mx-auto pt-8">
                        <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <Quote size={32} />
                        </div>
                        
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">Meet the Founder</h2>
                        
                        <p className="text-xl md:text-2xl text-slate-700 italic leading-relaxed mb-10 font-serif">
                            "I created this platform because I believe that <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-bold">Emotional Intelligence</span> is the missing link in modern education. It's not just about feeling better—it's about being better."
                        </p>

                        <div className="flex flex-col items-center justify-center gap-4">
                            <div className="p-1.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg">
                                <img 
                                    src="/images/homepage/mam.png" 
                                    alt="Founder" 
                                    className="w-20 h-20 rounded-full border-4 border-white object-cover"
                                />
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Pushpa Oraon</h3>
                                <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mt-1">ASSOCIATE PROFESSOR</p>
                                <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mt-1">SHRI MATA VAISHNO DEVI COLLEGE OF NURSING,KATRA, JAMMU</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FOOTER CTA */}
                <div className="text-center pb-8">
                    <h2 className="text-3xl font-bold mb-8 text-slate-900">Ready to start your journey?</h2>
                    <button 
                         onClick={() => navigate('/login')}
                         className="px-12 py-4 bg-slate-900 hover:bg-slate-800 text-white text-lg font-bold rounded-full transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                    >
                        Join the Community
                    </button>
                </div>

            </div>
        </div>
    );
}