import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CreatorApplicationPage = () => {
  const navigate = useNavigate();
  const { applyAsCreator } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    youtubeChannel: '',
    reason: ''
  });
  const [error, setError] = useState('');
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      setError('Name and email are required');
      return;
    }
    
    try {
      const confirmationCode = applyAsCreator({
        name: formData.name,
        email: formData.email,
        youtubeChannel: formData.youtubeChannel
      });
      
      // Store data for confirmation page
      sessionStorage.setItem('pendingCreatorEmail', formData.email);
      sessionStorage.setItem('pendingCreatorName', formData.name);
      
      navigate('/creator-confirmation');
    } catch (error) {
      setError('An error occurred during application');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Why Join Section */}
        <div className="bg-white rounded-lg shadow-card p-8 mb-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            Why EdTech Creators Should Join Skill Eureka
          </h1>
          
          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-primary-DEFAULT flex items-center justify-center text-white font-bold flex-shrink-0 mt-1">✓</div>
              <p className="ml-3"><strong>Support a Mission-Driven Platform:</strong> Help make education truly free and accessible, especially for underserved communities.</p>
            </li>
            
            <li className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-primary-DEFAULT flex items-center justify-center text-white font-bold flex-shrink-0 mt-1">✓</div>
              <p className="ml-3"><strong>Reach a Dedicated Learner Base:</strong> Your content reaches learners who are focused and not distracted by ads or paywalls.</p>
            </li>
            
            <li className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-primary-DEFAULT flex items-center justify-center text-white font-bold flex-shrink-0 mt-1">✓</div>
              <p className="ml-3"><strong>Grow Your Personal Brand:</strong> Users can access your social media profiles directly from the platform—bringing you organic reach, more followers, and increased engagement across your channels.</p>
            </li>
            
            <li className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-primary-DEFAULT flex items-center justify-center text-white font-bold flex-shrink-0 mt-1">✓</div>
              <p className="ml-3"><strong>Get Long-Term Visibility:</strong> Content on Skill Eureka remains accessible without the pressure of algorithm trends or ad competition.</p>
            </li>
            
            <li className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-primary-DEFAULT flex items-center justify-center text-white font-bold flex-shrink-0 mt-1">✓</div>
              <p className="ml-3"><strong>Gain Credibility:</strong> Be part of a platform developed by IIT Guwahati and backed by Bright Eureka's educational vision.</p>
            </li>
            
            <li className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-primary-DEFAULT flex items-center justify-center text-white font-bold flex-shrink-0 mt-1">✓</div>
              <p className="ml-3"><strong>Leave a Legacy:</strong> Your knowledge contributes to a growing, permanent library that benefits learners for years to come.</p>
            </li>
            
            <li className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-primary-DEFAULT flex items-center justify-center text-white font-bold flex-shrink-0 mt-1">✓</div>
              <p className="ml-3"><strong>Join a Like-Minded Community:</strong> Connect with other educators who share a passion for making education equitable.</p>
            </li>
          </ul>
          
          <div className="text-center">
            <a href="#apply" className="bg-blue-300 text-gray-800 rounded-md font-medium hover:bg-blue-400 transition-colors inline-block px-8 py-3 text-lg">
              Become a Creator
            </a>
          </div>
        </div>
        
        {/* Application Form */}
        <div id="apply" className="bg-white rounded-lg shadow-card p-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            Creator Application Form
          </h2>
          
          {error && (
            <div className="mb-4 p-3 bg-error-light text-error-dark rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name*
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
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                className="input"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="youtubeChannel" className="block text-sm font-medium text-gray-700 mb-1">
                YouTube Channel (if any)
              </label>
              <input
                type="text"
                id="youtubeChannel"
                name="youtubeChannel"
                value={formData.youtubeChannel}
                onChange={handleFormChange}
                className="input"
                placeholder="https://youtube.com/channel/..."
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                Why do you want to become a creator?*
              </label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleFormChange}
                className="input min-h-[120px]"
                rows={5}
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-3 bg-blue-300 text-gray-800 rounded-md font-medium hover:bg-blue-400 transition-colors"
            >
              Submit Application
            </button>
            
            <div className="mt-4 text-center text-sm text-gray-500">
              By applying, you agree to our <a href="#" className="text-primary-dark hover:underline">Terms of Service</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatorApplicationPage;