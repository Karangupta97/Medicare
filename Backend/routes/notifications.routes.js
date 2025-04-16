import express from 'express';
import { 
  getNotifications, 
  markNotificationRead, 
  markAllNotificationsRead, 
  deleteNotification,
  createNotificationEndpoint
} from '../controllers/notifications.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(verifyToken);

router.route('/').get(getNotifications);
router.route('/').post(createNotificationEndpoint);
router.route('/:id/read').put(markNotificationRead);
router.route('/mark-all-read').put(markAllNotificationsRead);
router.route('/:id').delete(deleteNotification);

export default router;