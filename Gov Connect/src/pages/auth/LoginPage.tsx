import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ROUTES from '@/constants/routes';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!identifier.trim()) { setError('Please enter your email or mobile number.'); return; }
    if (!password) { setError('Please enter your password.'); return; }
    setIsLoading(true);
    try {
      await login({ emailOrMobile: identifier, password });
      navigate(ROUTES.DASHBOARD);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--color-bg)] font-sans">

      {/* Left — brand panel */}
      <div className="hidden md:flex md:w-2/5 flex-col justify-between p-14 border-r border-[var(--color-border)] bg-[var(--color-surface)]">
        <div>
          <Link to={ROUTES.HOME} className="font-serif text-2xl font-semibold text-[var(--color-text)]">
            GovConnect
          </Link>
          <p className="mt-1 text-xs text-[var(--color-muted)] tracking-widest uppercase">
            Citizen Services Platform
          </p>

          <div className="mt-16 space-y-5">
            <h2 className="font-serif text-3xl text-[var(--color-text)] leading-snug">
              One platform for<br />every citizen need.
            </h2>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed max-w-xs">
              Schemes, jobs, documents, and grievances — unified in a single, quiet, and private interface.
            </p>
          </div>

          <div className="mt-12 space-y-3">
            {[
              'Scheme & job matching from your profile',
              'Assisted grievance drafting',
              'Encrypted document vault',
              'Bilingual — English & Hindi',
            ].map((f) => (
              <p key={f} className="text-xs text-[var(--color-muted)] flex items-start gap-2">
                <span className="mt-0.5 w-1 h-1 rounded-full bg-[var(--color-olive-500)] shrink-0 inline-block" />
                {f}
              </p>
            ))}
          </div>
        </div>

        <p className="text-[10px] text-[var(--color-subtle)] leading-relaxed max-w-xs">
          No biometric data is collected. Your documents remain client-side and private.
        </p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-8">

          {/* Mobile brand */}
          <div className="md:hidden">
            <Link to={ROUTES.HOME} className="font-serif text-xl font-semibold text-[var(--color-text)]">
              GovConnect
            </Link>
          </div>

          <div>
            <h1 className="font-serif text-2xl text-[var(--color-text)]">Sign In</h1>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Access your citizen dashboard.
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2 text-xs text-[var(--color-terra-700)] border border-[var(--color-terra-100)] bg-[var(--color-terra-100)] rounded-sm px-3 py-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="identifier" className="block text-[11px] uppercase tracking-widest text-[var(--color-muted)] mb-1.5">
                Email or Mobile
              </label>
              <input
                id="identifier"
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-3 py-2.5 border border-[var(--color-border)] rounded-sm text-sm text-[var(--color-text)] bg-[var(--color-surface)] placeholder:text-[var(--color-subtle)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                placeholder="e.g. citizen@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[11px] uppercase tracking-widest text-[var(--color-muted)] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[var(--color-border)] rounded-sm text-sm text-[var(--color-text)] bg-[var(--color-surface)] placeholder:text-[var(--color-subtle)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-subtle)] hover:text-[var(--color-muted)] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link to={ROUTES.FORGOT_PASSWORD} className="text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 text-sm font-medium text-[var(--color-surface)] bg-[var(--color-ink-800)] hover:bg-[var(--color-ink-900)] dark:bg-[var(--color-parch-200)] dark:text-[var(--color-ink-900)] dark:hover:bg-[var(--color-parch-300)] rounded-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-xs text-center text-[var(--color-muted)]">
            No account?{' '}
            <Link to={ROUTES.REGISTER} className="text-[var(--color-text)] underline underline-offset-2">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
