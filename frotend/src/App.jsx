import { useState } from 'react';
import ChatInterface from './component/Chat';
import User from './component/User';
import LandingPage from './Home';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track login status
  const [showAuthPage, setShowAuthPage] = useState(false); // Track whether to show the auth page

  const handleLoginSuccess = () => {
    setIsAuthenticated(true); // Update state when login is successful
  };

  const handleStartValidating = () => {
    setShowAuthPage(true); // Show the signup/signin page
  };

  return (
    <>
      {!showAuthPage ? (
        // Show LandingPage if not showing the auth page
        <LandingPage onStartValidating={handleStartValidating} />
      ) : !isAuthenticated ? (
        // Show User component for login/register
        <User onLoginSuccess={handleLoginSuccess} />
      ) : (
        // Show ChatInterface if authenticated
        <ChatInterface />
      )}
    </>
  );
}

export default App;