
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, MessageCircle, Shield, Zap, Globe } from 'lucide-react';
import { useDarkMode } from '../context/DarkModeContext';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-zinc-900' : 'bg-white'}`}>
      {/* Navigation */}
      <nav className={`fixed w-full z-10 ${isDarkMode ? 'bg-zinc-900/90 backdrop-blur-md' : 'bg-white/90 backdrop-blur-md'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <MessageCircle className={`w-8 h-8 ${isDarkMode ? 'text-violet-500' : 'text-violet-600'}`} />
              <span className={`ml-2 text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                Chat
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${isDarkMode ? 'bg-zinc-800 text-violet-400' : 'bg-violet-100 text-violet-600'}`}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => navigate('/signup')}
                className={`px-4 py-2 rounded-full ${
                  isDarkMode 
                    ? 'bg-violet-600 text-white hover:bg-violet-700' 
                    : 'bg-violet-600 text-white hover:bg-violet-700'
                } transition duration-300`}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
              Connect with the World
              <span className="text-violet-600">.</span>
            </h1>
            <p className={`text-xl mb-8 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Experience real-time conversations in a whole new way.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate('/signup')}
                className="px-8 py-3 bg-violet-600 text-white rounded-full hover:bg-violet-700 transition duration-300"
              >
                Start Chatting
              </button>
              <button
                onClick={() => navigate('/about')}
                className={`px-8 py-3 rounded-full ${
                  isDarkMode 
                    ? 'bg-zinc-800 text-white hover:bg-zinc-700' 
                    : 'bg-violet-100 text-violet-600 hover:bg-violet-200'
                } transition duration-300`}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className={`py-16 ${isDarkMode ? 'bg-zinc-800' : 'bg-violet-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="End-to-End Encryption"
              description="Your privacy is our top priority. All messages are fully encrypted."
              isDarkMode={isDarkMode}
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Lightning Fast"
              description="Experience instant message delivery with our optimized platform."
              isDarkMode={isDarkMode}
            />
            <FeatureCard
              icon={<Globe className="w-8 h-8" />}
              title="Available Everywhere"
              description="Access your conversations from any device, anywhere in the world."
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className={`py-16 ${isDarkMode ? 'bg-zinc-900' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <StatCard
              number="10M+"
              label="Active Users"
              isDarkMode={isDarkMode}
            />
            <StatCard
              number="99.9%"
              label="Uptime"
              isDarkMode={isDarkMode}
            />
            <StatCard
              number="150+"
              label="Countries"
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`py-8 ${isDarkMode ? 'bg-zinc-900 border-t border-zinc-800' : 'bg-white border-t border-zinc-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
              © 2024 Chat. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className={`text-sm ${isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}>
                Privacy Policy
              </a>
              <a href="#" className={`text-sm ${isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}>
                Terms of Service
              </a>
              <a href="#" className={`text-sm ${isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}>
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isDarkMode: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, isDarkMode }) => (
  <div className={`p-6 rounded-2xl ${
    isDarkMode 
      ? 'bg-zinc-800/50 hover:bg-zinc-800' 
      : 'bg-white hover:bg-violet-50'
  } transition duration-300`}>
    <div className={`${isDarkMode ? 'text-violet-400' : 'text-violet-600'} mb-4`}>
      {icon}
    </div>
    <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
      {title}
    </h3>
    <p className={`${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
      {description}
    </p>
  </div>
);

interface StatCardProps {
  number: string;
  label: string;
  isDarkMode: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ number, label, isDarkMode }) => (
  <div>
    <div className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
      {number}
    </div>
    <div className={`${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
      {label}
    </div>
  </div>
);

export default LandingPage;