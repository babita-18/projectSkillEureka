import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useVideos } from '../context/VideoContext';
import VideoGrid from '../components/VideoGrid';

const MyLibraryPage = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { getLikedVideos, getSavedVideos, getWatchLaterVideos, getHistoryVideos } = useVideos();
  
  const [activeTab, setActiveTab] = useState<'saved' | 'liked' | 'watch-later' | 'history'>('saved');
  
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">My Library</h1>
        <p className="mb-4">Please sign in to access your library</p>
        <a href="/login" className="btn btn-primary">Sign In</a>
      </div>
    );
  }
  
  const savedVideos = getSavedVideos(currentUser?.savedVideos || []);
  const likedVideos = getLikedVideos(currentUser?.likedVideos || []);
  const watchLaterVideos = getWatchLaterVideos(currentUser?.watchLaterVideos || []);
  const historyVideos = getHistoryVideos(currentUser?.history || []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">My Library</h1>
      
      {/* Library Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('saved')}
            className={`pb-3 px-1 font-medium ${
              activeTab === 'saved'
                ? 'text-primary-dark border-b-2 border-primary-dark'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Saved Videos
          </button>
          <button
            onClick={() => setActiveTab('liked')}
            className={`pb-3 px-1 font-medium ${
              activeTab === 'liked'
                ? 'text-primary-dark border-b-2 border-primary-dark'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Liked Videos
          </button>
          <button
            onClick={() => setActiveTab('watch-later')}
            className={`pb-3 px-1 font-medium ${
              activeTab === 'watch-later'
                ? 'text-primary-dark border-b-2 border-primary-dark'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Watch Later
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-1 font-medium ${
              activeTab === 'history'
                ? 'text-primary-dark border-b-2 border-primary-dark'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            History
          </button>
        </div>
      </div>
      
      {/* Active Tab Content */}
      <div className="py-4">
        {activeTab === 'saved' && (
          <VideoGrid videos={savedVideos} columns={3} />
        )}
        
        {activeTab === 'liked' && (
          <VideoGrid videos={likedVideos} columns={3} />
        )}
        
        {activeTab === 'watch-later' && (
          <VideoGrid videos={watchLaterVideos} columns={3} />
        )}
        
        {activeTab === 'history' && (
          <VideoGrid videos={historyVideos} columns={3} />
        )}
      </div>
    </div>
  );
};

export default MyLibraryPage;