// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, X } from "react-feather";

// Custom Link Component
function NavLink({ href, children }) {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => navigate(href)}
      className="relative text-[15px] font-medium text-slate-600 hover:text-purple-700 cursor-pointer transition-colors duration-300 group"
    >
      {children}
      {/* Animated Underline */}
      <span className="absolute bottom-[-4px] left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></span>
    </div>
  );
}

export function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUserFromStorage = () => {
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          return null;
        }
      }
      return null;
    };

    setUser(getUserFromStorage());

    const handleStorageChange = () => {
      setUser(getUserFromStorage());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage-changed', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage-changed', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // Ensure token is also cleared
    setUser(null);
    window.dispatchEvent(new Event('local-storage-changed'));
    navigate('/');
  };

  const isAdmin = user && user.role === 'admin';

  return (
    // Changed: Removed bg-green-100 and shadow. Now it's transparent to fit inside Hero.
    <div className="w-full bg-transparent">
      
      {/* Desktop Navbar */}
      <div className="hidden md:flex justify-end items-center space-x-8">
        <NavLink href="/">Homepage</NavLink>
        <NavLink href="/CommunityFeed">Peer Support</NavLink>
        <NavLink href="/test">Take a Test</NavLink>

        {isAdmin && (
            <NavLink href="/admin">Admin Console</NavLink>
        )}

        <NavLink href="/resource">Resources</NavLink>
        
        <div className="flex items-center space-x-3 ml-4">
          {user ? (
            <>
              <Link to="/profile" className="px-4 py-2 text-sm font-semibold bg-white/50 border border-slate-200 text-slate-800 rounded-full shadow-sm hover:bg-white hover:text-purple-700 transition-all flex items-center gap-2">
                {isAdmin && <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Admin</span>}
                <span>Profile</span>
              </Link>
              <button onClick={handleLogout} className="px-4 py-2 text-sm font-semibold bg-red-50 text-red-600 border border-red-100 rounded-full hover:bg-red-600 hover:text-white transition-all shadow-sm">
                Log Out
              </button>
            </>
          ) : (
            <Link to="/login" className="px-6 py-2.5 text-sm font-bold bg-slate-900 text-white rounded-full shadow-lg hover:shadow-purple-500/20 hover:scale-105 transition-all">
              Log In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Button */}
      {/* Changed: Removed logo link, aligned button to right */}
      <div className="md:hidden flex justify-end items-center">
        <button 
          onClick={() => setIsMobileOpen(true)} 
          className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Side Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-72 bg-white/95 backdrop-blur-xl shadow-2xl z-[100] transform transition-transform duration-300 ease-in-out border-l border-white/20 ${
          isMobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
          <div className="text-lg font-bold text-slate-900">Menu</div>
          <button onClick={() => setIsMobileOpen(false)} className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex flex-col px-6 py-6 gap-6">
          <MobileNavLink href="/" closeMenu={() => setIsMobileOpen(false)}>Home</MobileNavLink>
          <MobileNavLink href="/CommunityFeed" closeMenu={() => setIsMobileOpen(false)}>Peer Support</MobileNavLink>
          <MobileNavLink href="/test" closeMenu={() => setIsMobileOpen(false)}>Take a Test</MobileNavLink>
          <MobileNavLink href="/resource" closeMenu={() => setIsMobileOpen(false)}>Resources</MobileNavLink>
          
          {isAdmin && (
             <div className="py-2 px-4 bg-purple-50 rounded-xl border border-purple-100">
                 <MobileNavLink href="/admin" closeMenu={() => setIsMobileOpen(false)}>
                    <span className="text-purple-700 font-bold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
                        Admin Console
                    </span>
                 </MobileNavLink>
             </div>
          )}
          
          <div className="h-px bg-slate-100 my-2" />

          {user ? (
            <div className="flex flex-col gap-4">
                <button 
                    onClick={() => { navigate('/profile'); setIsMobileOpen(false); }}
                    className="flex items-center gap-3 w-full p-3 rounded-xl bg-slate-50 text-slate-700 font-semibold hover:bg-slate-100 transition-colors"
                >
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">
                        {user.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    My Profile
                </button>
                <button 
                    onClick={() => { handleLogout(); setIsMobileOpen(false); }}
                    className="w-full py-3 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                >
                    Log Out
                </button>
            </div>
          ) : (
            <button 
                onClick={() => { navigate('/login'); setIsMobileOpen(false); }}
                className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:shadow-xl active:scale-95 transition-all"
            >
                Log In
            </button>
          )}
        </div>
      </div>
      
      {/* Overlay Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[90]"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </div>
  );
}

function MobileNavLink({ href, children, closeMenu }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        navigate(href);
        closeMenu();
      }}
      className="text-lg text-slate-600 hover:text-purple-700 cursor-pointer font-medium hover:pl-2 transition-all duration-200"
    >
      {children}
    </div>
  );
}