import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, Briefcase, FolderOpen, 
  MoreHorizontal, X, MessageSquare, Bot, Bell, 
  User, Settings, LogOut 
} from 'lucide-react';
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
    { label: 'Ask Sarkar AI', icon: Bot, href: ROUTES.ASSISTANT || '/dashboard/assistant' },
    { label: 'My Profile', icon: User, href: ROUTES.PROFILE || '/dashboard/profile' },
    { label: 'Saved Items', icon: Bell, href: ROUTES.SAVED || '/dashboard/saved' },
    { label: 'Notifications', icon: Bell, href: ROUTES.NOTIFICATIONS || '/dashboard/notifications' },
    { label: 'Settings', icon: Settings, href: ROUTES.SETTINGS || '/dashboard/settings' },
  ];

  const handleNavigation = (href: string) => {
    navigate(href);
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    logout();
    setDrawerOpen(false);
    navigate(ROUTES.HOME || '/');
  };

  return (
    <>
      {/* Drawer Overlay */}
      {drawerOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Drawer Sheet */}
      <div className={cn(
        "md:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 transition-transform duration-300 ease-in-out pb-20 border-t border-[#e2e8f0]",
        drawerOpen ? "translate-y-0" : "translate-y-full"
      )}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
            <h3 className="font-semibold text-[#0f1740]">More Options</h3>
            <button onClick={() => setDrawerOpen(false)} className="p-1 text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-1">
            {moreItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item.href)}
                  className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-[#64748b] hover:bg-gray-50 hover:text-[#1e293b] rounded-lg"
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </button>
              );
            })}
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-3 mt-4 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg border border-red-100"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#e2e8f0] safe-bottom h-16 flex items-center justify-around px-2">
        {mainItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-0.5 flex-1 p-1',
                  isActive ? 'text-[#1a2f8a]' : 'text-[#94a3b8]'
                )
              }
            >
              <Icon className="h-6 w-6" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          );
        })}
        
        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          className={cn(
            'flex flex-col items-center gap-0.5 flex-1 p-1',
            drawerOpen ? 'text-[#1a2f8a]' : 'text-[#94a3b8]'
          )}
        >
          <MoreHorizontal className="h-6 w-6" />
          <span className="text-[10px] font-medium">More</span>
        </button>
      </nav>
    </>
  );
}
