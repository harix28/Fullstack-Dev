import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, AlertCircle, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button, Badge } from '@/components/ui';
import ROUTES from '@/constants/routes';
export default function LoginPage() {
    const [identifier, setIdentifier] = useState('citizen@india.gov.in');
    const [password, setPassword] = useState('password123');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const autoLogin = async () => {
            setIsLoading(true);
            try {
                await login({ emailOrMobile: 'citizen@india.gov.in', password: 'password123' });
                navigate(ROUTES.DASHBOARD);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };
        autoLogin();
    }, [login, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!identifier.trim()) {
            setError('Please enter your registered email or mobile number.');
            return;
        }
        if (!password) {
            setError('Please enter your password.');
            return;
        }
        setIsLoading(true);
        try {
            await login({ emailOrMobile: identifier, password });
            navigate(ROUTES.DASHBOARD);
        }
        catch (err) {
            setError(err.message || 'Invalid credentials. Please try again.');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (<div className="min-h-screen flex bg-white font-sans">
      {/* Left Panel - Branding */}
      <div className="hidden md:flex md:w-1/2 bg-[#2D231E] text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="relative z-10">
          <Link to={ROUTES.HOME} className="flex items-center gap-2 mb-16">
            <Shield className="h-8 w-8 text-white"/>
            <span className="text-2xl font-bold tracking-tight text-white">
              Gov<span className="text-[#A67C65]">Connect</span>
            </span>
          </Link>
          
          <Badge className="bg-white/10 text-[#D5BDAF] border-white/20 mb-4 text-xs font-semibold">
            Unified Citizen Services Platform
          </Badge>

          <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
            Empowering Citizens.<br />Simplifying Access.
          </h1>
          <p className="text-lg text-[#E3D5CA] mb-10 max-w-md">
            Your unified portal for discovering schemes, tracking government jobs, managing official documents, and getting AI-assisted citizen support.
          </p>

          <div className="space-y-4">
            {[
            'Single citizen profile powers scheme & job matching',
            'Assisted grievance drafting with official routing',
            'Local service locator with proximity tracking',
            'Secure digital document vault with client-side privacy'
        ].map((feature, idx) => (<div key={idx} className="flex items-center gap-3">
                <CheckCircle2 className="text-[#A67C65] w-5 h-5 shrink-0"/>
                <span className="text-[#FAF7F2] text-sm">{feature}</span>
              </div>))}
          </div>
        </div>

        {/* Citizen Security & Privacy Notice */}
        <div className="relative z-10 mt-auto pt-8 border-t border-white/10">
          <p className="text-xs text-[#D6CCC2] mb-2 font-medium flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#D5BDAF]"/>
            Privacy & Trust:
          </p>
          <p className="text-xs text-[#D5BDAF]/80 leading-relaxed">
            GovConnect secures your citizen profile and documents. No sensitive biometric credentials are collected or shared with unverified parties.
          </p>
        </div>

        {/* Abstract Background Orbs */}
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#59463B] rounded-full blur-3xl opacity-50 pointer-events-none"/>
        <div className="absolute top-20 -left-20 w-64 h-64 bg-[#A67C65] rounded-full blur-3xl opacity-20 pointer-events-none"/>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-1/2 lg:px-20 xl:px-24 py-12 overflow-y-auto">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile Brand */}
          <div className="md:hidden flex items-center gap-2 mb-8">
            <Shield className="h-8 w-8 text-[#59463B]"/>
            <span className="text-2xl font-bold tracking-tight text-[#2D231E]">
              Gov<span className="text-[#A67C65]">Connect</span>
            </span>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-[#2D231E]">Sign In</h2>
            <p className="mt-2 text-sm text-[#6B5E55]">
              Enter your credentials to access citizen schemes, jobs, and grievance assistance.
            </p>
          </div>

          {error && (<div className="mt-6 bg-red-50 border-l-4 border-red-500 p-3 rounded-md flex gap-2 items-center text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500"/>
              <span>{error}</span>
            </div>)}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="identifier" className="block text-xs font-semibold text-[#43342B] mb-1">
                Mobile Number or Email Address
              </label>
              <input id="identifier" type="text" required value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="w-full px-3.5 py-2.5 border border-[#D6CCC2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#59463B]" placeholder="e.g. hari.sharma@example.com"/>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-[#43342B] mb-1">
                Password
              </label>
              <div className="relative">
                <input id="password" type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3.5 py-2.5 border border-[#D6CCC2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#59463B]" placeholder="••••••••"/>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7D73] hover:text-[#6B5E55]">
                  {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-[#6B5E55]">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="rounded text-[#59463B]"/>
                <span>Remember me</span>
              </label>

              <Link to={ROUTES.FORGOT_PASSWORD} className="font-medium text-[#59463B] hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full py-3 bg-[#2D231E] hover:bg-[#59463B] text-white font-semibold rounded-lg transition-colors text-sm shadow">
              {isLoading ? 'Signing In...' : 'Sign In to GovConnect'}
            </Button>
          </form>

          <div className="mt-8 text-center text-xs text-[#6B5E55]">
            Don't have an account?{' '}
            <Link to={ROUTES.REGISTER} className="font-bold text-[#A67C65] hover:underline inline-flex items-center">
              Register new profile <ArrowRight className="ml-1 w-3.5 h-3.5"/>
            </Link>
          </div>
        </div>
      </div>
    </div>);
}
