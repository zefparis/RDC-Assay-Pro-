import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiResponse, CreateSampleRequest, UpdateSampleRequest, SampleSearchQuery } from '@/types';
import { SampleService } from '@/services/sampleService';
import { asyncHandler } from '@/middleware/errorHandler';
import { validateRequest, validateQuery } from '@/utils/validation';
import { 
  createSampleSchema, 
  updateSampleSchema, 
  sampleSearchSchema, 
  idParamSchema, 
  sampleCodeParamSchema,
  addTimelineEventSchema 
} from '@/utils/schemas';

const sampleService = new SampleService();

export const sampleController = {
  // Create new sample
  createSample: asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const validatedData = validateRequest(createSampleSchema, req.body);
    const clientId = req.user!.id;

    const sample = await sampleService.createSample(validatedData as CreateSampleRequest, clientId);

    const response: ApiResponse = {
      success: true,
      message: 'Sample created successfully',
      data: { sample },
    };

    res.status(201).json(response);
  }),

  // Get sample by ID
  getSampleById: asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = validateRequest(idParamSchema, req.params);
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const sample = await sampleService.getSampleById(id, userId, userRole);

    const response: ApiResponse = {
      success: true,
      data: { sample },
    };

    res.status(200).json(response);
  }),

  // Get sample by code
  getSampleByCode: asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { sampleCode } = validateRequest(sampleCodeParamSchema, req.params);
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const sample = await sampleService.getSampleByCode(sampleCode, userId, userRole);

    const response: ApiResponse = {
      success: true,
      data: { sample },
    };

    res.status(200).json(response);
  }),

  // Search samples
  searchSamples: asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const validatedQuery = validateQuery(sampleSearchSchema, req.query);
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const result = await sampleService.searchSamples(validatedQuery as SampleSearchQuery, userId, userRole);

    res.status(200).json(result);
  }),

  // Update sample
  updateSample: asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = validateRequest(idParamSchema, req.params);
    const validatedData = validateRequest(updateSampleSchema, req.body);
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const sample = await sampleService.updateSample(id, validatedData as UpdateSampleRequest, userId, userRole);

    const response: ApiResponse = {
      success: true,
      message: 'Sample updated successfully',
      data: { sample },
    };

    res.status(200).json(response);
  }),

  // Delete sample (cancel)
  deleteSample: asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = validateRequest(idParamSchema, req.params);
    const userId = req.user?.id;
    const userRole = req.user?.role;

    await sampleService.deleteSample(id, userId, userRole);

    const response: ApiResponse = {
      success: true,
      message: 'Sample cancelled successfully',
    };

    res.status(200).json(response);
  }),

  // Add timeline event
  addTimelineEvent: asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = validateRequest(idParamSchema, req.params);
    const validatedData = validateRequest(addTimelineEventSchema, req.body);
    const userId = req.user?.id;

    await sampleService.addTimelineEvent(id, validatedData.status, validatedData.notes, userId);

    const response: ApiResponse = {
      success: true,
      message: 'Timeline event added successfully',
    };

    res.status(200).json(response);
  }),

  // Get sample statistics
  getSampleStats: asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const stats = await sampleService.getSampleStats(userId, userRole);

    const response: ApiResponse = {
      success: true,
      data: { stats },
    };

    res.status(200).json(response);
  }),
};
