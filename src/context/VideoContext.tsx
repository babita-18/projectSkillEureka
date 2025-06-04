import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockVideos, mockCategories } from '../data/mockData';

export type Video = {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  creatorId: string;
  category: string;
  uploadDate: string;
  likes: number;
  saves: number;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
};

interface VideoContextType {
  videos: Video[];
  categories: Category[];
  getVideosByCategory: (category: string) => Video[];
  getVideosByCreator: (creatorId: string) => Video[];
  getVideo: (videoId: string) => Video | undefined;
  getLikedVideos: (likedIds: string[]) => Video[];
  getSavedVideos: (savedIds: string[]) => Video[];
  getWatchLaterVideos: (watchLaterIds: string[]) => Video[];
  getHistoryVideos: (historyIds: string[]) => Video[];
  searchVideos: (query: string) => Video[];
  addVideo: (video: Omit<Video, 'id' | 'likes' | 'saves' | 'uploadDate'>) => string;
  deleteVideo: (videoId: string) => void;
}

const VideoContext = createContext<VideoContextType | null>(null);

export const VideoProvider = ({ children }: { children: ReactNode }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Initialize with mock data
    setVideos(mockVideos);
    setCategories(mockCategories);
  }, []);

  const getVideosByCategory = (category: string) => {
    if (category === 'all') return videos;
    return videos.filter(video => video.category === category);
  };

  const getVideosByCreator = (creatorId: string) => {
    return videos.filter(video => video.creatorId === creatorId);
  };

  const getVideo = (videoId: string) => {
    return videos.find(video => video.id === videoId);
  };

  const getLikedVideos = (likedIds: string[]) => {
    return videos.filter(video => likedIds.includes(video.id));
  };

  const getSavedVideos = (savedIds: string[]) => {
    return videos.filter(video => savedIds.includes(video.id));
  };

  const getWatchLaterVideos = (watchLaterIds: string[]) => {
    return videos.filter(video => watchLaterIds.includes(video.id));
  };

  const getHistoryVideos = (historyIds: string[]) => {
    // Return videos in the order they appear in history
    return historyIds
      .map(id => videos.find(video => video.id === id))
      .filter((video): video is Video => video !== undefined);
  };

  const searchVideos = (query: string) => {
    if (!query.trim()) return videos;
    const lowercaseQuery = query.toLowerCase();
    return videos.filter(video => 
      video.title.toLowerCase().includes(lowercaseQuery)
    );
  };

  const addVideo = (video: Omit<Video, 'id' | 'likes' | 'saves' | 'uploadDate'>) => {
    const newVideo: Video = {
      id: `video-${Date.now()}`,
      ...video,
      likes: 0,
      saves: 0,
      uploadDate: new Date().toISOString()
    };
    
    setVideos(prev => [newVideo, ...prev]);
    return newVideo.id;
  };

  const deleteVideo = (videoId: string) => {
    setVideos(prev => prev.filter(video => video.id !== videoId));
  };

  const contextValue = {
    videos,
    categories,
    getVideosByCategory,
    getVideosByCreator,
    getVideo,
    getLikedVideos,
    getSavedVideos,
    getWatchLaterVideos,
    getHistoryVideos,
    searchVideos,
    addVideo,
    deleteVideo,
  };

  return (
    <VideoContext.Provider value={contextValue}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideos = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideos must be used within a VideoProvider');
  }
  return context;
};