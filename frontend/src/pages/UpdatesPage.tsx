import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

const UpdatesPage = () => {
  const { getNotificationsForUser, markAllAsRead, unreadCount } = useNotifications();
  const { isAuthenticated } = useAuth();
  
  const notifications = getNotificationsForUser();

  useEffect(() => {
    // Mark all notifications as read when the page is loaded
    if (isAuthenticated) {
      markAllAsRead();
    }
  }, [isAuthenticated, markAllAsRead]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Updates</h1>
        <p className="mb-4">Please sign in to see your notifications</p>
        <Link to="/login" className="btn btn-primary">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Updates</h1>
          
          {unreadCount > 0 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-light text-gray-800">
              <Bell className="h-4 w-4 mr-1" />
              {unreadCount} new
            </span>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-card overflow-hidden">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-700">No notifications</h3>
              <p className="text-gray-500 mt-1">
                Follow creators to get updates when they upload new videos
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {notifications.map(notification => (
                <li key={notification.id} className={`p-4 hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-primary-light' : ''}`}>
                  <Link to={`/video/${notification.videoId}`} className="block">
                    <p className="text-gray-800">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdatesPage;