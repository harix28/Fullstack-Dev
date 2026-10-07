import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Briefcase, FolderOpen, MoreHorizontal, X, MessageSquare, Bot, Bell, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ROUTES from '@/constants/routes';
import { cn } from '@/utils/cn';
export default function MobileNav() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const mainItems = [
        { label: 'Overview', icon: LayoutDashboard, href: ROUTES.DASHBOARD || '/dashboard' },
        { label: 'Schemes', icon: FileText, href: ROUTES.SCHEMES || '/dashboard/schemes' },
        { label: 'Jobs', icon: Briefcase, href: ROUTES.JOBS || '/dashboard/jobs' },
        { label: 'Vault', icon: FolderOpen, href: ROUTES.DOCUMENTS || '/dashboard/documents' },
        { label: 'Grievance', icon: MessageSquare, href: ROUTES.GRIEVANCES || '/dashboard/grievances' },
    ];
    const moreItems = [
        { label: 'Ask Sarkar AI', icon: Bot, href: ROUTES.ASSISTANT || '/dashboard/assistant', badge: 'Coming Soon' },
        { label: 'My Profile', icon: User, href: ROUTES.PROFILE || '/dashboard/profile' },
        { label: 'Saved Items', icon: Bell, href: ROUTES.SAVED || '/dashboard/saved' },
        { label: 'Notifications', icon: Bell, href: ROUTES.NOTIFICATIONS || '/dashboard/notifications' },
        { label: 'Settings', icon: Settings, href: ROUTES.SETTINGS || '/dashboard/settings' },
    ];
    const handleNavigation = (href) => {
        navigate(href);
        setDrawerOpen(false);
    };
    const handleLogout = () => {
        logout();
        setDrawerOpen(false);
        navigate(ROUTES.HOME || '/');
    };
    return (<>
      {/* Drawer Overlay */}
      {drawerOpen && (<div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setDrawerOpen(false)}/>)}

      {/* Drawer Sheet */}
      <div className={cn("md:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 transition-transform duration-300 ease-in-out pb-20 border-t border-[#D6CCC2]", drawerOpen ? "translate-y-0" : "translate-y-full")}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#E3D5CA]/50">
            <h3 className="font-semibold text-[#2D231E]">More Options</h3>
            <button onClick={() => setDrawerOpen(false)} className="p-1 text-[#7D6E63] hover:text-[#43342B]">
              <X className="h-5 w-5"/>
            </button>
          </div>
          
          <div className="space-y-1">
            {moreItems.map((item) => {
            const Icon = item.icon;
            return (<button key={item.label} onClick={() => handleNavigation(item.href)} className="w-full flex items-center justify-between px-3 py-3 text-sm font-medium text-[#7D6E63] hover:bg-[#FAF7F2] hover:text-[#2D231E] rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5"/>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>);
        })}
            
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-3 mt-4 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg border border-red-100">
              <LogOut className="h-5 w-5"/>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#D6CCC2] safe-bottom h-16 flex items-center justify-around px-2">
        {mainItems.map((item) => {
            const Icon = item.icon;
            return (<NavLink key={item.label} to={item.href} className={({ isActive }) => cn('flex flex-col items-center gap-0.5 flex-1 p-1', isActive ? 'text-[#59463B]' : 'text-[#A89B91]')}>
              <Icon className="h-6 w-6"/>
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>);
        })}
        
        <button onClick={() => setDrawerOpen(!drawerOpen)} className={cn('flex flex-col items-center gap-0.5 flex-1 p-1', drawerOpen ? 'text-[#59463B]' : 'text-[#A89B91]')}>
          <MoreHorizontal className="h-6 w-6"/>
          <span className="text-[10px] font-medium">More</span>
        </button>
      </nav>
    </>);
}
