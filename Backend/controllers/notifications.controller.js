import Notification from '../models/notification.model.js';
import asyncHandler from 'express-async-handler';

// Get all notifications for a user
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .limit(20);

  res.status(200).json({
    success: true,
    notifications,
    unreadCount: await Notification.countDocuments({ userId: req.user._id, read: false })
  });
});

// Mark a notification as read
const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  notification.read = true;
  await notification.save();

  res.status(200).json({
    success: true,
    notification
  });
});

// Mark all notifications as read
const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { userId: req.user._id, read: false },
    { read: true }
  );

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read'
  });
});

// Create a new notification (internal use)
const createNotification = async (userId, title, message, type = 'info', link = null) => {
  try {
    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
      link
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

// Delete a notification
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  await notification.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Notification deleted successfully'
  });
});

export {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  createNotification,
  deleteNotification
};