import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, Bell, Shield, Bookmark, User, LogOut, Settings } from 'lucide-react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import { useAuth } from '@/context/AuthContext';
import FloatingAssistantModal from '@/components/common/FloatingAssistantModal';
import ROUTES from '@/constants/routes';
import { cn } from '@/utils/cn';
export default function DashboardLayout() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('jobs'))
            return 'Jobs & Recruitment Tracker';
        if (path.includes('documents'))
            return 'Digital Document Vault';
        if (path.includes('grievances'))
            return 'Grievance Redressal Assistant';
        if (path.includes('assistant') || path.includes('ask-sarkar'))
            return 'Ask Sarkar AI Assistant';
        if (path.includes('notifications'))
            return 'Citizen Notifications';
        if (path.includes('profile'))
            return 'My Citizen Profile';
        if (path.includes('saved'))
            return 'Saved Items & Bookmarks';
        if (path.includes('settings'))
            return 'Settings & Security';
        return 'Government Schemes Matching';
    };
    const getInitials = (name) => {
        if (!name)
            return 'CS';
        return name.substring(0, 2).toUpperCase();
    };
    return (<div className="min-h-screen bg-[#F5EBE0] text-[#2D231E] font-sans transition-colors">
      
      {/* Desktop Persistent Sidebar */}
      <Sidebar />

      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (<div className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-40" onClick={() => setMobileSidebarOpen(false)}/>)}

      {/* Mobile Sidebar Drawer (No Overview, No Local Services) */}
      <div className={cn("md:hidden fixed inset-y-0 left-0 w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out border-r border-[#D6CCC2] shadow-2xl flex flex-col", mobileSidebarOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#D6CCC2]">
          <Link to={ROUTES.SCHEMES} className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-[#59463B]"/>
            <span className="font-bold text-lg text-[#2D231E]">GovConnect</span>
          </Link>
          <button onClick={() => setMobileSidebarOpen(false)} className="p-1 text-[#8C7D73] cursor-pointer">
            <X className="h-6 w-6"/>
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-1 text-sm font-semibold">
          <Link to={ROUTES.SCHEMES} onClick={() => setMobileSidebarOpen(false)} className="block py-2.5 px-3 rounded-lg text-[#43342B] hover:bg-[#EDEDE9]">
            🎯 Schemes Matching
          </Link>
          <Link to={ROUTES.JOBS} onClick={() => setMobileSidebarOpen(false)} className="block py-2.5 px-3 rounded-lg text-[#43342B] hover:bg-[#EDEDE9]">
            💼 Govt Jobs Tracker
          </Link>
          <Link to={ROUTES.DOCUMENTS} onClick={() => setMobileSidebarOpen(false)} className="block py-2.5 px-3 rounded-lg text-[#43342B] hover:bg-[#EDEDE9]">
            📁 Document Vault
          </Link>
          <Link to={ROUTES.GRIEVANCES} onClick={() => setMobileSidebarOpen(false)} className="block py-2.5 px-3 rounded-lg text-[#43342B] hover:bg-[#EDEDE9]">
            📝 Grievance Redress
          </Link>
          <Link to={ROUTES.ASSISTANT} onClick={() => setMobileSidebarOpen(false)} className="flex items-center justify-between py-2.5 px-3 rounded-lg text-[#43342B] hover:bg-[#EDEDE9]">
            <span>🤖 Ask Sarkar AI</span>
            <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
              Coming Soon
            </span>
          </Link>

          <div className="border-t border-[#E3D5CA]/50 my-2"/>

          <Link to={ROUTES.PROFILE} onClick={() => setMobileSidebarOpen(false)} className="block py-2 px-3 text-xs text-[#6B5E55] hover:bg-[#EDEDE9] rounded">
            My Profile
          </Link>
          <Link to={ROUTES.SAVED || '/dashboard/saved'} onClick={() => setMobileSidebarOpen(false)} className="block py-2 px-3 text-xs text-[#6B5E55] hover:bg-[#EDEDE9] rounded">
            Saved Items
          </Link>
          <Link to={ROUTES.SETTINGS} onClick={() => setMobileSidebarOpen(false)} className="block py-2 px-3 text-xs text-[#6B5E55] hover:bg-[#EDEDE9] rounded">
            Settings
          </Link>
        </div>

        <div className="p-4 border-t border-[#D6CCC2]">
          <button onClick={logout} className="w-full py-2 text-center text-xs font-bold text-red-600 bg-red-50 rounded-lg cursor-pointer">
            Sign Out
          </button>
        </div>
      </div>

      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#D6CCC2]/80 h-16 md:ml-64 flex items-center justify-between px-4 sm:px-6 transition-colors shadow-xs">
        
        {/* Left: Mobile Hamburger + Current Title */}
        <div className="flex items-center gap-3">
          <button className="md:hidden p-1.5 text-[#6B5E55] hover:text-[#59463B] cursor-pointer" onClick={() => setMobileSidebarOpen(true)}>
            <Menu className="h-6 w-6"/>
          </button>
          
          <h1 className="text-base sm:text-lg font-extrabold text-[#2D231E] truncate tracking-tight">
            {getPageTitle()}
          </h1>
        </div>

        {/* Right: Controls & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Notifications Icon */}
          <Link to={ROUTES.NOTIFICATIONS} className="relative p-2 text-[#7D6E63] hover:text-[#59463B] rounded-lg hover:bg-[#EDEDE9] transition-colors" title="Notifications">
            <Bell className="h-4.5 w-4.5"/>
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"/>
          </Link>

          {/* User Avatar & Dropdown */}
          <div className="relative">
            <button onClick={() => setUserDropdownOpen(!userDropdownOpen)} className="flex items-center justify-center h-8.5 w-8.5 rounded-full bg-[#59463B] text-white font-bold text-xs focus:outline-none ring-2 ring-[#E3D5CA] shadow-xs cursor-pointer">
              {getInitials(user?.name)}
            </button>

            {userDropdownOpen && (<div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl py-1.5 border border-[#D6CCC2] text-xs z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3.5 py-2 border-b border-[#E3D5CA]/50">
                  <p className="font-bold text-[#2D231E] truncate">{user?.name || 'Citizen'}</p>
                  <p className="text-[10px] text-[#8C7D73] truncate">{user?.education} • {user?.state}</p>
                </div>
                <Link to={ROUTES.PROFILE} onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2 px-3.5 py-2 hover:bg-[#FAF7F2] text-[#43342B]">
                  <User className="w-3.5 h-3.5"/> My Profile
                </Link>
                <Link to={ROUTES.SAVED || '/dashboard/saved'} onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2 px-3.5 py-2 hover:bg-[#FAF7F2] text-[#43342B]">
                  <Bookmark className="w-3.5 h-3.5 text-amber-500"/> Saved Items
                </Link>
                <Link to={ROUTES.SETTINGS} onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2 px-3.5 py-2 hover:bg-[#FAF7F2] text-[#43342B]">
                  <Settings className="w-3.5 h-3.5"/> Settings
                </Link>
                <div className="border-t border-[#E3D5CA]/50 my-1"/>
                <button onClick={logout} className="w-full flex items-center gap-2 px-3.5 py-2 text-red-600 hover:bg-red-50 text-left font-semibold cursor-pointer">
                  <LogOut className="w-3.5 h-3.5"/> Sign Out
                </button>
              </div>)}
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="md:ml-64 pb-20 md:pb-8">
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Persistent Floating Rounded Sarkar AI Assistant (Chat from anywhere) */}
      <FloatingAssistantModal />
    </div>);
}
