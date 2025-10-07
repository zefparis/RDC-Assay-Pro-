import { Router } from 'express';
import { sampleController } from '@/controllers/sampleController';
import { authenticate, authorize } from '@/middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/v1/samples:
 *   post:
 *     summary: Create a new sample
 *     tags: [Samples]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mineral
 *               - site
 *               - unit
 *               - mass
 *             properties:
 *               mineral:
 *                 type: string
 *                 enum: [CU, CO, LI, AU, SN, TA, W, ZN, PB, NI]
 *               site:
 *                 type: string
 *               unit:
 *                 type: string
 *                 enum: [PERCENT, GRAMS_PER_TON, PPM, OUNCES_PER_TON]
 *               mass:
 *                 type: number
 *               notes:
 *                 type: string
 *               priority:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 3
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Sample created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 */
router.post('/', authenticate, sampleController.createSample);

/**
 * @swagger
 * /api/v1/samples:
 *   get:
 *     summary: Search samples with pagination
 *     tags: [Samples]
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [RECEIVED, PREP, ANALYZING, QA_QC, REPORTED, CANCELLED]
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
 *         description: Samples retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get('/', authenticate, sampleController.searchSamples);

/**
 * @swagger
 * /api/v1/samples/stats:
 *   get:
 *     summary: Get sample statistics
 *     tags: [Samples]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sample statistics retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get('/stats', authenticate, sampleController.getSampleStats);

/**
 * @swagger
 * /api/v1/samples/{id}:
 *   get:
 *     summary: Get sample by ID
 *     tags: [Samples]
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
 *         description: Sample retrieved successfully
 *       404:
 *         description: Sample not found
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 */
router.get('/:id', authenticate, sampleController.getSampleById);

/**
 * @swagger
 * /api/v1/samples/{id}:
 *   put:
 *     summary: Update sample
 *     tags: [Samples]
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
 *             properties:
 *               mineral:
 *                 type: string
 *                 enum: [CU, CO, LI, AU, SN, TA, W, ZN, PB, NI]
 *               site:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [RECEIVED, PREP, ANALYZING, QA_QC, REPORTED, CANCELLED]
 *               grade:
 *                 type: number
 *               unit:
 *                 type: string
 *                 enum: [PERCENT, GRAMS_PER_TON, PPM, OUNCES_PER_TON]
 *               mass:
 *                 type: number
 *               notes:
 *                 type: string
 *               priority:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 3
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               analystId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Sample updated successfully
 *       404:
 *         description: Sample not found
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 */
router.put('/:id', authenticate, sampleController.updateSample);

/**
 * @swagger
 * /api/v1/samples/{id}:
 *   delete:
 *     summary: Cancel sample
 *     tags: [Samples]
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
 *         description: Sample cancelled successfully
 *       404:
 *         description: Sample not found
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 */
router.delete('/:id', authenticate, sampleController.deleteSample);

/**
 * @swagger
 * /api/v1/samples/code/{sampleCode}:
 *   get:
 *     summary: Get sample by code
 *     tags: [Samples]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sampleCode
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[A-Z]{2,3}-\d{4,6}$'
 *     responses:
 *       200:
 *         description: Sample retrieved successfully
 *       404:
 *         description: Sample not found
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 */
router.get('/code/:sampleCode', authenticate, sampleController.getSampleByCode);

/**
 * @swagger
 * /api/v1/samples/{id}/timeline:
 *   post:
 *     summary: Add timeline event to sample
 *     tags: [Samples]
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [RECEIVED, PREP, ANALYZING, QA_QC, REPORTED, CANCELLED]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Timeline event added successfully
 *       404:
 *         description: Sample not found
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions
 */
router.post('/:id/timeline', authenticate, authorize('ADMIN', 'ANALYST', 'SUPERVISOR'), sampleController.addTimelineEvent);

export default router;
