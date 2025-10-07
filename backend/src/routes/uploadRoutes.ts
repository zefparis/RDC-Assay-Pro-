import { Router } from 'express';
import { uploadController } from '@/controllers/uploadController';
import { authenticate, authorize } from '@/middleware/auth';
import { uploadSingle, uploadMultiple, handleUploadError } from '@/middleware/upload';
import { uploadRateLimit } from '@/middleware/rateLimiter';

const router = Router();

/**
 * @swagger
 * /api/v1/upload/single:
 *   post:
 *     summary: Upload a single file for a sample
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - sampleId
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               sampleId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *       400:
 *         description: No file uploaded or validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       413:
 *         description: File too large
 */
router.post('/single', 
  authenticate, 
  uploadRateLimit,
  uploadSingle('file'), 
  handleUploadError, 
  uploadController.uploadFile
);

/**
 * @swagger
 * /api/v1/upload/multiple:
 *   post:
 *     summary: Upload multiple files for a sample
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - files
 *               - sampleId
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               sampleId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Files uploaded successfully
 *       400:
 *         description: No files uploaded or validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       413:
 *         description: Files too large
 */
router.post('/multiple', 
  authenticate, 
  uploadRateLimit,
  uploadMultiple('files', 5), 
  handleUploadError, 
  uploadController.uploadMultipleFiles
);

/**
 * @swagger
 * /api/v1/upload/files/{id}:
 *   get:
 *     summary: Get file information by ID
 *     tags: [Upload]
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
 *         description: File information retrieved successfully
 *       404:
 *         description: File not found
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 */
router.get('/files/:id', authenticate, uploadController.getFileById);

/**
 * @swagger
 * /api/v1/upload/files/{id}:
 *   delete:
 *     summary: Delete file
 *     tags: [Upload]
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
 *         description: File deleted successfully
 *       404:
 *         description: File not found
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 */
router.delete('/files/:id', authenticate, uploadController.deleteFile);

/**
 * @swagger
 * /api/v1/upload/samples/{sampleId}/files:
 *   get:
 *     summary: Get all files for a sample
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sampleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Sample files retrieved successfully
 *       404:
 *         description: Sample not found
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 */
router.get('/samples/:sampleId/files', authenticate, uploadController.getSampleFiles);

/**
 * @swagger
 * /api/v1/upload/stats:
 *   get:
 *     summary: Get file upload statistics
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: File statistics retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get('/stats', authenticate, uploadController.getFileStats);

/**
 * @swagger
 * /api/v1/upload/files/{subDir}/{filename}:
 *   get:
 *     summary: Serve uploaded file (public endpoint)
 *     tags: [Upload]
 *     parameters:
 *       - in: path
 *         name: subDir
 *         required: true
 *         schema:
 *           type: string
 *           enum: [images, pdfs, documents]
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File served successfully
 *       404:
 *         description: File not found
 */
router.get('/files/:subDir/:filename', uploadController.serveFile);

export default router;
