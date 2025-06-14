import React, { useEffect, useState } from 'react';
import { apiService } from '@/lib/apiService';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notificationData = await apiService.getNotifications();
        setNotifications(notificationData);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Notificaciones</h1>

      <ul className="space-y-2">
        {notifications.map((notification) => (
          <li key={notification.id} className="border p-2 rounded">
            <p>{notification.message}</p>
            <small className="text-gray-500">{new Date(notification.date).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;