import { useState, useEffect } from 'react';
import { useVideos } from '../context/VideoContext';
import CategoryBar from '../components/CategoryBar';
import VideoGrid from '../components/VideoGrid';

const HomePage = () => {
  const { videos, getVideosByCategory, searchVideos } = useVideos();
  const [filteredVideos, setFilteredVideos] = useState(videos);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Update filtered videos when videos change or search/category changes
  useEffect(() => {
    let results = selectedCategory === 'all' 
      ? videos 
      : getVideosByCategory(selectedCategory);
    
    if (searchQuery) {
      results = searchVideos(searchQuery);
      if (selectedCategory !== 'all') {
        results = results.filter(video => video.category === selectedCategory);
      }
    }
    
    // Sort by upload date (newest first)
    results = [...results].sort(
      (a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    );
    
    setFilteredVideos(results);
  }, [videos, searchQuery, selectedCategory, getVideosByCategory, searchVideos]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  // Listen for search from header
  useEffect(() => {
    const handleSearch = (event: CustomEvent) => {
      setSearchQuery(event.detail.query);
    };

    window.addEventListener('headerSearch', handleSearch as EventListener);
    return () => window.removeEventListener('headerSearch', handleSearch as EventListener);
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Categories */}
      <CategoryBar onCategorySelect={handleCategorySelect} />
      
      {/* Videos Grid */}
      <div className="mt-6">
        <VideoGrid 
          videos={filteredVideos}
          columns={4} 
          title="Top Videos"
        />
      </div>
    </div>
  );
};

export default HomePage;