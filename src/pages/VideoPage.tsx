import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ThumbsUp, Bookmark, Clock, Share2 } from 'lucide-react';
import { useVideos } from '../context/VideoContext';
import { useAuth } from '../context/AuthContext';
import VideoPlayer from '../components/VideoPlayer';
import VideoGrid from '../components/VideoGrid';

const VideoPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getVideo, getVideosByCreator } = useVideos();
  const { 
    getCreator, 
    likeVideo, 
    unlikeVideo, 
    saveVideo, 
    unsaveVideo, 
    addToWatchLater, 
    removeFromWatchLater, 
    currentUser,
    isAuthenticated
  } = useAuth();
  
  const [video, setVideo] = useState(id ? getVideo(id) : undefined);
  const [creator, setCreator] = useState(video ? getCreator(video.creatorId) : undefined);
  const [relatedVideos, setRelatedVideos] = useState(
    video ? getVideosByCreator(video.creatorId).filter(v => v.id !== id) : []
  );
  
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isWatchLater, setIsWatchLater] = useState(false);
  
  useEffect(() => {
    if (id) {
      const videoData = getVideo(id);
      setVideo(videoData);
      
      if (videoData) {
        const creatorData = getCreator(videoData.creatorId);
        setCreator(creatorData);
        
        setRelatedVideos(
          getVideosByCreator(videoData.creatorId).filter(v => v.id !== id)
        );
      }
    }
  }, [id, getVideo, getCreator, getVideosByCreator]);
  
  useEffect(() => {
    if (currentUser && video) {
      setIsLiked(currentUser.likedVideos.includes(video.id));
      setIsSaved(currentUser.savedVideos.includes(video.id));
      setIsWatchLater(currentUser.watchLaterVideos.includes(video.id));
    }
  }, [currentUser, video]);
  
  const handleLikeToggle = () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    
    if (video) {
      if (isLiked) {
        unlikeVideo(video.id);
      } else {
        likeVideo(video.id);
      }
      setIsLiked(!isLiked);
    }
  };
  
  const handleSaveToggle = () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    
    if (video) {
      if (isSaved) {
        unsaveVideo(video.id);
      } else {
        saveVideo(video.id);
      }
      setIsSaved(!isSaved);
    }
  };
  
  const handleWatchLaterToggle = () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    
    if (video) {
      if (isWatchLater) {
        removeFromWatchLater(video.id);
      } else {
        addToWatchLater(video.id);
      }
      setIsWatchLater(!isWatchLater);
    }
  };
  
  if (!video || !creator) {
    return (
      <div className="text-center py-10">
        <p>Video not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Video and Info Column */}
        <div className="w-full lg:w-2/3">
          {/* Video Player */}
          <VideoPlayer videoUrl={video.videoUrl} title={video.title} />
          
          {/* Video Info */}
          <div className="mt-4 ">
            <h1 className="text-xl md:text-2xl font-bold">{video.title}</h1>
            
            {/* Creator Info */}
            <div className="mt-4 flex items-center">
              <Link to={`/creator/${creator.id}`} className="flex items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img 
                    src={creator.profilePic} 
                    alt={creator.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <span className="ml-2 font-medium">{creator.name}</span>
              </Link>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-4 flex flex-wrap gap-3">
              <button 
                onClick={handleLikeToggle}
                className={`flex items-center space-x-1 px-4 py-2 rounded-full ${
                  isLiked 
                    ? 'bg-blue-300' 
                    : 'bg-gray-300 hover:bg-primary-dark'
                } transition-colors`}
              >
                <ThumbsUp className={`h-5 w-5 ${isLiked ? 'text-blue-600' : 'text-gray-900'}`} />
                <span>Like</span>
              </button>
              
              <button 
                onClick={handleSaveToggle}
                className={`flex items-center space-x-1 px-4 py-2 rounded-full ${
                  isSaved 
                    ? 'bg-blue-300' 
                    : 'bg-gray-300 hover:bg-primary-dark'
                } transition-colors`}
              >
                <Bookmark className={`h-5 w-5 ${isSaved ? 'text-blue-600' : 'text-gray-900'}`} />
                <span>Save</span>
              </button>
              
              <button 
                onClick={handleWatchLaterToggle}
                className={`flex items-center space-x-1 px-4 py-2 rounded-full ${
                  isWatchLater 
                    ? 'bg-blue-300' 
                    : 'bg-gray-300 hover:bg-primary-dark'
                } transition-colors`}
              >
                <Clock className={`h-5 w-5 ${isWatchLater ? 'text-blue-600' : 'text-gray-900'}`} />
                <span>Watch Later</span>
              </button>
              
              <button className="flex items-center space-x-1 px-4 py-2 rounded-full bg-blue-300 hover:bg-gray-400 transition-colors">
                <Share2 className="h-5 w-5 text-gray-600" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Related Videos Column */}
        <div className="w-full lg:w-1/3">
          <h2 className="text-xl font-semibold mb-4">More from this creator</h2>
          <div className="space-y-4">
            {relatedVideos.map(video => (
              <Link 
                to={`/video/${video.id}`} 
                key={video.id}
                className="flex gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-40 h-24 bg-primary-light rounded overflow-hidden flex-shrink-0">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div>
                  <h3 className="font-medium line-clamp-2">{video.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{creator.name}</p>
                </div>
              </Link>
            ))}
            
            {relatedVideos.length === 0 && (
              <p className="text-gray-500">No more videos from this creator</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPage;