import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Bell, Menu, X, LogOut, User, LayoutDashboard, Settings, Bookmark, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ROUTES from '@/constants/routes';
export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [grievanceText, setGrievanceText] = useState('');
    const dropdownRef = useRef(null);

    useEffect(() => {
        setMobileMenuOpen(false);
        setDropdownOpen(false);
    }, [location.pathname]);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        navigate(ROUTES.HOME);
    };
    const handleAnalyze = () => {
        console.log('Analyzing grievance:', grievanceText);
        // Placeholder: add analysis logic here (e.g., call AI service)
    };
    const getInitials = (name) => {
        if (!name)
            return 'CS';
        return name.substring(0, 2).toUpperCase();
    };
    return (<>
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#D6CCC2]/80 transition-colors shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.HOME} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-[#59463B] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
                <Shield className="h-5 w-5 text-white"/>
              </div>
              <span className="font-extrabold text-xl text-[#2D231E] tracking-tight">
                Gov<span className="text-[#A67C65]">Connect</span>
              </span>
            </Link>
          </div>

          {/* Right Action Controls: Sign In, Register / Dashboard */}
          <div className="flex items-center gap-2.5 sm:gap-3">

            {/* Authenticated Controls */}
            {isAuthenticated ? (<div className="flex items-center gap-2">
                <Link to={ROUTES.DASHBOARD} className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FAF7F2] text-[#59463B] font-bold text-xs hover:bg-[#E3D5CA] transition-all border border-[#D6CCC2] shadow-xs">
                  <LayoutDashboard className="w-4 h-4 text-[#59463B]"/>
                  <span>Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5 text-[#7A6051]"/>
                </Link>

                <Link to={ROUTES.SAVED || '/dashboard/saved'} className="p-2 text-[#7D6E63] hover:text-[#59463B] rounded-lg hover:bg-[#EDEDE9] transition-colors" title="Saved Items">
                  <Bookmark className="w-4 h-4"/>
                </Link>

                <Link to={ROUTES.NOTIFICATIONS} className="relative p-2 text-[#7D6E63] hover:text-[#59463B] rounded-lg hover:bg-[#EDEDE9] transition-colors" title="Notifications">
                  <Bell className="h-4 w-4"/>
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"/>
                </Link>
                
                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center justify-center h-8 w-8 rounded-full bg-[#59463B] text-white font-bold text-xs focus:outline-none ring-2 ring-[#E3D5CA] shadow cursor-pointer">
                    {getInitials(user?.name)}
                  </button>
                  
                  {dropdownOpen && (<div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 border border-[#D6CCC2] text-xs font-medium z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-[#E3D5CA]/50">
                        <p className="font-bold text-[#2D231E] truncate">{user?.name || 'Citizen'}</p>
                        <p className="text-[10px] text-[#8C7D73] truncate">{user?.email}</p>
                      </div>

                      <Link to={ROUTES.DASHBOARD} className="flex items-center gap-2.5 px-4 py-2.5 text-[#43342B] hover:bg-[#FAF7F2] font-semibold">
                        <LayoutDashboard className="h-4 w-4 text-[#59463B]"/> Citizen Dashboard
                      </Link>
                      <Link to={ROUTES.PROFILE} className="flex items-center gap-2.5 px-4 py-2 text-[#43342B] hover:bg-[#FAF7F2]">
                        <User className="h-4 w-4 text-[#7D6E63]"/> Profile
                      </Link>
                      <Link to={ROUTES.SAVED || '/dashboard/saved'} className="flex items-center gap-2.5 px-4 py-2 text-[#43342B] hover:bg-[#FAF7F2]">
                        <Bookmark className="h-4 w-4 text-amber-500"/> Saved Items
                      </Link>
                      <Link to={ROUTES.SETTINGS} className="flex items-center gap-2.5 px-4 py-2 text-[#43342B] hover:bg-[#FAF7F2]">
                        <Settings className="h-4 w-4 text-[#8C7D73]"/> Settings
                      </Link>

                      <div className="border-t border-[#E3D5CA]/50 my-1"/>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2 text-red-600 hover:bg-red-50 text-left font-semibold cursor-pointer">
                        <LogOut className="h-4 w-4"/> Sign Out
                      </button>
                    </div>)}
                </div>
              </div>) : (
        /* Clean Auth Action Buttons */
        <div className="flex items-center gap-2">
                <Link to={ROUTES.LOGIN} className="px-3.5 py-1.5 text-xs font-semibold text-[#59463B] border border-[#D6CCC2] hover:bg-[#EDEDE9] rounded-lg transition-colors">
                  Sign In
                </Link>
                <Link to={ROUTES.REGISTER} className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#59463B] rounded-lg hover:opacity-95 transition-opacity shadow-xs">
                  Register
                </Link>
              </div>)}

            {/* Mobile Menu Button for Authenticated Users */}
            {isAuthenticated && (<button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="sm:hidden p-2 text-[#6B5E55] hover:text-[#2D231E] rounded-lg hover:bg-[#EDEDE9]">
                {mobileMenuOpen ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
              </button>)}
          </div>
        </div>

        {/* Mobile Slideout for Logged In User */}
        {mobileMenuOpen && isAuthenticated && (<div className="sm:hidden bg-white border-t border-[#D6CCC2] px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-150">
            <Link to={ROUTES.DASHBOARD} className="block px-3 py-2.5 rounded-lg text-sm font-bold bg-[#FAF7F2] text-[#59463B]">
              Open Citizen Dashboard
            </Link>
            <Link to={ROUTES.PROFILE} className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#43342B] hover:bg-[#EDEDE9]">
              My Profile
            </Link>
            <Link to={ROUTES.SAVED || '/dashboard/saved'} className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#43342B] hover:bg-[#EDEDE9]">
              Saved Items
            </Link>
            <button onClick={handleLogout} className="w-full mt-2 py-2 text-center text-xs font-bold text-red-600 bg-red-50 rounded-lg">
              Sign Out
            </button>
          </div>)}
      </nav>
    </>);
}
