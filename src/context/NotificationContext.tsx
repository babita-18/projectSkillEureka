import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useVideos, Video } from './VideoContext';
import { mockNotifications } from '../data/mockData';

export type Notification = {
  id: string;
  userId: string;
  creatorId: string;
  videoId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  createNotification: (creatorId: string, videoId: string) => void;
  getNotificationsForUser: () => Notification[];
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { currentUser } = useAuth();
  const { getVideo } = useVideos();

  useEffect(() => {
    // Initialize with mock data
    setNotifications(mockNotifications);
  }, []);

  const unreadCount = notifications.filter(
    n => !n.isRead && n.userId === currentUser?.id
  ).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    if (!currentUser) return;
    
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.userId === currentUser.id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const createNotification = (creatorId: string, videoId: string) => {
    if (!currentUser) return;
    
    // Get the video details
    const video = getVideo(videoId);
    if (!video) return;
    
    // Create notifications for all users following this creator
    const newNotification: Notification = {
      id: `notification-${Date.now()}`,
      userId: currentUser.id,
      creatorId,
      videoId,
      message: `${video.title} was uploaded by a creator you follow`,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  const getNotificationsForUser = () => {
    if (!currentUser) return [];
    return notifications.filter(n => n.userId === currentUser.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const contextValue = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    createNotification,
    getNotificationsForUser,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};