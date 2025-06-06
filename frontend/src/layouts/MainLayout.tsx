import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, Search, Bell, User, X, Home, Users, Library, Info, Users2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

const MainLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, currentUser } = useAuth();
  const { unreadCount } = useNotifications();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location.pathname]);

  const showBackLink = location.pathname !== '/' && !location.pathname.includes('/login') && !location.pathname.includes('/signup');
  const showBackToCreators = location.pathname.includes('/creator/');

  return (
    <div className="flex flex-col min-h-screen  ">
      {/* Header */}
      <header 
        className={`sticky top-0 z-50  bg-gradient-to-b from-[#F5F5F5] to-[#B3E5FC] rounded-lg p-1 text-center transition-colors duration-300 ${
          isScrolled ? 'bg-white shadow-md' : 'bg-white'
        }`}
      >
        <div className="container mx-auto px-4 ">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="text-gray-700 focus:outline-none"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* Logo and Navigation */}
            <div className="flex items-center flex-1 justify-between md:justify-start">
              <Link to="/" className="flex items-center">
                <img src="/src/assets/logo2.png" alt="Skill Eureka" className="h-12 w-12 rounded-lg" />
                <span className="ml-2 text-lg font-semibold hidden md:block">Skill Eureka</span>
              </Link>

            
            </div> 

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="nav-link font-semibold">
                <Home className="h-5 w-5 " />
                <span>Home</span>
              </Link>
              <Link to="/creators" className="nav-link font-semibold">
                <Users className="h-5 w-5" />
                <span>Community</span>
              </Link>
              <Link to="/library" className="nav-link font-semibold">
                <Library className="h-5 w-5" />
                <span>My Library</span>
              </Link>
              <Link to="/about" className="nav-link font-semibold">
                <Info className="h-5 w-5" />
                <span>About</span>
              </Link>
              <Link to="/team" className="nav-link font-semibold">
                <Users2 className="h-5 w-5" />
                <span>Team</span>
              </Link>

              {/* Notifications */}
              <Link to="/updates" className="relative">
                <Bell className="h-6 w-6 text-gray-700 hover:text-blue-500 transition-colors" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-error-DEFAULT text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>

              {/* User Profile */}
              {isAuthenticated ? (
                <Link to="/profile">
                  <div className="h-8 w-8 rounded-full overflow-hidden">
                    <img 
                      src={currentUser?.profilePic || 'https://via.placeholder.com/40'} 
                      alt={currentUser?.name || 'User'} 
                      className="h-full w-full object-cover" 
                    />
                  </div>
                </Link>
              ) : (
                <Link to="/login" className="btn btn-primary">
                  Sign In
                </Link>
              )}
            </nav>

            {/* Mobile Right Icons */}
            <div className="flex md:hidden items-center space-x-4">
              <Link to="/updates" className="relative">
                <Bell className="h-6 w-6 text-gray-700" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-error-DEFAULT text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
              
              {isAuthenticated ? (
                <Link to="/profile">
                  <div className="h-8 w-8 rounded-full overflow-hidden">
                    <img 
                      src={currentUser?.profilePic || 'https://via.placeholder.com/40'} 
                      alt={currentUser?.name || 'User'} 
                      className="h-full w-full object-cover" 
                    />
                  </div>
                </Link>
              ) : (
                <Link to="/login">
                  <User className="h-6 w-6 text-gray-700" />
                </Link>
              )}
            </div>
          </div>

          {/* Back Navigation */}
          {showBackLink && (
            <div className="py-2 px-4">
              <Link 
                to={showBackToCreators ? "/creators" : "/"} 
                className="text-m font-semibold text-gray-600 hover:text-gray-900 flex items-center"
              >
                ←  {showBackToCreators ? "Creators" : "Home"}
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="bg-white h-full w-64 shadow-xl p-5 transform transition-transform duration-300 ease-in-out">
            <div className="flex justify-between items-center mb-6">
              <Link to="/" className="flex items-center">
                <img src="/src/assets/logo.svg" alt="Skill Eureka" className="h-8 w-8" />
                <span className="ml-2 text-lg font-semibold">Skill Eureka</span>
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-500 focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex flex-col space-y-4">
              <Link to="/" className="mobile-nav-link">
                <Home className="h-5 w-5" />
                <span>Home</span>
              </Link>
              <Link to="/creators" className="mobile-nav-link">
                <Users className="h-5 w-5" />
                <span>Creators</span>
              </Link>
              <Link to="/library" className="mobile-nav-link">
                <Library className="h-5 w-5" />
                <span>My Library</span>
              </Link>
              <Link to="/about" className="mobile-nav-link">
                <Info className="h-5 w-5" />
                <span>About</span>
              </Link>
              <Link to="/team" className="mobile-nav-link">
                <Users2 className="h-5 w-5" />
                <span>Team</span>
              </Link>
            </nav>

            <div className="absolute bottom-8 left-0 right-0 px-5">
              {!isAuthenticated && (
                <div className="flex flex-col space-y-2">
                  <Link to="/login\" className="btn btn-primary text-center">
                    Sign In
                  </Link>
                  <Link to="/signup" className="btn btn-secondary text-center">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className=" bg-gradient-to-l from-[#F5F5F5] to-[#B3E5FC] rounded-lg p-8 text-center shadow-card border-t border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link to="/" className="flex items-center justify-center md:justify-start">
                <img src="/src/assets/logo.svg" alt="Skill Eureka" className="h-8 w-8" />
                <span className="ml-2 text-lg font-semibold">Skill Eureka</span>
              </Link>
              <p className="text-sm text-gray-600 mt-1">Education for everyone, completely free</p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-end gap-6">
              <Link to="/about" className="text-gray-600 hover:text-primary-dark transition-colors">
                About
              </Link>
              <Link to="/team" className="text-gray-600 hover:text-primary-dark transition-colors">
                Team
              </Link>
              <Link to="/become-creator" className="text-gray-600 hover:text-primary-dark transition-colors">
                Become a Creator
              </Link>
              <a href="#" className="text-gray-600 hover:text-primary-dark transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-600 hover:text-primary-dark transition-colors">
                Terms of Service
              </a>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Skill Eureka. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;