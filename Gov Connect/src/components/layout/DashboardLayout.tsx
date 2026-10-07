import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, Bell, Bookmark, User, LogOut, Settings } from 'lucide-react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import FloatingAssistantModal from '@/components/common/FloatingAssistantModal';
import ROUTES from '@/constants/routes';
import { cn } from '@/utils/cn';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const location = useLocation();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const getPageTitle = () => {
    const p = location.pathname;
    if (p.includes('jobs')) return 'Jobs & Recruitment';
    if (p.includes('documents')) return 'Document Vault';
    if (p.includes('grievances')) return 'Grievances';
    if (p.includes('assistant') || p.includes('ask-sarkar')) return 'Ask Sarkar';
    if (p.includes('notifications')) return 'Notifications';
    if (p.includes('profile')) return 'Profile';
    if (p.includes('saved')) return 'Saved Items';
    if (p.includes('settings')) return 'Settings';
    if (p.includes('schemes')) return 'Schemes';
    return 'Overview';
  };

  const initials = (name?: string) => (name ? name.slice(0, 2).toUpperCase() : 'CS');

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans">

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div className={cn(
        'md:hidden fixed inset-y-0 left-0 w-56 bg-[var(--color-surface)] z-50 flex flex-col border-r border-[var(--color-border)] transform transition-transform duration-200',
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <Link to={ROUTES.SCHEMES} className="font-serif text-lg font-semibold text-[var(--color-text)]">
            GovConnect
          </Link>
          <button onClick={() => setMobileSidebarOpen(false)} className="p-1 text-[var(--color-muted)] cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 flex-1 overflow-y-auto space-y-0.5 text-sm">
          {[
            ['Schemes', ROUTES.SCHEMES],
            ['Jobs', ROUTES.JOBS],
            ['Documents', ROUTES.DOCUMENTS],
            ['Grievances', ROUTES.GRIEVANCES],
            ['Ask Sarkar', ROUTES.ASSISTANT],
            ['Profile', ROUTES.PROFILE],
            ['Settings', ROUTES.SETTINGS],
          ].map(([label, href]) => (
            <Link
              key={label}
              to={href}
              onClick={() => setMobileSidebarOpen(false)}
              className="block py-2 px-3 rounded-sm text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-parch-100)] dark:hover:bg-[var(--color-ink-800)] transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="p-4 border-t border-[var(--color-border)]">
          <button onClick={logout} className="w-full text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] py-1.5 cursor-pointer text-left">
            Sign Out
          </button>
        </div>
      </div>

      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[var(--color-surface)]/95 backdrop-blur-sm border-b border-[var(--color-border)] h-12 md:ml-56 flex items-center justify-between px-4 sm:px-6">

        {/* Left: hamburger + page title */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-1 text-[var(--color-muted)] cursor-pointer"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="font-serif text-base font-semibold text-[var(--color-text)] tracking-tight">
            {getPageTitle()}
          </h1>
        </div>

        {/* Right: lang + bell + avatar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="text-[11px] text-[var(--color-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)] px-2 py-0.5 rounded-sm cursor-pointer transition-colors"
            title="Switch Language"
          >
            {language === 'hi' ? 'हिन्दी' : 'EN'}
          </button>

          <Link
            to={ROUTES.NOTIFICATIONS}
            className="relative p-1 text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-[var(--color-terra-600)]" />
          </Link>

          {/* Avatar + dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="h-7 w-7 rounded-full border border-[var(--color-border)] bg-[var(--color-parch-200)] dark:bg-[var(--color-ink-700)] text-[var(--color-text)] font-medium text-[10px] flex items-center justify-center cursor-pointer"
            >
              {initials(user?.name)}
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-48 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm shadow-[var(--shadow-modal)] py-1 text-xs z-50">
                <div className="px-3.5 py-2.5 border-b border-[var(--color-border)]">
                  <p className="font-medium text-[var(--color-text)] truncate">{user?.name || 'Citizen'}</p>
                  <p className="text-[10px] text-[var(--color-muted)] truncate">{user?.education} · {user?.state}</p>
                </div>
                {[
                  { icon: User, label: 'Profile', to: ROUTES.PROFILE },
                  { icon: Bookmark, label: 'Saved', to: ROUTES.SAVED || '/dashboard/saved' },
                  { icon: Settings, label: 'Settings', to: ROUTES.SETTINGS },
                ].map(({ icon: Icon, label, to }) => (
                  <Link
                    key={label}
                    to={to}
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-parch-100)] dark:hover:bg-[var(--color-ink-800)] transition-colors"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </Link>
                ))}
                <div className="border-t border-[var(--color-border)] mt-1" />
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-parch-100)] dark:hover:bg-[var(--color-ink-800)] transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="md:ml-56 pb-20 md:pb-8">
        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl">
          <Outlet />
        </div>
      </main>

      <MobileNav />
      <FloatingAssistantModal />
    </div>
  );
}
