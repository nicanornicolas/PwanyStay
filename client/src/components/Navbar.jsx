import React from 'react';
import { Link } from 'react-router-dom';
import { Palmtree, Menu } from 'lucide-react';
import { useUserAuth } from '../contexts/UserAuthContext';

export default function Navbar() {
  const { isAuthenticated, logout } = useUserAuth();

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-2">
        <Palmtree className="text-[#007EA7]" size={28} />
        <span className="text-xl font-black text-[#007EA7] tracking-tight">PwanyStay</span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-8 font-semibold text-slate-700 text-sm">
        <Link to="/" className="hover:text-[#007EA7] transition-colors">Browse Stays</Link>
        <Link to="/list-property" className="hover:text-[#007EA7] transition-colors">List Your Property</Link>
        <Link to="/how-it-works" className="hover:text-[#007EA7] transition-colors">How It Works</Link>
        <Link to="/pricing" className="hover:text-[#007EA7] transition-colors">Pricing</Link>
        <Link to="/contact" className="hover:text-[#007EA7] transition-colors">Contact</Link>

        {/* Auth Links */}
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="hover:text-[#007EA7] transition-colors">Dashboard</Link>
            <Link to="/profile" className="hover:text-[#007EA7] transition-colors">Profile</Link>
            <button
              onClick={logout}
              className="text-slate-700 hover:text-[#007EA7] transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-[#007EA7] transition-colors">Login</Link>
            <Link
              to="/register"
              className="bg-[#007EA7] text-white px-5 py-2 rounded-lg font-bold hover:bg-[#005f7d] transition-all text-sm"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu Icon */}
      <Menu className="lg:hidden text-slate-900" />
    </nav>
  );
}