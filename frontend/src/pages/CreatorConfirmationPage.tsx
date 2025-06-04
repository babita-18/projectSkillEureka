import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CreatorConfirmationPage = () => {
  const navigate = useNavigate();
  const { verifyCreator } = useAuth();
  const [confirmationCode, setConfirmationCode] = useState('');
  const [error, setError] = useState('');
  const [creatorEmail, setCreatorEmail] = useState('');
  const [creatorName, setCreatorName] = useState('');
  
  useEffect(() => {
    const email = sessionStorage.getItem('pendingCreatorEmail');
    const name = sessionStorage.getItem('pendingCreatorName');
    
    if (!email) {
      navigate('/become-creator');
      return;
    }
    
    setCreatorEmail(email);
    setCreatorName(name || '');
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!confirmationCode.trim()) {
      setError('Please enter your confirmation code');
      return;
    }
    
    const success = verifyCreator(creatorEmail, confirmationCode);
    
    if (success) {
      navigate('/login');
    } else {
      setError('Invalid confirmation code');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-card">
        <h1 className="text-2xl font-bold text-center mb-2">Verify Your Account</h1>
        <p className="text-center text-gray-600 mb-6">
          Thanks for your application{creatorName ? `, ${creatorName}` : ''}! Please wait until we get a confirmation.
        </p>
        
        <div className="mb-6 p-4 bg-accent-light rounded-md text-gray-700">
          <p>
            We've received your creator application. Our team will review your details and send a confirmation code to <strong>{creatorEmail}</strong>.
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="confirmationCode" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmation Code
            </label>
            <input
              type="text"
              id="confirmationCode"
              value={confirmationCode}
              onChange={(e) => {
                setConfirmationCode(e.target.value);
                setError('');
              }}
              className="input"
              placeholder="Enter 8-character code"
              maxLength={8}
            />
            {error && (
              <p className="mt-1 text-sm text-error-DEFAULT">{error}</p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full py-2 bg-primary-DEFAULT text-gray-800 rounded-md font-medium hover:bg-primary-dark transition-colors"
          >
            Verify Account
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <Link to="/" className="text-primary-dark hover:underline">
            Skip to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreatorConfirmationPage;