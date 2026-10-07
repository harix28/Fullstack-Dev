import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, FileText, Briefcase, FolderOpen, MessageSquare, Bot, Bell, Settings, Shield, Bookmark, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSaved } from '@/context/SavedContext';
import ROUTES from '@/constants/routes';
import { cn } from '@/utils/cn';
export default function Sidebar() {
    const { user } = useAuth();
    const { savedSchemeIds, savedJobIds } = useSaved();
    const totalSaved = savedSchemeIds.length + savedJobIds.length;
    const primaryNavItems = [
        { label: 'Overview', icon: LayoutDashboard, href: ROUTES.DASHBOARD },
        { label: 'Schemes Matching', icon: FileText, href: ROUTES.SCHEMES, badge: 'AI Match' },
        { label: 'Govt Jobs Tracker', icon: Briefcase, href: ROUTES.JOBS },
        { label: 'Document Vault', icon: FolderOpen, href: ROUTES.DOCUMENTS },
        { label: 'Grievance Redress', icon: MessageSquare, href: ROUTES.GRIEVANCES },
        { label: 'Ask Sarkar AI', icon: Bot, href: ROUTES.ASSISTANT, badge: 'Coming Soon', highlight: true },
    ];
    const secondaryNavItems = [
        { label: 'My Citizen Profile', icon: User, href: ROUTES.PROFILE },
        { label: 'Saved Items', icon: Bookmark, href: ROUTES.SAVED || '/dashboard/saved', count: totalSaved > 0 ? totalSaved : undefined },
        { label: 'Notifications', icon: Bell, href: ROUTES.NOTIFICATIONS, count: 3 },
        { label: 'Settings', icon: Settings, href: ROUTES.SETTINGS },
    ];
    return (<aside className="fixed w-64 left-0 top-0 h-full bg-white border-r border-[#D6CCC2] flex flex-col z-30 hidden md:flex transition-colors font-sans shadow-xs">
      
      {/* Top Brand */}
      <div className="px-5 py-4 border-b border-[#D6CCC2] flex items-center justify-between">
        <Link to={ROUTES.DASHBOARD} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-[#59463B] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <Shield className="h-4.5 w-4.5"/>
          </div>
          <span className="font-extrabold text-lg text-[#2D231E] tracking-tight">
            Gov<span className="text-[#A67C65]">Connect</span>
          </span>
        </Link>
        <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>
          Active
        </span>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-4 scrollbar-thin">
        
        {/* Core Citizen Services */}
        <div>
          <p className="px-2 pb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#8C7D73]">
            Citizen Services
          </p>
          <div className="space-y-1">
            {primaryNavItems.map((item) => {
            const Icon = item.icon;
            return (<NavLink key={item.label} to={item.href} className={({ isActive }) => cn('flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-xl transition-all duration-150', isActive
                    ? 'bg-[#59463B] text-white shadow-sm'
                    : 'text-[#6B5E55] hover:bg-[#EDEDE9] hover:text-[#2D231E]')}>
                  {({ isActive }) => (<>
                      <div className="flex items-center gap-2.5">
                        <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-white' : item.highlight ? 'text-purple-500' : 'text-[#8C7D73]')}/>
                        <span className={item.highlight && !isActive ? 'text-purple-600 font-bold' : ''}>
                          {item.label}
                        </span>
                      </div>
                      {item.badge && !isActive && (<span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded border', item.badge === 'Coming Soon'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-[#FAF7F2] text-[#59463B] border-[#D6CCC2]')}>
                          {item.badge}
                        </span>)}
                    </>)}
                </NavLink>);
        })}
          </div>
        </div>

        {/* Account & Records */}
        <div>
          <p className="px-2 pb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#8C7D73]">
            My Account
          </p>
          <div className="space-y-1">
            {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            return (<NavLink key={item.label} to={item.href} className={({ isActive }) => cn('flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-all duration-150', isActive
                    ? 'bg-[#59463B] text-white shadow-xs'
                    : 'text-[#6B5E55] hover:bg-[#EDEDE9] hover:text-[#2D231E]')}>
                  {({ isActive }) => (<>
                      <div className="flex items-center gap-2.5">
                        <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-white' : 'text-[#8C7D73]')}/>
                        <span>{item.label}</span>
                      </div>
                      {item.count ? (<span className={cn("flex items-center justify-center h-4.5 px-1.5 rounded-full text-[10px] font-bold", isActive ? "bg-white text-[#59463B]" : "bg-[#E3D5CA] text-[#59463B]")}>
                          {item.count}
                        </span>) : null}
                    </>)}
                </NavLink>);
        })}
          </div>
        </div>

      </nav>

      {/* Bottom User Actions */}
      <div className="p-3 border-t border-[#D6CCC2] space-y-1.5 bg-[#FAF7F2]/50">
        <Link to={ROUTES.PROFILE} className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#EDEDE9] transition-colors">
          <div className="w-8 h-8 rounded-full bg-[#59463B] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
            {user?.name?.slice(0, 2).toUpperCase() || 'CS'}
          </div>
          <div className="truncate text-xs">
            <p className="font-bold text-[#2D231E] truncate">{user?.name || 'Citizen'}</p>
            <p className="text-[10px] text-[#8C7D73] truncate">Manage Profile →</p>
          </div>
        </Link>
      </div>
    </aside>);
}
