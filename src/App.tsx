import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChatProvider } from './context/ChatContext';
import LandingPage from './pages/landingpage';

import Signup from './pages/Signup';
import Chat from './pages/Chat';
import ProfilePage from './pages/ProfilePage';
import { Toaster } from 'react-hot-toast';


const App: React.FC = () => {
  return (
    <>
    <Toaster position="top-right" />
    <Router>
      <ChatProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
  
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/chat"
            element={
           
                <Chat />
          
            }
          />
          <Route path="/profile" element={<ProfilePage />} />
          
        </Routes>
      </ChatProvider>
    </Router>
    </>
  );
};

export default App;