import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    profilePic: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // In a real app, we would send this to an API
    try {
      signup({
        name: formData.name,
        username: formData.username,
        profilePic: formData.profilePic,
        bio: formData.bio
      });
      
      navigate('/');
    } catch (error) {
      setError('An error occurred during signup');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-8">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-card">
        <h1 className="text-2xl font-bold text-center mb-2">Create an Account</h1>
        <p className="text-center text-gray-600 mb-6">
          Join Skill Eureka to access free educational content
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-error-light text-error-dark rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              className="input"
              required
            />
          </div>
          
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
          
          <div className="mb-4">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleFormChange}
              className="input min-h-[80px]"
              rows={3}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="profilePic" className="block text-sm font-medium text-gray-700 mb-1">
              Profile Picture URL
            </label>
            <input
              type="text"
              id="profilePic"
              name="profilePic"
              value={formData.profilePic}
              onChange={handleFormChange}
              className="input"
              placeholder="https://example.com/profile.jpg"
            />
          </div>
          
          <div className="mb-4">
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
          
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleFormChange}
              className="input"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-2 bg-primary-DEFAULT text-gray-800 rounded-md font-medium hover:bg-primary-dark transition-colors"
          >
            Sign Up
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-dark hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;