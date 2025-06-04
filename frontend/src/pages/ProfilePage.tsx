import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserProfile from '../components/UserProfile';
import CreatorProfile from '../components/CreatorProfile';

const ProfilePage = () => {
  const { isAuthenticated, isCreator, currentUser } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="bg-secondary-light min-h-screen py-6">
      {isCreator && currentUser ? (
        <CreatorProfile creatorId={currentUser.id} isOwner={true} />
      ) : (
        <UserProfile />
      )}
    </div>
  );
};

export default ProfilePage;