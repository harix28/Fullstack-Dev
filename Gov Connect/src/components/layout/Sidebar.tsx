import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Briefcase, FolderOpen, MessageSquare,
  Bot, Bell, Settings, LogOut, Bookmark, User,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSaved } from '@/context/SavedContext';
import ROUTES from '@/constants/routes';
import { cn } from '@/utils/cn';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { savedSchemeIds, savedJobIds } = useSaved();
  const totalSaved = savedSchemeIds.length + savedJobIds.length;

  const primaryNav = [
    { label: 'Overview',          icon: LayoutDashboard, href: ROUTES.DASHBOARD },
    { label: 'Schemes',           icon: FileText,         href: ROUTES.SCHEMES },
    { label: 'Jobs',              icon: Briefcase,        href: ROUTES.JOBS },
    { label: 'Documents',         icon: FolderOpen,       href: ROUTES.DOCUMENTS },
    { label: 'Grievances',        icon: MessageSquare,    href: ROUTES.GRIEVANCES },
    { label: 'Ask Sarkar',        icon: Bot,              href: ROUTES.ASSISTANT },
  ];

  const secondaryNav = [
    { label: 'Profile',           icon: User,     href: ROUTES.PROFILE },
    { label: 'Saved',             icon: Bookmark, href: ROUTES.SAVED || '/dashboard/saved', count: totalSaved > 0 ? totalSaved : undefined },
    { label: 'Notifications',     icon: Bell,     href: ROUTES.NOTIFICATIONS, count: 3 },
    { label: 'Settings',          icon: Settings, href: ROUTES.SETTINGS },
  ];

  const navClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center justify-between px-3 py-2 text-sm transition-colors duration-100 rounded-sm',
      isActive
        ? 'bg-[var(--color-border)] text-[var(--color-text)] font-medium'
        : 'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-parch-100)] dark:hover:bg-[var(--color-ink-800)]'
    );

  return (
    <aside className="fixed w-56 left-0 top-0 h-full hidden md:flex flex-col z-30 border-r border-[var(--color-border)] bg-[var(--color-surface)] dark:bg-[var(--color-surface)]">

      {/* Brand */}
      <div className="px-5 pt-6 pb-5 border-b border-[var(--color-border)]">
        <Link to={ROUTES.DASHBOARD} className="flex flex-col gap-0.5">
          <span className="font-serif text-xl font-semibold text-[var(--color-text)] tracking-tight leading-none">
            GovConnect
          </span>
          <span className="text-[10px] text-[var(--color-muted)] tracking-widest uppercase font-sans">
            Citizen Services
          </span>
        </Link>
      </div>

      {/* User pill */}
      <div className="px-4 pt-4 pb-2">
        <div className="border border-[var(--color-border)] rounded-sm px-3 py-2.5 text-xs">
          <p className="font-medium text-[var(--color-text)] truncate">{user?.name || 'Citizen'}</p>
          <p className="text-[var(--color-muted)] truncate mt-0.5">{user?.education} · {user?.state}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
        <div>
          <p className="px-3 pb-1.5 text-[9px] font-sans uppercase tracking-[0.12em] text-[var(--color-subtle)]">
            Services
          </p>
          <div className="space-y-0.5">
            {primaryNav.map(({ label, icon: Icon, href }) => (
              <NavLink key={label} to={href} className={navClass}>
                {({ isActive }) => (
                  <>
                    <span className="flex items-center gap-2.5">
                      <Icon className={cn('h-3.5 w-3.5 shrink-0', isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-subtle)]')} />
                      <span>{label}</span>
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        <div>
          <p className="px-3 pb-1.5 text-[9px] font-sans uppercase tracking-[0.12em] text-[var(--color-subtle)]">
            Account
          </p>
          <div className="space-y-0.5">
            {secondaryNav.map(({ label, icon: Icon, href, count }) => (
              <NavLink key={label} to={href} className={navClass}>
                {({ isActive }) => (
                  <>
                    <span className="flex items-center gap-2.5">
                      <Icon className={cn('h-3.5 w-3.5 shrink-0', isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-subtle)]')} />
                      <span>{label}</span>
                    </span>
                    {count ? (
                      <span className="text-[9px] font-medium border border-[var(--color-border)] px-1.5 py-0.5 rounded-sm text-[var(--color-muted)]">
                        {count}
                      </span>
                    ) : null}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-[var(--color-border)]">
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer rounded-sm hover:bg-[var(--color-parch-100)] dark:hover:bg-[var(--color-ink-800)]"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
