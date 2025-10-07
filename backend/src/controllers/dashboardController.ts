import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiResponse } from '@/types';
import { DashboardService } from '@/services/dashboardService';
import { asyncHandler } from '@/middleware/errorHandler';

const dashboardService = new DashboardService();

export const dashboardController = {
  // Get dashboard statistics
  getDashboardStats: asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const stats = await dashboardService.getDashboardStats(userId, userRole);

    const response: ApiResponse = {
      success: true,
      data: { stats },
    };

    res.status(200).json(response);
  }),

  // Get system statistics (admin only)
  getSystemStats: asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const stats = await dashboardService.getSystemStats();

    const response: ApiResponse = {
      success: true,
      data: { stats },
    };

    res.status(200).json(response);
  }),
};
