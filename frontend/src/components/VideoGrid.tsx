import { useState, useEffect } from 'react';
import VideoCard from './VideoCard';
import { useVideos, Video } from '../context/VideoContext';
import { useAuth } from '../context/AuthContext';

interface VideoGridProps {
  videos: Video[];
  columns?: number;
  title?: string;
  isCreatorVideos?: boolean;
  onDelete?: (videoId: string) => void;
}

const VideoGrid = ({ videos, columns = 2, title, isCreatorVideos = false, onDelete }: VideoGridProps) => {
  const { getCreator } = useAuth();
  const [creatorsMap, setCreatorsMap] = useState<Record<string, { name: string, image: string }>>({});

  useEffect(() => {
    // Build a map of creator data for each video
    const creatorData: Record<string, { name: string, image: string }> = {};
    
    videos.forEach(video => {
      if (!creatorData[video.creatorId]) {
        const creator = getCreator(video.creatorId);
        if (creator) {
          creatorData[video.creatorId] = {
            name: creator.name,
            image: creator.profilePic
          };
        }
      }
    });
    
    setCreatorsMap(creatorData);
  }, [videos, getCreator]);

  const getColumnClass = () => {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 sm:grid-cols-2';
      case 3: return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
      case 4: return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
      default: return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
    }
  };

  if (videos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No videos to display</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {title && (
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">{title}</h2>
      )}
      <div className={`grid ${getColumnClass()} gap-4`}>
        {videos.map(video => (
          <VideoCard
            key={video.id}
            video={video}
            creatorName={creatorsMap[video.creatorId]?.name || ''}
            creatorImage={creatorsMap[video.creatorId]?.image || ''}
            isCreatorCard={isCreatorVideos}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoGrid;