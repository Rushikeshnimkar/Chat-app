import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-whatsapp-teal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img 
                src="/whatsapp-logo.png" 
                alt="WhatsApp Clone" 
                className="h-8 w-auto"
              />
              <span className="ml-2 text-white text-xl font-semibold">
                WhatsApp Web Clone
              </span>
            </div>
            <div className="flex items-center space-x-4">
             
              <button
                onClick={() => navigate('/signup')}
                className="bg-white text-whatsapp-teal px-4 py-2 rounded-md hover:bg-gray-100"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:flex items-center justify-between">
          <div className="lg:w-1/2">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Connect with your friends and family securely
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Experience real-time messaging, voice calls, and video chats with end-to-end encryption.
            </p>
            <button
              onClick={() => navigate('/signup')}
              className="bg-whatsapp-teal text-white px-6 py-3 rounded-md text-lg hover:bg-whatsapp-dark transition-colors"
            >
              Get Started
            </button>
          </div>
          <div className="lg:w-1/2 mt-8 lg:mt-0">
            <img 
              src="/chat-illustration.png" 
              alt="Chat Illustration" 
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🔒"
              title="End-to-End Encryption"
              description="Your messages and calls are secured end-to-end"
            />
            <FeatureCard
              icon="💬"
              title="Real-time Chat"
              description="Instant messaging with real-time updates"
            />
            <FeatureCard
              icon="📱"
              title="Cross-Platform"
              description="Access your chats from any device"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-gray-400">
                A modern WhatsApp Web clone built with React and TypeScript.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  {/* Add social media icons here */}
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="p-6 bg-gray-50 rounded-lg text-center">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default LandingPage;