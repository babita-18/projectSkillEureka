import { useState, useEffect } from 'react';
import { useVideos } from '../context/VideoContext';
import { useAuth } from '../context/AuthContext';
import CategoryBar from '../components/CategoryBar';
import VideoGrid from '../components/VideoGrid';

const HomePage = () => {
  const { videos, getVideosByCategory } = useVideos();
  const [filteredVideos, setFilteredVideos] = useState(videos);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Update filtered videos when videos change or search/category changes
  useEffect(() => {
    let results = selectedCategory === 'all' 
      ? videos 
      : getVideosByCategory(selectedCategory);
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(video => 
        video.title.toLowerCase().includes(query)
      );
    }
    
    // Sort by upload date (newest first)
    results = [...results].sort(
      (a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    );
    
    setFilteredVideos(results);
  }, [videos, searchQuery, selectedCategory, getVideosByCategory]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Search Bar (for desktop, mobile search is in header) */}
       <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search videos..."
          className="input px-43 rounded-lg "
        />
      <div className=" md:block max-w-xl mx-auto mb-6">
       
      </div>
      
      {/* Categories */}
      <CategoryBar onCategorySelect={handleCategorySelect} />
      
      {/* Videos Grid */}
      <div className="mt-8 bg-  rounded-lg p-8 text-center ">
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