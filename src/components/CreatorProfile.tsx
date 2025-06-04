import { Instagram, Youtube, Linkedin } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useVideos } from '../context/VideoContext';
import VideoGrid from './VideoGrid';

interface CreatorProfileProps {
  creatorId: string;
  isOwner?: boolean;
}

const CreatorProfile = ({ creatorId, isOwner = false }: CreatorProfileProps) => {
  const { getCreator, followCreator, unfollowCreator, currentUser, isAuthenticated } = useAuth();
  const { getVideosByCreator, deleteVideo } = useVideos();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    videoUrl: ''
  });

  const creator = getCreator(creatorId);
  const videos = getVideosByCreator(creatorId);
  
  if (!creator) {
    return (
      <div className="text-center py-10">
        <p>Creator not found</p>
      </div>
    );
  }

  const isFollowing = currentUser?.followingCreators.includes(creatorId);

  const handleFollowToggle = () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }
    
    if (isFollowing) {
      unfollowCreator(creatorId);
    } else {
      followCreator(creatorId);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVideoDelete = (videoId: string) => {
    deleteVideo(videoId);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      {/* Creator Header */}
      <div className=" bg-gradient-to-l from-[#F5F5F5] to-[#BDE6FA] rounded-lg p-8 text-center rounded-lg shadow-card p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center">
          {/* Profile Image */}
          <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mx-auto md:mx-0 mb-4 md:mb-0">
            <img 
              src={creator.profilePic} 
              alt={creator.name} 
              className="w-full h-full object-cover" 
            />
          </div>
          
          {/* Creator Info */}
          <div className="md:ml-8 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold">{creator.name}</h1>
            <p className="text-gray-600 mt-1">{creator.bio}</p>
            
            {/* Follow & Share Buttons */}
            <div className="flex flex-wrap justify-center md:justify-start mt-4 gap-3">
              {!isOwner && (
                <button
                  onClick={handleFollowToggle}
                  className={`btn ${
                    isFollowing ? 'btn-secondary' : 'btn-primary'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
              <button className="btn btn-secondary">
                Share
              </button>
            </div>
            
            {/* Social Media Links */}
            <div className="flex justify-center md:justify-start mt-4 space-x-4">
              {creator.instagramHandle && (
                <a 
                  href={creator.instagramHandle}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E1306C] hover:bg-[#B3E5FC] rounded-lg p-1 transition-colors"
                >
                  <Instagram className="h-6 w-6" />
                </a>
              )}
              
              {creator.youtubeChannel && (
                <a 
                  href={creator.youtubeChannel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FF0000] hover:bg-[#B3E5FC] rounded-lg p-1 transition-colors"
                >
                  <Youtube className="h-6 w-6" />
                </a>
              )}
              
              {creator.linkedinProfile && (
                <a 
                  href={creator.linkedinProfile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0077B5] hover:bg-[#B3E5FC] rounded-lg p-1 transition-colors"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Creator Actions (only for the owner) */}
      {isOwner && (
        <div className="mb-8">
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="btn btn-primary w-full py-3 text-lg"
          >
            Upload
          </button>

          {/* Upload Form */}
          {showUploadForm && (
            <div className="mt-4 bg-white rounded-lg shadow-card p-6">
              <h2 className="text-xl font-semibold mb-4">Upload a New Video</h2>
              <form>
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Video Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    className="input"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="input"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Class 1">Class 1</option>
                    <option value="Class 2">Class 2</option>
                    <option value="Class 3">Class 3</option>
                    <option value="Class 4">Class 4</option>
                    <option value="Class 5">Class 5</option>
                    <option value="Class 6">Class 6</option>
                    <option value="Class 7">Class 7</option>
                    <option value="Class 8">Class 8</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    Video URL
                  </label>
                  <input
                    type="text"
                    id="videoUrl"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleFormChange}
                    className="input"
                    placeholder="https://example.com/video.mp4"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                >
                  Submit
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Videos */}
      <VideoGrid 
        videos={videos} 
        columns={2} 
        title="Videos" 
        isCreatorVideos={true} 
        onDelete={isOwner ? handleVideoDelete : undefined}
      />
    </div>
  );
};

export default CreatorProfile;