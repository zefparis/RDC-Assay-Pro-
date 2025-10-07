import { Router } from 'express';
import authRoutes from './authRoutes';
import sampleRoutes from './sampleRoutes';
import reportRoutes from './reportRoutes';
import dashboardRoutes from './dashboardRoutes';
import uploadRoutes from './uploadRoutes';
import userRoutes from './userRoutes';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/samples', sampleRoutes);
router.use('/reports', reportRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/upload', uploadRoutes);
router.use('/users', userRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'RDC Assay Pro API',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      auth: '/api/v1/auth',
      samples: '/api/v1/samples',
      reports: '/api/v1/reports',
      dashboard: '/api/v1/dashboard',
      upload: '/api/v1/upload',
      users: '/api/v1/users',
    },
  });
});

export default router;
