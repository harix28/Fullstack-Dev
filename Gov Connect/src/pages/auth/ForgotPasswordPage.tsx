import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import ROUTES from '@/constants/routes';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to={ROUTES.HOME} className="inline-flex items-center gap-2 mb-6">
          <span className="text-3xl">🏛</span>
          <span className="text-2xl font-bold tracking-tight text-[#0f1740]">
            Gov<span className="text-[#0d9488]">Connect</span>
          </span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-4 shadow-xl shadow-gray-200/50 sm:rounded-xl sm:px-10 border border-[#e2e8f0]">
          {!isSubmitted ? (
            <>
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-[#0f1740]">Reset your password</h2>
                <p className="mt-2 text-sm text-gray-600">
                  Enter the email address associated with your account and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full px-3 py-3 border border-[#e2e8f0] rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#0d9488] focus:border-[#0d9488] sm:text-sm"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#0f1740] hover:bg-[#1a2f8a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0f1740] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#0f1740] mb-2">Check your email</h2>
              <p className="text-sm text-gray-600 mb-8">
                Password reset instructions sent to <span className="font-medium text-gray-900">{email}</span>.
              </p>
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <Link 
              to={ROUTES.LOGIN} 
              className="inline-flex items-center text-sm font-medium text-[#0d9488] hover:text-teal-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
