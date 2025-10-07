import { Router } from 'express';
import { reportController } from '@/controllers/reportController';
import { authenticate, authorize, optionalAuth } from '@/middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/v1/reports:
 *   post:
 *     summary: Create a new report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sampleId
 *               - grade
 *               - unit
 *             properties:
 *               sampleId:
 *                 type: string
 *                 format: uuid
 *               grade:
 *                 type: number
 *               unit:
 *                 type: string
 *                 enum: [PERCENT, GRAMS_PER_TON, PPM, OUNCES_PER_TON]
 *               notes:
 *                 type: string
 *               certified:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Report created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions
 *       409:
 *         description: Report already exists for this sample
 */
router.post('/', authenticate, authorize('ADMIN', 'ANALYST', 'SUPERVISOR'), reportController.createReport);

/**
 * @swagger
 * /api/v1/reports:
 *   get:
 *     summary: Search reports with pagination
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: mineral
 *         schema:
 *           type: string
 *           enum: [CU, CO, LI, AU, SN, TA, W, ZN, PB, NI]
 *       - in: query
 *         name: site
 *         schema:
 *           type: string
 *       - in: query
 *         name: certified
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *     responses:
 *       200:
 *         description: Reports retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get('/', authenticate, reportController.searchReports);

/**
 * @swagger
 * /api/v1/reports/stats:
 *   get:
 *     summary: Get report statistics
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Report statistics retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get('/stats', authenticate, reportController.getReportStats);

/**
 * @swagger
 * /api/v1/reports/{id}:
 *   get:
 *     summary: Get report by ID
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Report retrieved successfully
 *       404:
 *         description: Report not found
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 */
router.get('/:id', authenticate, reportController.getReportById);

/**
 * @swagger
 * /api/v1/reports/{id}/certification:
 *   patch:
 *     summary: Update report certification status
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - certified
 *             properties:
 *               certified:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Report certification updated successfully
 *       404:
 *         description: Report not found
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions
 */
router.patch('/:id/certification', authenticate, authorize('ADMIN', 'SUPERVISOR'), reportController.updateCertification);

/**
 * @swagger
 * /api/v1/reports/code/{reportCode}:
 *   get:
 *     summary: Get report by code
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reportCode
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^RPT-[A-Z]{2,3}-\d{4,6}$'
 *     responses:
 *       200:
 *         description: Report retrieved successfully
 *       404:
 *         description: Report not found
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 */
router.get('/code/:reportCode', authenticate, reportController.getReportByCode);

/**
 * @swagger
 * /api/v1/reports/verify/{reportCode}:
 *   get:
 *     summary: Verify report authenticity (public endpoint)
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: reportCode
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^RPT-[A-Z]{2,3}-\d{4,6}$'
 *       - in: query
 *         name: hash
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report verification result
 *       404:
 *         description: Report not found
 */
router.get('/verify/:reportCode', optionalAuth, reportController.verifyReport);

export default router;
