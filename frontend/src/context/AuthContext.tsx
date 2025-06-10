import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockUsers, mockCreators } from '../data/mockData';

type User = {
  id: string;
  name: string;
  username: string;
  email?: string;
  bio: string;
  profilePic: string;
  isCreator: boolean;
  followingCreators: string[];
  likedVideos: string[];
  savedVideos: string[];
  watchLaterVideos: string[];
  history: string[];
};

type Creator = {
  id: string;
  name: string;
  username: string;
  email: string;
  bio: string;
  profilePic: string;
  youtubeChannel?: string;
  instagramHandle?: string;
  linkedinProfile?: string;
  followers: string[];
  videos: string[];
  confirmationCode?: string;
  isVerified: boolean;
};

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isCreator: boolean;
  login: (username: string, password: string) => boolean;
  signup: (userData: Partial<User>) => void;
  logout: () => void;
  updateUserProfile: (userData: Partial<User>, profilePic?: File) => void;
  applyAsCreator: (creatorData: Partial<Creator>) => string;
  verifyCreator: (email: string, code: string) => boolean;
  followCreator: (creatorId: string) => void;
  unfollowCreator: (creatorId: string) => void;
  getCreator: (creatorId: string) => Creator | undefined;
  getAllCreators: () => Creator[];
  likeVideo: (videoId: string) => void;
  unlikeVideo: (videoId: string) => void;
  saveVideo: (videoId: string) => void;
  unsaveVideo: (videoId: string) => void;
  addToWatchLater: (videoId: string) => void;
  removeFromWatchLater: (videoId: string) => void;
  addToHistory: (videoId: string) => void;
  handleProfilePicUpload: (file: File) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    // Initialize with mock data
    setUsers(mockUsers);
    setCreators(mockCreators);
    
    // Check for saved user session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsAuthenticated(true);
      setIsCreator(user.isCreator);
    }
  }, []);

  const login = (username: string, password: string) => {
    // In a real app, this would validate against the backend
    const user = users.find(u => u.username === username);
    const creator = creators.find(c => c.username === username && c.isVerified);
    
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      setIsCreator(false);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    
    if (creator) {
      const creatorAsUser: User = {
        id: creator.id,
        name: creator.name,
        username: creator.username,
        bio: creator.bio,
        profilePic: creator.profilePic,
        isCreator: true,
        followingCreators: [],
        likedVideos: [],
        savedVideos: [],
        watchLaterVideos: [],
        history: []
      };
      
      setCurrentUser(creatorAsUser);
      setIsAuthenticated(true);
      setIsCreator(true);
      localStorage.setItem('currentUser', JSON.stringify(creatorAsUser));
      return true;
    }
    
    return false;
  };

  const signup = (userData: Partial<User>) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name || 'User',
      username: userData.username || `user${Date.now()}`,
      bio: userData.bio || '',
      profilePic: userData.profilePic || 'https://via.placeholder.com/150',
      isCreator: false,
      followingCreators: [],
      likedVideos: [],
      savedVideos: [],
      watchLaterVideos: [],
      history: []
    };
    
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsCreator(false);
    localStorage.removeItem('currentUser');
  };

  const handleProfilePicUpload = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  const updateUserProfile = async (userData: Partial<User>, profilePic?: File) => {
    if (!currentUser) return;
    
    let profilePicUrl = userData.profilePic;
    if (profilePic) {
      try {
        profilePicUrl = await handleProfilePicUpload(profilePic);
      } catch (error) {
        console.error('Failed to upload profile picture:', error);
      }
    }
    
    const updatedUser = { 
      ...currentUser, 
      ...userData,
      profilePic: profilePicUrl || currentUser.profilePic 
    };
    
    setCurrentUser(updatedUser);
    
    if (currentUser.isCreator) {
      setCreators(creators.map(c => 
        c.id === currentUser.id ? { ...c, ...userData, profilePic: profilePicUrl || c.profilePic } : c
      ));
    } else {
      setUsers(users.map(u => 
        u.id === currentUser.id ? { ...u, ...userData, profilePic: profilePicUrl || u.profilePic } : u
      ));
    }
    
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  const generateConfirmationCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const applyAsCreator = (creatorData: Partial<Creator>) => {
    const confirmationCode = generateConfirmationCode();
    
    const newCreator: Creator = {
      id: `creator-${Date.now()}`,
      name: creatorData.name || 'Creator',
      username: creatorData.username || `creator${Date.now()}`,
      email: creatorData.email || '',
      bio: creatorData.bio || '',
      profilePic: creatorData.profilePic || 'https://via.placeholder.com/150',
      youtubeChannel: creatorData.youtubeChannel || '',
      instagramHandle: creatorData.instagramHandle || '',
      linkedinProfile: creatorData.linkedinProfile || '',
      followers: [],
      videos: [],
      confirmationCode,
      isVerified: false
    };
    
    setCreators(prev => [...prev, newCreator]);
    return confirmationCode;
  };

  const verifyCreator = (email: string, code: string) => {
    const creatorIndex = creators.findIndex(c => c.email === email && c.confirmationCode === code);
    
    if (creatorIndex >= 0) {
      const updatedCreators = [...creators];
      updatedCreators[creatorIndex] = {
        ...updatedCreators[creatorIndex],
        isVerified: true
      };
      
      setCreators(updatedCreators);
      return true;
    }
    
    return false;
  };

  const followCreator = (creatorId: string) => {
    if (!currentUser) return;
    
    // Update current user
    if (!currentUser.followingCreators.includes(creatorId)) {
      const updatedUser = {
        ...currentUser,
        followingCreators: [...currentUser.followingCreators, creatorId]
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Update users array
      setUsers(users.map(u => 
        u.id === currentUser.id ? updatedUser : u
      ));
    }
    
    // Update creator's followers
    setCreators(creators.map(c => {
      if (c.id === creatorId && !c.followers.includes(currentUser.id)) {
        return {
          ...c,
          followers: [...c.followers, currentUser.id]
        };
      }
      return c;
    }));
  };

  const unfollowCreator = (creatorId: string) => {
    if (!currentUser) return;
    
    // Update current user
    const updatedUser = {
      ...currentUser,
      followingCreators: currentUser.followingCreators.filter(id => id !== creatorId)
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Update users array
    setUsers(users.map(u => 
      u.id === currentUser.id ? updatedUser : u
    ));
    
    // Update creator's followers
    setCreators(creators.map(c => {
      if (c.id === creatorId) {
        return {
          ...c,
          followers: c.followers.filter(id => id !== currentUser.id)
        };
      }
      return c;
    }));
  };

  const getCreator = (creatorId: string) => {
    return creators.find(c => c.id === creatorId);
  };

  const getAllCreators = () => {
    return creators.filter(c => c.isVerified);
  };

  const likeVideo = (videoId: string) => {
    if (!currentUser) return;
    
    if (!currentUser.likedVideos.includes(videoId)) {
      const updatedUser = {
        ...currentUser,
        likedVideos: [...currentUser.likedVideos, videoId]
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const unlikeVideo = (videoId: string) => {
    if (!currentUser) return;
    
    const updatedUser = {
      ...currentUser,
      likedVideos: currentUser.likedVideos.filter(id => id !== videoId)
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  const saveVideo = (videoId: string) => {
    if (!currentUser) return;
    
    if (!currentUser.savedVideos.includes(videoId)) {
      const updatedUser = {
        ...currentUser,
        savedVideos: [...currentUser.savedVideos, videoId]
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const unsaveVideo = (videoId: string) => {
    if (!currentUser) return;
    
    const updatedUser = {
      ...currentUser,
      savedVideos: currentUser.savedVideos.filter(id => id !== videoId)
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  const addToWatchLater = (videoId: string) => {
    if (!currentUser) return;
    
    if (!currentUser.watchLaterVideos.includes(videoId)) {
      const updatedUser = {
        ...currentUser,
        watchLaterVideos: [...currentUser.watchLaterVideos, videoId]
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const removeFromWatchLater = (videoId: string) => {
    if (!currentUser) return;
    
    const updatedUser = {
      ...currentUser,
      watchLaterVideos: currentUser.watchLaterVideos.filter(id => id !== videoId)
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  const addToHistory = (videoId: string) => {
    if (!currentUser || !isAuthenticated) return;
    
    // Remove video from history if it already exists
    const filteredHistory = currentUser.history.filter(id => id !== videoId);
    
    // Add video to the beginning and keep only last 10 videos
    const updatedHistory = [videoId, ...filteredHistory].slice(0, 10);
    
    const updatedUser = {
      ...currentUser,
      history: updatedHistory
    };
    
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Update users array
    if (!currentUser.isCreator) {
      setUsers(users.map(u => 
        u.id === currentUser.id ? updatedUser : u
      ));
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated,
      isCreator,
      login,
      signup,
      logout,
      updateUserProfile,
      applyAsCreator,
      verifyCreator,
      followCreator,
      unfollowCreator,
      getCreator,
      getAllCreators,
      likeVideo,
      unlikeVideo,
      saveVideo,
      unsaveVideo,
      addToWatchLater,
      removeFromWatchLater,
      addToHistory,
      handleProfilePicUpload
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};