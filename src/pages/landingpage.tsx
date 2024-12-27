import { useNavigate } from 'react-router-dom';
import { Moon, Sun, MessageCircle, Shield, Globe, Zap } from 'lucide-react';
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
                className={`p-2 rounded-xl ${isDarkMode ? 'bg-zinc-800 text-violet-400' : 'bg-violet-100 text-violet-600'}`}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-4 py-2 rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition duration-300"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
              Chat Across Languages
              <span className="text-violet-600">.</span>
            </h1>
            <p className={`text-xl mb-8 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'} max-w-2xl mx-auto`}>
              Break language barriers with real-time translation. Connect with anyone, anywhere, in your preferred language.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate('/signup')}
                className="px-8 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition duration-300"
              >
                Start Chatting
              </button>
              <button
                onClick={() => window.open("https://github.com/Rushikeshnimkar/Chat-app/blob/main/README.md", "_blank")}
                className={`px-8 py-3 rounded-xl ${
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
      <div className={`py-20 ${isDarkMode ? 'bg-zinc-800' : 'bg-violet-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
              Features that make communication seamless
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Globe className="w-8 h-8" />}
              title="Real-Time Translation"
              description="Chat in your language while others read in theirs. Supporting 10+ languages with instant translation."
              isDarkMode={isDarkMode}
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Secure Messaging"
              description="Your conversations are protected with end-to-end encryption, ensuring complete privacy."
              isDarkMode={isDarkMode}
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Instant Delivery"
              description="Experience seamless communication with instant message delivery and real-time updates."
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`py-12 ${isDarkMode ? 'bg-zinc-900 border-t border-zinc-800' : 'bg-white border-t border-zinc-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <MessageCircle className={`w-6 h-6 ${isDarkMode ? 'text-violet-500' : 'text-violet-600'}`} />
              <span className={`ml-2 text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                Chat
              </span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className={`text-sm ${isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}>
                Privacy
              </a>
              <a href="#" className={`text-sm ${isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}>
                Terms
              </a>
              <a href="#" className={`text-sm ${isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}>
                Contact
              </a>
            </div>
          </div>
          <div className={`mt-8 text-center text-sm ${isDarkMode ? 'text-zinc-500' : 'text-zinc-600'}`}>
            © {new Date().getFullYear()} Chat. All rights reserved.
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

export default LandingPage;