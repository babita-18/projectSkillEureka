import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loginType, setLoginType] = useState<'user' | 'creator' | null>(null);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = login(formData.username, formData.password);
    
    if (success) {
      navigate('/');
    } else {
      setError('Invalid username or password');
    }
  };

  const handleTypeSelect = (type: 'user' | 'creator') => {
    setLoginType(type);
  };

  // Initial selection screen
  if (!loginType) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-card">
          <h1 className="text-2xl font-bold text-center mb-8">Welcome to Skill Eureka</h1>
          
          <div className="space-y-4">
            <button
              onClick={() => handleTypeSelect('user')}
              className="w-full py-3 bg-[#B3E5FC] text-gray-800 rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              Login as User
            </button>
            
            <button
              onClick={() => handleTypeSelect('creator')}
              className="w-full py-3 bg-[#B3E5FC] text-gray-800 rounded-lg font-medium hover:bg-accent-dark transition-colors"
            >
              Login as Creator
            </button>
            
            <Link to="/" className="bg-gray-100  block  rounded-lg text-center py-2 text-gray-600 hover:bg-[#E1F5FE] ">
              Skip to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Login form for selected type
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-card">
        <h1 className="text-2xl font-bold text-center mb-2">
          {loginType === 'user' ? 'User Login' : 'Creator Login'}
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Sign in to continue to Skill Eureka
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-error-light text-error-dark rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleFormChange}
              className="input"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleFormChange}
              className="input"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-2 bg-primary-DEFAULT text-gray-800 rounded-md font-medium hover:bg-primary-dark transition-colors"
          >
            Log In
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-dark hover:underline">
              Sign up
            </Link>
          </p>
          
          {loginType === 'creator' && (
            <p className="mt-2 text-gray-600">
              Want to become a creator?{' '}
              <Link to="/become-creator" className="text-primary-dark hover:underline">
                Apply here
              </Link>
            </p>
          )}
          
          <button
            onClick={() => setLoginType(null)}
            className="mt-4 text-gray-600 hover:text-gray-900"
          >
            Back to login options
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;