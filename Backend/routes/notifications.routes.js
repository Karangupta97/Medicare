import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification
} from '../controllers/notifications.controller.js';

const router = express.Router();

// All routes are protected and require authentication
router.use(verifyToken);

// Get all notifications for the authenticated user
router.get('/', getNotifications);

// Mark a specific notification as read
router.put('/:id/read', markNotificationRead);

// Mark all notifications as read
router.put('/mark-all-read', markAllNotificationsRead);

// Delete a notification
router.delete('/:id', deleteNotification);

export default router;