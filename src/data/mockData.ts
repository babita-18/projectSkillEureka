import { Video, Category } from "../context/VideoContext";
import { Notification } from "../context/NotificationContext";

// Mock Users
export const mockUsers = [
  {
    id: 'user1',
    name: 'John Doe',
    username: 'johndoe',
    bio: 'Enthusiastic learner',
    profilePic: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600',
    isCreator: false,
    followingCreators: ['creator1', 'creator2'],
    likedVideos: ['video1', 'video3'],
    savedVideos: ['video2', 'video4'],
    watchLaterVideos: ['video5'],
    history: ['video1', 'video2', 'video3']
  },
  {
    id: 'user2',
    name: 'Jane Smith',
    username: 'janesmith',
    bio: 'Always curious, always learning',
    profilePic: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600',
    isCreator: false,
    followingCreators: ['creator1'],
    likedVideos: ['video2', 'video5'],
    savedVideos: ['video1'],
    watchLaterVideos: ['video3', 'video4'],
    history: ['video5', 'video4', 'video2']
  }
];

// Mock Creators
export const mockCreators = [
  {
    id: 'creator1',
    name: 'Alex Johnson',
    username: 'alexj',
    email: 'alex@example.com',
    bio: 'Mathematics professor with 10+ years of teaching experience',
    profilePic: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600',
    youtubeChannel: 'https://youtube.com/alexjohnson',
    instagramHandle: 'https://instagram.com/alexjohnson',
    linkedinProfile: 'https://linkedin.com/in/alexjohnson',
    followers: ['user1', 'user2'],
    videos: ['video1', 'video2', 'video3'],
    isVerified: true
  },
  {
    id: 'creator2',
    name: 'Sarah Chen',
    username: 'sarahc',
    email: 'sarah@example.com',
    bio: 'Science educator specializing in physics and astronomy',
    profilePic: 'https://images.pexels.com/photos/3394347/pexels-photo-3394347.jpeg?auto=compress&cs=tinysrgb&w=600',
    youtubeChannel: 'https://youtube.com/sarahchen',
    instagramHandle: 'https://instagram.com/sarahchen',
    linkedinProfile: 'https://linkedin.com/in/sarahchen',
    followers: ['user1'],
    videos: ['video4', 'video5'],
    isVerified: true
  },
  {
    id: 'creator3',
    name: 'Michael Rodriguez',
    username: 'michaelr',
    email: 'michael@example.com',
    bio: 'Computer Science professor focusing on algorithms and data structures',
    profilePic: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600',
    youtubeChannel: 'https://youtube.com/michaelrodriguez',
    instagramHandle: 'https://instagram.com/michaelrodriguez',
    linkedinProfile: 'https://linkedin.com/in/michaelrodriguez',
    followers: [],
    videos: ['video6', 'video7'],
    isVerified: true
  }
];

// Mock Videos
export const mockVideos: Video[] = [
  {
    id: 'video1',
    title: 'Introduction to Algebra',
    thumbnail: 'https://images.pexels.com/photos/4144179/pexels-photo-4144179.jpeg?auto=compress&cs=tinysrgb&w=600',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    creatorId: 'creator1',
    category: 'Class 8',
    uploadDate: '2025-04-15T12:00:00Z',
    likes: 120,
    saves: 45
  },
  {
    id: 'video2',
    title: 'Understanding Equations',
    thumbnail: 'https://images.pexels.com/photos/6238050/pexels-photo-6238050.jpeg?auto=compress&cs=tinysrgb&w=600',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    creatorId: 'creator1',
    category: 'Class 7',
    uploadDate: '2025-04-10T10:30:00Z',
    likes: 98,
    saves: 32
  },
  {
    id: 'video3',
    title: 'Geometry Basics',
    thumbnail: 'https://images.pexels.com/photos/3768894/pexels-photo-3768894.jpeg?auto=compress&cs=tinysrgb&w=600',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    creatorId: 'creator1',
    category: 'Class 6',
    uploadDate: '2025-04-05T14:45:00Z',
    likes: 156,
    saves: 67
  },
  {
    id: 'video4',
    title: 'Introduction to Physics',
    thumbnail: 'https://images.pexels.com/photos/2156881/pexels-photo-2156881.jpeg?auto=compress&cs=tinysrgb&w=600',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    creatorId: 'creator2',
    category: 'Class 8',
    uploadDate: '2025-04-02T09:15:00Z',
    likes: 210,
    saves: 89
  },
  {
    id: 'video5',
    title: 'Solar System Exploration',
    thumbnail: 'https://images.pexels.com/photos/73873/star-clusters-rosette-nebula-star-galaxies-73873.jpeg?auto=compress&cs=tinysrgb&w=600',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    creatorId: 'creator2',
    category: 'Class 5',
    uploadDate: '2025-03-28T11:20:00Z',
    likes: 178,
    saves: 76
  },
  {
    id: 'video6',
    title: 'Introduction to Algorithms',
    thumbnail: 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=600',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    creatorId: 'creator3',
    category: 'Class 8',
    uploadDate: '2025-04-18T13:10:00Z',
    likes: 132,
    saves: 58
  },
  {
    id: 'video7',
    title: 'Data Structures Fundamentals',
    thumbnail: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=600',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    creatorId: 'creator3',
    category: 'Class 7',
    uploadDate: '2025-04-14T15:30:00Z',
    likes: 145,
    saves: 62
  },
  {
    id: 'video8',
    title: 'Basic English Grammar',
    thumbnail: 'https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=600',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    creatorId: 'creator1',
    category: 'Class 3',
    uploadDate: '2025-04-12T16:45:00Z',
    likes: 87,
    saves: 41
  }
];

// Mock Categories
export const mockCategories: Category[] = [
  { id: 'cat1', name: 'Class 1', icon: '1' },
  { id: 'cat2', name: 'Class 2', icon: '2' },
  { id: 'cat3', name: 'Class 3', icon: '3' },
  { id: 'cat4', name: 'Class 4', icon: '4' },
  { id: 'cat5', name: 'Class 5', icon: '5' },
  { id: 'cat6', name: 'Class 6', icon: '6' },
  { id: 'cat7', name: 'Class 7', icon: '7' },
  { id: 'cat8', name: 'Class 8', icon: '8' }
];

// Mock Team Members
export const mockTeamMembers = [
  {
    id: 'team1',
    name: 'Dr. Anand Kumar',
    role: 'Founder & Lead Developer',
    bio: 'Computer Science professor at IIT Guwahati with a passion for accessible education',
    profilePic: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=600',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/anandkumar',
      twitter: 'https://twitter.com/anandkumar',
      github: 'https://github.com/anandkumar'
    }
  },
  {
    id: 'team2',
    name: 'Dr. Priya Singh',
    role: 'Education Director',
    bio: 'Former high school principal with 15 years of experience in education management',
    profilePic: 'https://images.pexels.com/photos/3767392/pexels-photo-3767392.jpeg?auto=compress&cs=tinysrgb&w=600',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/priyasingh',
      twitter: 'https://twitter.com/priyasingh'
    }
  },
  {
    id: 'team3',
    name: 'Rahul Sharma',
    role: 'Full Stack Developer',
    bio: 'IIT Guwahati graduate with expertise in React, Node.js and cloud infrastructure',
    profilePic: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=600',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/rahulsharma',
      github: 'https://github.com/rahulsharma',
      twitter: 'https://twitter.com/rahulsharma'
    }
  }
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notif1',
    userId: 'user1',
    creatorId: 'creator1',
    videoId: 'video1',
    message: 'Introduction to Algebra was uploaded by Alex Johnson',
    isRead: false,
    createdAt: '2025-04-15T12:05:00Z'
  },
  {
    id: 'notif2',
    userId: 'user1',
    creatorId: 'creator2',
    videoId: 'video4',
    message: 'Introduction to Physics was uploaded by Sarah Chen',
    isRead: true,
    createdAt: '2025-04-02T09:20:00Z'
  },
  {
    id: 'notif3',
    userId: 'user2',
    creatorId: 'creator1',
    videoId: 'video3',
    message: 'Geometry Basics was uploaded by Alex Johnson',
    isRead: false,
    createdAt: '2025-04-05T14:50:00Z'
  }
];