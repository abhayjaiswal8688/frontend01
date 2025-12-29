import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, MessageCircle, Trash2, Send, User, Sparkles } from 'lucide-react';

// API Base URL - Updated to use Vite Environment Variable
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export function CommunityFeed() {
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState("");
    const [commentInputs, setCommentInputs] = useState({}); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

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
            setError('Failed to load posts. Please log in again.');
            setLoading(false);
        }
    };

    const handleCreatePost = async () => {
        if (!content.trim()) return;
        try {
            const res = await axios.post(`${API_BASE}/community/posts`, { content }, getAuthHeaders());
            setPosts([res.data, ...posts]); 
            setContent("");
        } catch (err) {
            alert("Failed to post: " + (err.response?.data?.message || err.message));
        }
    };

    const handleUpvote = async (postId) => {
        if (!user) return alert("Please login to vote");

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
            console.error("Upvote failed", err);
            fetchPosts(); 
        }
    };

    const handleComment = async (postId) => {
        const text = commentInputs[postId];
        if (!text?.trim()) return;

        try {
            const res = await axios.post(`${API_BASE}/community/posts/${postId}/comments`, { text }, getAuthHeaders());
            setPosts(posts.map(p => p._id === postId ? res.data : p));
            setCommentInputs({ ...commentInputs, [postId]: "" });
        } catch (err) {
            alert("Failed to comment");
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm("Delete this post?")) return;
        try {
            await axios.delete(`${API_BASE}/community/posts/${postId}`, getAuthHeaders());
            setPosts(posts.filter(p => p._id !== postId));
        } catch (err) {
            alert("Unauthorized or Error deleting post");
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
        } catch (err) {
            alert("Error deleting comment");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
    );

    return (
        // CHANGED: Base Gradient Background
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 font-sans selection:bg-purple-200 relative overflow-hidden">
            
            {/* --- AURORA BACKGROUND (Fixed) --- */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-300/30 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-rose-300/30 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-2xl mx-auto relative z-10">
                
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/50 text-purple-700 text-sm font-bold mb-4 shadow-sm">
                        <Sparkles size={16} />
                        <span>Student Community</span>
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Community Feed</h1>
                    <p className="text-slate-600 font-medium">Connect, share, and grow together.</p>
                </div>

                {error && <div className="mb-6 text-red-600 bg-red-50/80 backdrop-blur-sm p-4 rounded-2xl border border-red-200 text-center">{error}</div>}

                {/* CREATE POST BOX (Glassmorphism) */}
                <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] shadow-lg border border-white/50 p-6 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
                    
                    <div className="flex gap-4">
                        <div className="shrink-0">
                            <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                                {user?.name?.[0]?.toUpperCase() || <User size={20} />}
                            </div>
                        </div>
                        <div className="flex-1">
                            <textarea
                                className="w-full p-4 bg-white/50 border border-white/60 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all outline-none resize-none placeholder-slate-400 text-slate-700"
                                placeholder={`What's on your mind, ${user?.name || 'student'}?`}
                                rows="3"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                            <div className="flex justify-end mt-3">
                                <button 
                                    onClick={handleCreatePost}
                                    disabled={!content.trim()}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg hover:shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
                                >
                                    <Send size={16} />
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* POSTS LIST */}
                <div className="space-y-6">
                    {posts.map((post) => {
                        const isAuthor = user && post.author?._id === user.id;
                        const isAdmin = user && user.role === 'admin';
                        const hasUpvoted = user && post.upvotes.includes(user.id);

                        return (
                            // Post Card (Glassmorphism)
                            <div key={post._id} className="bg-white/60 backdrop-blur-md rounded-[2rem] shadow-sm border border-white/50 p-6 hover:shadow-xl hover:shadow-purple-900/5 transition-all duration-300">
                                
                                {/* Post Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold border border-white shadow-sm">
                                            {post.author?.name?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-slate-900">{post.author?.name || 'Unknown'}</h3>
                                                {post.author?.role === 'admin' && (
                                                    <span className="bg-rose-100 text-rose-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-rose-200">ADMIN</span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500 font-medium">
                                                {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {(isAdmin || isAuthor) && (
                                        <button onClick={() => handleDeletePost(post._id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all">
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>

                                {/* Content */}
                                <p className="text-slate-700 mb-6 whitespace-pre-wrap leading-relaxed pl-1 text-[15px]">
                                    {post.content}
                                </p>

                                {/* Actions */}
                                <div className="flex items-center gap-6 pt-4 border-t border-slate-200/60 mb-4">
                                    <button 
                                        onClick={() => handleUpvote(post._id)}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                                            hasUpvoted 
                                            ? 'text-pink-600 bg-pink-50 font-semibold' 
                                            : 'text-slate-500 hover:bg-slate-100'
                                        }`}
                                    >
                                        <Heart size={20} fill={hasUpvoted ? "currentColor" : "none"} />
                                        <span>{post.upvotes.length}</span>
                                    </button>
                                    
                                    <div className="flex items-center gap-2 text-slate-500 px-3 py-1.5">
                                        <MessageCircle size={20} />
                                        <span>{post.comments?.length || 0}</span>
                                    </div>
                                </div>

                                {/* Comments Section */}
                                <div className="bg-white/40 rounded-2xl p-4 border border-white/40">
                                    {/* Comments List */}
                                    {post.comments?.length > 0 && (
                                        <div className="space-y-4 mb-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                            {post.comments.map(c => (
                                                <div key={c._id} className="flex justify-between items-start text-sm group">
                                                    <div className="flex gap-2.5">
                                                        <div className="w-6 h-6 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                                                            {c.author?.name?.[0]?.toUpperCase() || 'U'}
                                                        </div>
                                                        <div className="bg-white/70 px-3 py-2 rounded-2xl rounded-tl-none shadow-sm">
                                                            <span className="block font-bold text-slate-800 text-xs mb-0.5">{c.author?.name || 'User'}</span>
                                                            <span className="text-slate-600 leading-relaxed">{c.text}</span>
                                                        </div>
                                                    </div>
                                                    {(isAdmin || (user && c.author?._id === user.id)) && (
                                                        <button 
                                                            onClick={() => handleDeleteComment(post._id, c._id)}
                                                            className="text-slate-400 opacity-0 group-hover:opacity-100 hover:text-rose-500 transition-all p-1"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Comment Input */}
                                    <div className="relative">
                                        <input 
                                            type="text"
                                            className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all placeholder-slate-400"
                                            placeholder="Write a comment..."
                                            value={commentInputs[post._id] || ""}
                                            onChange={(e) => setCommentInputs({...commentInputs, [post._id]: e.target.value})}
                                            onKeyDown={(e) => e.key === 'Enter' && handleComment(post._id)}
                                        />
                                        <button 
                                            onClick={() => handleComment(post._id)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                            disabled={!commentInputs[post._id]?.trim()}
                                        >
                                            <Send size={16} />
                                        </button>
                                    </div>
                                </div>

                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
