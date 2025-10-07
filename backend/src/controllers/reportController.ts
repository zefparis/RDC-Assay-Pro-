import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiResponse, CreateReportRequest, ReportSearchQuery } from '@/types';
import { ReportService } from '@/services/reportService';
import { asyncHandler } from '@/middleware/errorHandler';
import { validateRequest, validateQuery } from '@/utils/validation';
import { 
  createReportSchema, 
  reportSearchSchema, 
  idParamSchema, 
  reportCodeParamSchema 
} from '@/utils/schemas';

const reportService = new ReportService();

export const reportController = {
  // Create new report
  createReport: asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const validatedData = validateRequest(createReportSchema, req.body);
    const issuedBy = req.user!.id;

    const report = await reportService.createReport(validatedData as CreateReportRequest, issuedBy);

    const response: ApiResponse = {
      success: true,
      message: 'Report created successfully',
      data: { report },
    };

    res.status(201).json(response);
  }),

  // Get report by ID
  getReportById: asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = validateRequest(idParamSchema, req.params);
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const report = await reportService.getReportById(id, userId, userRole);

    const response: ApiResponse = {
      success: true,
      data: { report },
    };

    res.status(200).json(response);
  }),

  // Get report by code
  getReportByCode: asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { reportCode } = validateRequest(reportCodeParamSchema, req.params);
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const report = await reportService.getReportByCode(reportCode, userId, userRole);

    const response: ApiResponse = {
      success: true,
      data: { report },
    };

    res.status(200).json(response);
  }),

  // Search reports
  searchReports: asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const validatedQuery = validateQuery(reportSearchSchema, req.query);
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const result = await reportService.searchReports(validatedQuery as ReportSearchQuery, userId, userRole);

    res.status(200).json(result);
  }),

  // Verify report (public endpoint)
  verifyReport: asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { reportCode } = validateRequest(reportCodeParamSchema, req.params);
    const { hash } = req.query;

    const result = await reportService.verifyReport(reportCode, hash as string);

    const response: ApiResponse = {
      success: result.valid,
      message: result.message,
      data: result.report ? { report: result.report } : undefined,
    };

    res.status(200).json(response);
  }),

  // Update report certification
  updateCertification: asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = validateRequest(idParamSchema, req.params);
    const { certified } = req.body;
    const userId = req.user!.id;

    if (typeof certified !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Certified field must be a boolean value',
      });
    }

    const report = await reportService.updateCertification(id, certified, userId);

    const response: ApiResponse = {
      success: true,
      message: `Report ${certified ? 'certified' : 'uncertified'} successfully`,
      data: { report },
    };

    res.status(200).json(response);
  }),

  // Get report statistics
  getReportStats: asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const stats = await reportService.getReportStats(userId, userRole);

    const response: ApiResponse = {
      success: true,
      data: { stats },
    };

    res.status(200).json(response);
  }),
};
