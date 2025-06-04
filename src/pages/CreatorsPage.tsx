import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import CreatorCard from '../components/CreatorCard';

const CreatorsPage = () => {
  const { getAllCreators } = useAuth();
  const [creators, setCreators] = useState(getAllCreators());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const allCreators = getAllCreators();
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = allCreators.filter(creator => 
        creator.name.toLowerCase().includes(query) || 
        creator.bio.toLowerCase().includes(query)
      );
      setCreators(filtered);
    } else {
      setCreators(allCreators);
    }
  }, [searchQuery, getAllCreators]);

  return (
    <div className="container mx-auto px-4 py-6 ">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">
        Meet Our <span className="text-blue-600 uppercase">CREATORS</span>
      </h1>
      
      {/* Search Box */}
      <div className="max-w-md mx-auto mb-8">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search creators..."
          className="input rounded-lg"
        />
      </div>
      
      {/* Creators Grid */}
      <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {creators.map(creator => (
          <CreatorCard
            key={creator.id}
            id={creator.id}
            name={creator.name}
            profilePic={creator.profilePic}
            followers={creator.followers}
          />
        ))}
        
        {creators.length === 0 && (
          <div className="col-span-3 text-center py-8">
            <p className="text-gray-500">No creators found matching your search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorsPage;