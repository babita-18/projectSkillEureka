import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const { currentUser, updateUserProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    bio: currentUser?.bio || '',
    profilePic: currentUser?.profilePic || ''
  });

  if (!currentUser) {
    return (
      <div className="text-center py-10">
        <p>Please log in to view your profile</p>
      </div>
    );
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="bg-primary-light rounded-lg shadow-card overflow-hidden">
        {!isEditing ? (
          <div className="p-8">
            <div className="flex flex-col items-center md:flex-row md:items-start">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-6 md:mb-0">
                <img 
                  src={currentUser.profilePic} 
                  alt={currentUser.name} 
                  className="w-full h-full object-cover " 
                />
              </div>
              
              <div className="md:ml-8 text-center md:text-left flex-1">
                <h1 className="text-2xl font-bold mb-2">{currentUser.name}</h1>
                <h2 className="text-gray-600 text-lg mb-4">@{currentUser.username}</h2>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold mb-2">About Me</h3>
                  <p className="text-gray-700">{currentUser.bio}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold mb-2">Activity Stats</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary-dark">
                        {currentUser.likedVideos.length}
                      </p>
                      <p className="text-sm text-gray-600">Liked Videos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary-dark">
                        {currentUser.savedVideos.length}
                      </p>
                      <p className="text-sm text-gray-600">Saved Videos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary-dark">
                        {currentUser.watchLaterVideos.length}
                      </p>
                      <p className="text-sm text-gray-600">Watch Later</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary-dark">
                        {currentUser.followingCreators.length}
                      </p>
                      <p className="text-sm text-gray-600">Following</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <button 
                    onClick={() => setIsEditing(true)} 
                    className="btn btn-primary"
                  >
                    Edit Profile
                  </button>
                  
                  <button 
                    onClick={logout} 
                    className="btn btn-primary"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8">
            <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="input"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleFormChange}
                  className="input min-h-[100px]"
                  rows={4}
                />
              </div>
              
              <div>
                <label htmlFor="profilePic" className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Picture URL
                </label>
                <input
                  type="text"
                  id="profilePic"
                  name="profilePic"
                  value={formData.profilePic}
                  onChange={handleFormChange}
                  className="input"
                  placeholder="https://example.com/profile.jpg"
                />
                {formData.profilePic && (
                  <div className="mt-2 w-20 h-20 rounded-full overflow-hidden">
                    <img 
                      src={formData.profilePic} 
                      alt="Profile Preview" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;