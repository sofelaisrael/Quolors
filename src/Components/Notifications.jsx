import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Copy, Heart, Save, AlertCircle } from 'lucide-react';
import { removeNotification } from '../store/slices/notificationSlice';

const NotificationIcon = ({ type }) => {
  const iconProps = { size: 20 };
  
  switch (type) {
    case 'success':
      return <CheckCircle {...iconProps} className="text-green-500" />;
    case 'copy':
      return <Copy {...iconProps} className="text-blue-500" />;
    case 'favorite':
      return <Heart {...iconProps} className="text-red-500" />;
    case 'save':
      return <Save {...iconProps} className="text-purple-500" />;
    case 'error':
      return <AlertCircle {...iconProps} className="text-red-500" />;
    default:
      return <AlertCircle {...iconProps} className="text-gray-500" />;
  }
};

const Notification = ({ notification }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeNotification(notification.id));
    }, notification.duration);

    return () => clearTimeout(timer);
  }, [dispatch, notification.id, notification.duration]);

  const getNotificationStyles = () => {
    const baseStyles = "flex items-center gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-sm";
    
    switch (notification.type) {
      case 'success':
        return `${baseStyles} bg-green-50 border-green-200 text-green-800`;
      case 'copy':
        return `${baseStyles} bg-blue-50 border-blue-200 text-blue-800`;
      case 'favorite':
        return `${baseStyles} bg-red-50 border-red-200 text-red-800`;
      case 'save':
        return `${baseStyles} bg-purple-50 border-purple-200 text-purple-800`;
      case 'error':
        return `${baseStyles} bg-red-50 border-red-200 text-red-800`;
      default:
        return `${baseStyles} bg-gray-50 border-gray-200 text-gray-800`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={getNotificationStyles()}
    >
      <NotificationIcon type={notification.type} />
      <span className="flex-1 font-medium">{notification.message}</span>
      <button
        onClick={() => dispatch(removeNotification(notification.id))}
        className="p-1 hover:bg-black/10 rounded-lg transition-colors"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

const Notifications = () => {
  const notifications = useSelector((state) => state.notification.notifications);

  return (
    <div className="fixed top-4 right-4 z-[200] space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => (
          <Notification key={notification.id} notification={notification} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Notifications;
