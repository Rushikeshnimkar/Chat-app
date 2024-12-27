import { useEffect, useState } from 'react';
import { checkAuth } from './services/authService';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/landingpage';
import Chat from './pages/Chat';
import Signup from './pages/Signup';
import Profile from './pages/ProfilePage';
import { DarkModeProvider } from './context/DarkModeContext';
import { init } from '@instantdb/react';

const db = init({ appId: import.meta.env.VITE_INSTANT_APP_ID });

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { user } = db.useAuth();

  useEffect(() => {
    const verifyAuth = async () => {
      const isAuth = await checkAuth();
      setIsAuthenticated(Boolean(user && isAuth));
    };

    verifyAuth();
  }, [user]);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <DarkModeProvider>
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={user ? <Navigate to="/chat" /> : <LandingPage />} 
          />
          <Route 
            path="/chat" 
            element={user ? <Chat /> : <Navigate to="/signup" />} 
          />
          <Route 
            path="/signup" 
            element={user ? <Navigate to="/chat" /> : <Signup />} 
          />
          <Route 
            path="/profile" 
            element={user ? <Profile /> : <Navigate to="/signup" />} 
          />
        </Routes>
      </Router>
    </DarkModeProvider>
  );
}

export default App;