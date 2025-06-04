import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { VideoProvider } from './context/VideoContext';
import { NotificationProvider } from './context/NotificationContext';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import CreatorsPage from './pages/CreatorsPage';
import MyLibraryPage from './pages/MyLibraryPage';
import AboutPage from './pages/AboutPage';
import TeamPage from './pages/TeamPage';
import VideoPage from './pages/VideoPage';
import ProfilePage from './pages/ProfilePage';
import CreatorProfilePage from './pages/CreatorProfilePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CreatorApplicationPage from './pages/CreatorApplicationPage';
import CreatorConfirmationPage from './pages/CreatorConfirmationPage';
import UpdatesPage from './pages/UpdatesPage';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial data loading
  useEffect(() => {
    // In a real app, this would be fetching initial data
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-dark border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading Skill Eureka...</h2>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <VideoProvider>
        <NotificationProvider>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="creators" element={<CreatorsPage />} />
              <Route path="library" element={<MyLibraryPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="team" element={<TeamPage />} />
              <Route path="updates" element={<UpdatesPage />} />
              <Route path="video/:id" element={<VideoPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="creator/:id" element={<CreatorProfilePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
              <Route path="become-creator" element={<CreatorApplicationPage />} />
              <Route path="creator-confirmation" element={<CreatorConfirmationPage />} />
            </Route>
          </Routes>
        </NotificationProvider>
      </VideoProvider>
    </AuthProvider>
  );
}

export default App;