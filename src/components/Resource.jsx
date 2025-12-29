import React, { useEffect, useState } from 'react';
import { PlayCircle, BookOpen, Video, ExternalLink, Sparkles } from 'lucide-react';

export function Resource() {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3001/api/resources')
            .then(res => res.json())
            .then(data => {
                setResources(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    // Helper to get YouTube ID and Thumbnail
    const getThumbnail = (url) => {
        const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        const id = (match && match[2].length === 11) ? match[2] : null;
        return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : '/placeholder.png';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-100 p-8 py-12 relative overflow-hidden">
            {/* Aurora Background (Consistent with your Homepage) */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-300/30 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-300/30 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/50 text-purple-900 text-sm font-bold mb-4">
                        <Sparkles size={16} />
                        <span>Curated Learning</span>
                    </div>
                    <h1 className="text-5xl font-bold text-slate-900 mb-4 font-serif">Learning Resources</h1>
                    <p className="text-slate-600 max-w-2xl mx-auto">Enhance your Emotional Intelligence with these hand-picked videos and materials.</p>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-slate-500">Loading resources...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {resources.map((item) => (
                            <div key={item._id} className="group bg-white/70 backdrop-blur-xl rounded-[2rem] overflow-hidden border border-white/50 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2">
                                {/* Thumbnail Section */}
                                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="block overflow-hidden">
                                      <div className="relative h-52 overflow-hidden">
                                          <img 
                                              src={getThumbnail(item.url)} 
                                              alt={item.title} 
                                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                          />
                                          {/* Play Button Overlay */}
                                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                              <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center text-purple-600 shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                  <PlayCircle size={32} />
                                              </div>
                                          </div>
                                      </div>
                                  </a>

                                {/* Content Section */}
                                <div className="p-8">
                                    <span className="text-xs font-bold text-pink-500 uppercase tracking-widest mb-2 block">
                                        {item.category}
                                    </span>
                                    <h3 className="text-xl font-bold text-slate-900 mb-4 leading-tight">
                                        {item.title}
                                    </h3>
                                    <a 
                                        href={item.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-slate-900 font-bold hover:text-purple-600 transition-colors"
                                    >
                                        Watch Video <ExternalLink size={16} />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}