import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MoreVertical } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Video } from '../context/VideoContext';

type VideoCardProps = {
  video: Video;
  creatorName: string;
  creatorImage: string;
  isCreatorCard?: boolean;
  onDelete?: (videoId: string) => void;
};

const VideoCard = ({ video, creatorName, creatorImage, isCreatorCard = false, onDelete }: VideoCardProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const { isCreator, currentUser } = useAuth();
  
  const isOwner = isCreator && currentUser?.id === video.creatorId;
  
  const handleDelete = () => {
    if (onDelete) {
      // Show confirmation dialog
      if (window.confirm('Are you sure you want to delete this video?')) {
        onDelete(video.id);
      }
    }
    setShowOptions(false);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="video-card relative">
      <Link to={`/video/${video.id}`} className="block">
        <div className="video-thumbnail">
          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
        </div>
        <div className="p-3 bg-primary-light">
          <h3 className="font-medium text-gray-900 line-clamp-2">{video.title}</h3>
          {!isCreatorCard && (
            <div className="flex items-center mt-2">
              <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
                <img src={creatorImage} alt={creatorName} className="h-full w-full object-cover" />
              </div>
              <span className="ml-2 text-sm text-gray-700">{creatorName}</span>
            </div>
          )}
          <div className="text-xs text-gray-500 mt-1">
            {formatDate(video.uploadDate)}
          </div>
        </div>
      </Link>

      {isOwner && (
        <div className="absolute top-2 right-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowOptions(!showOptions);
            }}
            className="p-1 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-colors"
          >
            <MoreVertical size={16} />
          </button>
          
          {showOptions && (
            <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg py-1 z-10">
              <button 
                onClick={handleDelete} 
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Delete this video
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoCard;