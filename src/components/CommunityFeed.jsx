import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Heart, MessageCircle, Trash2, Send, User, Sparkles, 
  MoreHorizontal, TrendingUp, Clock, AlertCircle, CheckCircle2, X 
} from 'lucide-react';

// API Base URL
const API_BASE = 'http://localhost:3001/api';

// --- Components ---

// 1. Toast Notification Component
const Toast = ({ message, type, onClose }) => (
  <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-md animate-slide-up ${
    type === 'error' ? 'bg-red-50/90 border-red-200 text-red-700' : 'bg-emerald-50/90 border-emerald-200 text-emerald-700'
  }`}>
    {type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
    <span className="font-medium text-sm">{message}</span>
    <button onClick={onClose} className="p-1 hover:bg-black/5 rounded-full"><X size={14} /></button>
  </div>
);

// 2. Skeleton Loader Component
const FeedSkeleton = () => (
  <div className="space-y-6">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white/60 rounded-[2rem] p-6 border border-white/50 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-slate-200 rounded-full animate-pulse" />
          <div className="space-y-2">
            <div className="w-24 h-4 bg-slate-200 rounded animate-pulse" />
            <div className="w-16 h-3 bg-slate-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="space-y-2 mb-6">
          <div className="w-full h-4 bg-slate-200 rounded animate-pulse" />
          <div className="w-3/4 h-4 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="flex gap-4">
          <div className="w-16 h-8 bg-slate-200 rounded-lg animate-pulse" />
          <div className="w-16 h-8 bg-slate-200 rounded-lg animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

export function CommunityFeed() {
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState("");
    const [commentInputs, setCommentInputs] = useState({}); 
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null); // { message, type }
    const [filter, setFilter] = useState('latest'); // 'latest' | 'popular'

    // Safely get user
    const user = React.useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch (e) { return null; }
    }, []);
    
    const token = localStorage.getItem('token');

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${token}` }
    });

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await axios.get(`${API_BASE}/community/posts`, getAuthHeaders());
            setPosts(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            showToast('Failed to load posts.', 'error');
            setLoading(false);
        }
    };

    const handleCreatePost = async () => {
        if (!content.trim()) return;
        try {
            const res = await axios.post(`${API_BASE}/community/posts`, { content }, getAuthHeaders());
            setPosts([res.data, ...posts]); 
            setContent("");
            showToast("Post created successfully!");
        } catch (err) {
            showToast(err.response?.data?.message || "Failed to post", 'error');
        }
    };

    const handleUpvote = async (postId) => {
        if (!user) return showToast("Please login to vote", 'error');

        // Optimistic UI Update
        const updatedPosts = posts.map(post => {
            if (post._id === postId) {
                const hasUpvoted = post.upvotes.includes(user.id);
                return {
                    ...post,
                    upvotes: hasUpvoted
                        ? post.upvotes.filter(id => id !== user.id)
                        : [...post.upvotes, user.id]
                };
            }
            return post;
        });
        setPosts(updatedPosts);

        try {
            await axios.put(`${API_BASE}/community/posts/${postId}/upvote`, {}, getAuthHeaders());
        } catch (err) {
            showToast("Upvote failed", 'error');
            fetchPosts(); // Revert on error
        }
    };

    const handleComment = async (postId) => {
        const text = commentInputs[postId];
        if (!text?.trim()) return;

        try {
            const res = await axios.post(`${API_BASE}/community/posts/${postId}/comments`, { text }, getAuthHeaders());
            setPosts(posts.map(p => p._id === postId ? res.data : p));
            setCommentInputs({ ...commentInputs, [postId]: "" });
            showToast("Comment added!");
        } catch (err) {
            showToast("Failed to comment", 'error');
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            await axios.delete(`${API_BASE}/community/posts/${postId}`, getAuthHeaders());
            setPosts(posts.filter(p => p._id !== postId));
            showToast("Post deleted");
        } catch (err) {
            showToast("Error deleting post", 'error');
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        if (!window.confirm("Delete this comment?")) return;
        try {
            await axios.delete(`${API_BASE}/community/posts/${postId}/comments/${commentId}`, getAuthHeaders());
            setPosts(posts.map(p => {
                if (p._id === postId) {
                    return { ...p, comments: p.comments.filter(c => c._id !== commentId) };
                }
                return p;
            }));
            showToast("Comment deleted");
        } catch (err) {
            showToast("Error deleting comment", 'error');
        }
    };

    // Sorting Logic based on Filter
    const sortedPosts = [...posts].sort((a, b) => {
        if (filter === 'popular') {
            return (b.upvotes.length + b.comments.length) - (a.upvotes.length + a.comments.length);
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-indigo-100 text-slate-900 relative">
            
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[70rem] h-[70rem] bg-indigo-200/20 rounded-full blur-[100px] mix-blend-multiply animate-blob" />
                <div className="absolute top-[20%] right-[-10%] w-[60rem] h-[60rem] bg-purple-200/20 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-2000" />
                <div className="absolute bottom-[-20%] left-[20%] w-[60rem] h-[60rem] bg-pink-200/20 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-4000" />
            </div>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="max-w-2xl mx-auto px-4 py-12 relative z-10">
                
                {/* Header Section */}
                <div className="text-center mb-10 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-indigo-100 text-indigo-600 text-xs font-bold tracking-wide uppercase shadow-sm backdrop-blur-sm">
                        <Sparkles size={12} />
                        <span>Student Hub</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Community Feed</h1>
                    <p className="text-slate-500 text-lg">Share insights, ask questions, and connect with peers.</p>
                </div>

                {/* Create Post Widget */}
                <div className="bg-white rounded-[2rem] shadow-xl shadow-indigo-100/50 p-6 mb-10 ring-1 ring-slate-100 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-80" />
                    <div className="flex gap-5">
                        <div className="shrink-0 hidden sm:block">
                            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl rotate-3 flex items-center justify-center font-bold text-xl shadow-lg ring-4 ring-slate-50">
                                {user?.name?.[0]?.toUpperCase() || <User size={24} />}
                            </div>
                        </div>
                        <div className="flex-1">
                            <textarea
                                className="w-full bg-slate-50 border-0 rounded-xl p-4 text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all resize-none text-base"
                                placeholder="What's sparking your curiosity today?"
                                rows="3"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                            <div className="flex justify-between items-center mt-4">
                                <p className="text-xs text-slate-400 font-medium pl-1">Markdown supported</p>
                                <button 
                                    onClick={handleCreatePost}
                                    disabled={!content.trim()}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-slate-900/20 hover:shadow-xl active:scale-95"
                                >
                                    <span>Post</span>
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-4 mb-6 px-2">
                    <button 
                        onClick={() => setFilter('latest')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${filter === 'latest' ? 'bg-white text-indigo-600 shadow-md shadow-indigo-100 ring-1 ring-indigo-50' : 'text-slate-500 hover:bg-white/50'}`}
                    >
                        <Clock size={16} />
                        Latest
                    </button>
                    <button 
                        onClick={() => setFilter('popular')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${filter === 'popular' ? 'bg-white text-pink-600 shadow-md shadow-pink-100 ring-1 ring-pink-50' : 'text-slate-500 hover:bg-white/50'}`}
                    >
                        <TrendingUp size={16} />
                        Popular
                    </button>
                </div>

                {/* Feed Content */}
                {loading ? (
                    <FeedSkeleton />
                ) : sortedPosts.length === 0 ? (
                    <div className="text-center py-20 bg-white/50 rounded-[2rem] border border-dashed border-slate-300">
                        <div className="w-16 h-16 bg-indigo-50 text-indigo-300 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageCircle size={32} />
                        </div>
                        <h3 className="text-slate-900 font-bold text-lg">No posts yet</h3>
                        <p className="text-slate-500">Be the first to start the conversation!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {sortedPosts.map((post) => {
                            const isAuthor = user && post.author?._id === user.id;
                            const isAdmin = user && user.role === 'admin';
                            const hasUpvoted = user && post.upvotes.includes(user.id);

                            return (
                                <div key={post._id} className="bg-white/80 backdrop-blur-md rounded-[2rem] p-6 sm:p-8 shadow-sm border border-white hover:shadow-xl hover:shadow-indigo-900/5 transition-all duration-300 group">
                                    
                                    {/* Post Header */}
                                    <div className="flex items-start justify-between mb-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm">
                                                {post.author?.name?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">{post.author?.name || 'Unknown'}</h3>
                                                    {post.author?.role === 'admin' && (
                                                        <span className="bg-rose-100 text-rose-700 text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider">MOD</span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-500">
                                                    {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {(isAdmin || isAuthor) && (
                                            <div className="relative">
                                                <button onClick={() => handleDeletePost(post._id)} className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Post Body */}
                                    <p className="text-slate-700 text-[15px] sm:text-base leading-relaxed whitespace-pre-wrap mb-6">
                                        {post.content}
                                    </p>

                                    {/* Interaction Bar */}
                                    <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                                        <button 
                                            onClick={() => handleUpvote(post._id)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-semibold text-sm ${
                                                hasUpvoted 
                                                ? 'bg-rose-50 text-rose-600' 
                                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                            }`}
                                        >
                                            <Heart size={18} className={hasUpvoted ? "fill-rose-600" : ""} />
                                            <span>{post.upvotes.length}</span>
                                        </button>
                                        
                                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 text-slate-600 text-sm font-semibold">
                                            <MessageCircle size={18} />
                                            <span>{post.comments?.length || 0}</span>
                                        </div>
                                    </div>

                                    {/* Comments Section */}
                                    <div className="mt-6 bg-slate-50/50 rounded-2xl p-2 sm:p-4">
                                        {post.comments?.length > 0 && (
                                            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                                {post.comments.map(c => (
                                                    <div key={c._id} className="flex gap-3 text-sm group/comment">
                                                        <div className="w-7 h-7 bg-white text-slate-500 rounded-full flex items-center justify-center text-xs font-bold border border-slate-200 shrink-0">
                                                            {c.author?.name?.[0]?.toUpperCase() || 'U'}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="bg-white px-4 py-2.5 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 relative">
                                                                <div className="flex justify-between items-start">
                                                                    <span className="font-bold text-slate-900 text-xs block mb-1">{c.author?.name}</span>
                                                                    {(isAdmin || (user && c.author?._id === user.id)) && (
                                                                        <button 
                                                                            onClick={() => handleDeleteComment(post._id, c._id)}
                                                                            className="text-slate-300 hover:text-rose-500 opacity-0 group-hover/comment:opacity-100 transition-all"
                                                                        >
                                                                            <X size={12} />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                                <span className="text-slate-600">{c.text}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="relative flex items-center gap-2">
                                            <input 
                                                type="text"
                                                className="w-full pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder-slate-400"
                                                placeholder="Add a comment..."
                                                value={commentInputs[post._id] || ""}
                                                onChange={(e) => setCommentInputs({...commentInputs, [post._id]: e.target.value})}
                                                onKeyDown={(e) => e.key === 'Enter' && handleComment(post._id)}
                                            />
                                            <button 
                                                onClick={() => handleComment(post._id)}
                                                disabled={!commentInputs[post._id]?.trim()}
                                                className="absolute right-2 p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg transition-all disabled:opacity-0 disabled:pointer-events-none"
                                            >
                                                <Send size={16} />
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
