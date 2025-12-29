import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, X } from "react-feather";

function NavLink({ href, children }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(href)}
      className="text-[15px] font-medium text-slate-600 hover:text-purple-700 cursor-pointer"
    >
      {children}
    </div>
  );
}

export function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = () => {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    };
    loadUser();
    window.addEventListener("local-storage-changed", loadUser);
    // also listen to native storage for other tabs
    window.addEventListener("storage", loadUser);
    return () => {
      window.removeEventListener("local-storage-changed", loadUser);
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  // Lock background scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileOpen]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("local-storage-changed"));
    navigate("/");
  };

  return (
    <>
      {/* Fixed header */}
      <header className="fixed top-0 left-0 w-full bg-pink-50 md:bg-transparent shadow-sm md:shadow-none z-[200]">
        {/* Inner bar with explicit height so spacer can match it */}
        <div className="min-h-[72px] flex items-center justify-end px-4">
          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/CommunityFeed">Peer Support</NavLink>
            <NavLink href="/test">Take a Test</NavLink>
            <NavLink href="/resource">Resources</NavLink>
            {user ? (
              <>
                <NavLink href="/profile">Profile</NavLink>
                <button onClick={handleLogout} className="text-red-600 font-semibold">
                  Logout
                </button>
              </>
            ) : (
              <NavLink href="/login">
                <span className="bg-slate-900 text-white px-4 py-1 rounded-full text-sm">Login</span>
              </NavLink>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden ml-auto">
            <button
              aria-label="Open menu"
              onClick={() => setIsMobileOpen(true)}
              className="p-2 rounded-md text-slate-700 hover:bg-pink-100 transition-colors"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Spacer that prevents content (hero) from sitting under fixed header.
          If you already added padding/top in App layout, remove it. */}
      <div className="h-[72px] md:h-0" />

      {/* Side drawer */}
      <aside
        className={`fixed top-0 right-0 h-screen w-72 bg-white z-[300] shadow-xl transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isMobileOpen}
      >
        <div className="flex items-center justify-between p-5 border-b">
          <span className="font-bold text-slate-900">Menu</span>
          <button
            aria-label="Close menu"
            onClick={() => setIsMobileOpen(false)}
            className="p-1 rounded-full text-slate-600 hover:bg-pink-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-5 p-6">
          <MobileNavLink href="/" close={() => setIsMobileOpen(false)}>Home</MobileNavLink>
          <MobileNavLink href="/CommunityFeed" close={() => setIsMobileOpen(false)}>Peer Support</MobileNavLink>
          <MobileNavLink href="/test" close={() => setIsMobileOpen(false)}>Take a Test</MobileNavLink>
          <MobileNavLink href="/resource" close={() => setIsMobileOpen(false)}>Resources</MobileNavLink>

          <div className="border-t pt-4">
            {user ? (
              <>
                <MobileNavLink href="/profile" close={() => setIsMobileOpen(false)}>My Profile</MobileNavLink>
                <button
                  onClick={() => { handleLogout(); setIsMobileOpen(false); }}
                  className="mt-3 text-red-600 font-semibold"
                >
                  Logout
                </button>
              </>
            ) : (
              <MobileNavLink href="/login" close={() => setIsMobileOpen(false)}>Login</MobileNavLink>
            )}
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/30 z-[250]"
        />
      )}
    </>
  );
}

function MobileNavLink({ href, children, close }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        navigate(href);
        if (typeof close === "function") close();
      }}
      className="text-lg text-slate-700 font-medium cursor-pointer"
    >
      {children}
    </div>
  );
}
