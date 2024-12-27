import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext';
import { init } from '@instantdb/react';
import { MessageCircle, ArrowLeft, Mail, Lock } from 'lucide-react';
import { login } from '../services/authService';

const db = init({ appId: import.meta.env.VITE_INSTANT_APP_ID });

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { isDarkMode } = useDarkMode();

  const handleEmailSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await db.auth.sendMagicCode({ email });
      await login(email);
      setStep('verify');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to send verification code');
      } else {
        setError('Failed to send verification code');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await db.auth.signInWithMagicCode({ email, code });
      setStep('success');
      setTimeout(() => {
        navigate('/chat');
      }, 2000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to verify code');
      } else {
        setError('Failed to verify code');
      }
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 
      ${isDarkMode ? 'bg-zinc-900' : 'bg-gray-50'}`}>
      <div className="absolute top-4 left-4">
        <button
          onClick={() => navigate('/')}
          className={`p-2 rounded-full ${
            isDarkMode 
              ? 'bg-zinc-800 hover:bg-zinc-700 text-gray-300' 
              : 'bg-white hover:bg-gray-100 text-gray-700'
          } transition-colors duration-200 shadow-lg`}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      <div className={`w-full max-w-md space-y-8 ${isDarkMode ? 'bg-zinc-800' : 'bg-white'} 
        p-8 rounded-2xl shadow-xl border ${isDarkMode ? 'border-zinc-700' : 'border-gray-100'}`}>
        
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className={`p-4 rounded-full ${isDarkMode ? 'bg-violet-900/30' : 'bg-violet-50'}`}>
              <MessageCircle className={`w-12 h-12 ${isDarkMode ? 'text-violet-400' : 'text-violet-600'}`} />
            </div>
          </div>
          <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {step === 'email' ? 'Get Started' : step === 'verify' ? 'Verify Email' : 'Welcome!'}
          </h2>
          <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {step === 'email' 
              ? 'Enter your email to create an account or sign in' 
              : step === 'verify' 
              ? 'We sent a verification code to your email' 
              : 'Redirecting you to chat...'}
          </p>
        </div>

        {error && (
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-red-900/50 text-red-200' : 'bg-red-50 text-red-700'}`}>
            {error}
          </div>
        )}

        {step === 'success' ? (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className={`rounded-full p-4 ${isDarkMode ? 'bg-violet-900/50' : 'bg-violet-50'}`}>
                <svg
                  className={`w-12 h-12 ${isDarkMode ? 'text-violet-400' : 'text-violet-600'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
              Successfully verified!
            </div>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
            </div>
          </div>
        ) : (
          <form onSubmit={step === 'email' ? handleEmailSubmit : handleVerifySubmit} className="mt-8 space-y-6">
            <div className="space-y-6">
              {step === 'email' ? (
                <div>
                  <label htmlFor="email" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email address
                  </label>
                  <div className="mt-1 relative">
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`pl-10 block w-full rounded-lg border ${
                        isDarkMode 
                          ? 'bg-zinc-700 border-zinc-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent`}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label htmlFor="code" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Verification Code
                  </label>
                  <div className="mt-1 relative">
                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <input
                      id="code"
                      name="code"
                      type="text"
                      required
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className={`pl-10 block w-full rounded-lg border ${
                        isDarkMode 
                          ? 'bg-zinc-700 border-zinc-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent`}
                      placeholder="Enter verification code"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 rounded-lg text-white ${
                  loading 
                    ? 'bg-violet-400 cursor-not-allowed' 
                    : 'bg-violet-600 hover:bg-violet-700'
                } transition-colors duration-200`}
              >
                {loading 
                  ? 'Loading...' 
                  : step === 'email' 
                  ? 'Continue with Email' 
                  : 'Verify Code'}
              </button>

              {step === 'verify' && (
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className={`w-full flex items-center justify-center py-3 px-4 rounded-lg ${
                    isDarkMode 
                      ? 'bg-zinc-700 text-gray-300 hover:bg-zinc-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors duration-200`}
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Email
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Signup;