import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type CreatorCardProps = {
  id: string;
  name: string;
  profilePic: string;
  followers: string[];
};

const CreatorCard = ({ id, name, profilePic, followers }: CreatorCardProps) => {
  const { currentUser, followCreator, unfollowCreator, isAuthenticated } = useAuth();

  const isFollowing = currentUser?.followingCreators.includes(id);
  
  const handleFollowClick = () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }
    
    if (isFollowing) {
      unfollowCreator(id);
    } else {
      followCreator(id);
    }
  };

  return (
    <div className=" bg-primary-light rounded-lg shadow-card overflow-hidden">
      <Link to={`/creator/${id}`} className="block">
        <div className="w-full aspect-video bg-primary-light">
          <img 
            src={profilePic} 
            alt={name} 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-sm text-gray-600">{followers.length} followers</p>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <button
          onClick={handleFollowClick}
          className={`w-full py-2 rounded-md font-medium transition-colors ${
            isFollowing 
              ? 'btn-secondary' : 'btn-primary'
          }`}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      </div>
    </div>
  );
};

export default CreatorCard;