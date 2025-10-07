import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiResponse } from '@/types';
import { UploadService } from '@/services/uploadService';
import { asyncHandler } from '@/middleware/errorHandler';
import { validateRequest } from '@/utils/validation';
import { fileUploadSchema, idParamSchema } from '@/utils/schemas';
import path from 'path';
import fs from 'fs';

const uploadService = new UploadService();

export const uploadController = {
  // Upload file for sample
  uploadFile: asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const { sampleId } = validateRequest(fileUploadSchema, req.body);
    const uploadedBy = req.user!.id;

    const fileResult = await uploadService.saveFileInfo(req.file, sampleId, uploadedBy);

    const response: ApiResponse = {
      success: true,
      message: 'File uploaded successfully',
      data: { file: fileResult },
    };

    res.status(201).json(response);
  }),

  // Upload multiple files for sample
  uploadMultipleFiles: asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded',
      });
    }

    const { sampleId } = validateRequest(fileUploadSchema, req.body);
    const uploadedBy = req.user!.id;

    const fileResults = await Promise.all(
      files.map(file => uploadService.saveFileInfo(file, sampleId, uploadedBy))
    );

    const response: ApiResponse = {
      success: true,
      message: `${fileResults.length} files uploaded successfully`,
      data: { files: fileResults },
    };

    res.status(201).json(response);
  }),

  // Get file by ID
  getFileById: asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = validateRequest(idParamSchema, req.params);
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const file = await uploadService.getFileById(id, userId, userRole);

    const response: ApiResponse = {
      success: true,
      data: { file },
    };

    res.status(200).json(response);
  }),

  // Get files for a sample
  getSampleFiles: asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { sampleId } = validateRequest(idParamSchema, { id: req.params.sampleId });
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const files = await uploadService.getSampleFiles(sampleId, userId, userRole);

    const response: ApiResponse = {
      success: true,
      data: { files },
    };

    res.status(200).json(response);
  }),

  // Delete file
  deleteFile: asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = validateRequest(idParamSchema, req.params);
    const userId = req.user?.id;
    const userRole = req.user?.role;

    await uploadService.deleteFile(id, userId, userRole);

    const response: ApiResponse = {
      success: true,
      message: 'File deleted successfully',
    };

    res.status(200).json(response);
  }),

  // Serve uploaded files
  serveFile: asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { subDir, filename } = req.params;
    const filePath = path.join(process.cwd(), 'uploads', subDir, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
      });
    }

    // Set appropriate headers
    const stat = fs.statSync(filePath);
    const ext = path.extname(filename).toLowerCase();
    
    let contentType = 'application/octet-stream';
    if (ext === '.pdf') contentType = 'application/pdf';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.csv') contentType = 'text/csv';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year cache

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }),

  // Get file statistics
  getFileStats: asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const stats = await uploadService.getFileStats(userId, userRole);

    const response: ApiResponse = {
      success: true,
      data: { stats },
    };

    res.status(200).json(response);
  }),
};
