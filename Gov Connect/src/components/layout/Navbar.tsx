import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User, LayoutDashboard, Settings, Bookmark, Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import ROUTES from '@/constants/routes';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMobileOpen(false); setDropdownOpen(false); }, [location.pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); setDropdownOpen(false); navigate(ROUTES.HOME); };
  const initials = (name?: string) => (name ? name.slice(0, 2).toUpperCase() : 'CS');

  return (
    <>
      <nav className="sticky top-0 z-40 bg-[var(--color-surface)]/95 backdrop-blur-sm border-b border-[var(--color-border)]">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 h-12 flex items-center justify-between">

          {/* Brand */}
          <Link
            to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.HOME}
            className="font-serif text-lg font-semibold text-[var(--color-text)] tracking-tight"
          >
            GovConnect
          </Link>

          {/* Right controls */}
          <div className="flex items-center gap-3">

            {/* Language */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="text-[11px] text-[var(--color-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)] px-2 py-0.5 rounded-sm cursor-pointer transition-colors"
            >
              {language === 'hi' ? 'हिन्दी' : 'EN'}
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to={ROUTES.NOTIFICATIONS}
                  className="relative p-1 text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-[var(--color-terra-600)]" />
                </Link>

                {/* Avatar + dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="h-7 w-7 rounded-full border border-[var(--color-border)] bg-[var(--color-parch-200)] dark:bg-[var(--color-ink-700)] text-[var(--color-text)] text-[10px] font-medium flex items-center justify-center cursor-pointer"
                  >
                    {initials(user?.name)}
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-1.5 w-44 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm shadow-[var(--shadow-modal)] py-1 text-xs z-50">
                      <div className="px-3.5 py-2 border-b border-[var(--color-border)]">
                        <p className="font-medium text-[var(--color-text)] truncate">{user?.name || 'Citizen'}</p>
                        <p className="text-[10px] text-[var(--color-muted)] truncate">{user?.email}</p>
                      </div>
                      {[
                        { icon: LayoutDashboard, label: 'Dashboard', to: ROUTES.DASHBOARD },
                        { icon: User,             label: 'Profile',   to: ROUTES.PROFILE },
                        { icon: Bookmark,         label: 'Saved',     to: ROUTES.SAVED || '/dashboard/saved' },
                        { icon: Settings,         label: 'Settings',  to: ROUTES.SETTINGS },
                      ].map(({ icon: Icon, label, to }) => (
                        <Link
                          key={label}
                          to={to}
                          className="flex items-center gap-2.5 px-3.5 py-2 text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-parch-100)] dark:hover:bg-[var(--color-ink-800)] transition-colors"
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {label}
                        </Link>
                      ))}
                      <div className="border-t border-[var(--color-border)] mt-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-parch-100)] dark:hover:bg-[var(--color-ink-800)] cursor-pointer transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile menu button */}
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="sm:hidden p-1 text-[var(--color-muted)] hover:text-[var(--color-text)] cursor-pointer"
                >
                  {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to={ROUTES.LOGIN}
                  className="text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="text-xs border border-[var(--color-border)] text-[var(--color-text)] px-3 py-1 rounded-sm hover:bg-[var(--color-parch-100)] dark:hover:bg-[var(--color-ink-800)] transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && isAuthenticated && (
          <div className="sm:hidden border-t border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 space-y-1">
            {[
              ['Dashboard', ROUTES.DASHBOARD],
              ['Profile',   ROUTES.PROFILE],
              ['Saved',     ROUTES.SAVED || '/dashboard/saved'],
            ].map(([label, href]) => (
              <Link
                key={label}
                to={href}
                className="block text-sm py-1.5 text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
              >
                {label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full text-sm text-left py-1.5 text-[var(--color-muted)] hover:text-[var(--color-text)] cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        )}
      </nav>
    </>
  );
}
