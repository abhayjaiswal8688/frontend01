import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, X } from "react-feather";

function NavLink({ href, children }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(href)}
      className="relative text-[15px] font-medium text-slate-600 hover:text-purple-700 cursor-pointer group"
    >
      {children}
      <span className="absolute bottom-[-4px] left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
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
    return () =>
      window.removeEventListener("local-storage-changed", loadUser);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "auto";
  }, [isMobileOpen]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("local-storage-changed"));
    navigate("/");
  };

  const isAdmin = user?.role === "admin";

  return (
    <>
      {/* FIXED HEADER */}
      <div className="fixed top-0 left-0 w-full bg-pink-50 md:bg-transparent shadow-sm md:shadow-none z-[200]">
        <div className="hidden md:flex justify-end items-center space-x-8 p-4">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/CommunityFeed">Peer Support</NavLink>
          <NavLink href="/test">Take a Test</NavLink>
          <NavLink href="/resource">Resources</NavLink>
          {isAdmin && <NavLink href="/admin">Admin</NavLink>}
          {user ? (
            <button onClick={handleLogout} className="text-red-600 font-bold">
              Logout
            </button>
          ) : (
            <Link to="/login" className="bg-black text-white px-5 py-2 rounded-full">
              Login
            </Link>
          )}
        </div>

        <div className="md:hidden flex justify-end p-4">
          <button onClick={() => setIsMobileOpen(true)}>
            <Menu />
          </button>
        </div>
      </div>

      {/* SIDE DRAWER */}
      <div
        className={`fixed top-0 right-0 h-screen w-72 bg-white z-[300] shadow-xl transform transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between p-5 border-b">
          <span className="font-bold">Menu</span>
          <X onClick={() => setIsMobileOpen(false)} />
        </div>

        <div className="flex flex-col gap-6 p-6">
          <MobileNavLink href="/" close={() => setIsMobileOpen(false)}>Home</MobileNavLink>
          <MobileNavLink href="/CommunityFeed" close={() => setIsMobileOpen(false)}>Peer Support</MobileNavLink>
          <MobileNavLink href="/test" close={() => setIsMobileOpen(false)}>Test</MobileNavLink>
          <MobileNavLink href="/resource" close={() => setIsMobileOpen(false)}>Resources</MobileNavLink>
        </div>
      </div>

      {/* OVERLAY */}
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
        close();
      }}
      className="text-lg text-slate-700 font-medium"
    >
      {children}
    </div>
  );
}
