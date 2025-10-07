import { Router } from 'express';
import { dashboardController } from '@/controllers/dashboardController';
import { authenticate, authorize } from '@/middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/v1/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get('/stats', authenticate, dashboardController.getDashboardStats);

/**
 * @swagger
 * /api/v1/dashboard/system:
 *   get:
 *     summary: Get system statistics (admin only)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System statistics retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions
 */
router.get('/system', authenticate, authorize('ADMIN', 'SUPERVISOR'), dashboardController.getSystemStats);

export default router;
