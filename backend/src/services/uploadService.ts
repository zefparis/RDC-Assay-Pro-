import path from 'path';
import { prisma } from '@/config/database';
import { AppError, FileUploadResult } from '@/types';
import { logger } from '@/utils/logger';
import { getFileUrl, deleteFile } from '@/middleware/upload';

export class UploadService {
  // Save file information to database
  async saveFileInfo(
    file: Express.Multer.File,
    sampleId: string,
    uploadedBy: string
  ): Promise<FileUploadResult> {
    // Verify sample exists and user has access
    const sample = await prisma.sample.findUnique({
      where: { id: sampleId },
      select: { id: true, clientId: true },
    });

    if (!sample) {
      // Delete uploaded file if sample doesn't exist
      deleteFile(file.path);
      throw new AppError('Sample not found', 404);
    }

    // Check if user is the owner or has admin privileges
    const user = await prisma.user.findUnique({
      where: { id: uploadedBy },
      select: { id: true, role: true },
    });

    if (!user) {
      deleteFile(file.path);
      throw new AppError('User not found', 404);
    }

    if (user.role !== 'ADMIN' && user.role !== 'SUPERVISOR' && sample.clientId !== uploadedBy) {
      deleteFile(file.path);
      throw new AppError('Access denied', 403);
    }

    try {
      // Save file info to database
      const sampleDocument = await prisma.sampleDocument.create({
        data: {
          sampleId,
          filename: file.filename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          path: file.path,
          uploadedBy,
        },
      });

      // Determine subdirectory based on file type
      let subDir = 'documents';
      if (file.mimetype.startsWith('image/')) {
        subDir = 'images';
      } else if (file.mimetype === 'application/pdf') {
        subDir = 'pdfs';
      }

      const fileUrl = getFileUrl(file.filename, subDir);

      logger.info('File uploaded successfully:', {
        fileId: sampleDocument.id,
        filename: file.filename,
        sampleId,
        uploadedBy,
      });

      return {
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: file.path,
        url: fileUrl,
      };
    } catch (error) {
      // Delete uploaded file if database save fails
      deleteFile(file.path);
      throw error;
    }
  }

  // Get file by ID
  async getFileById(fileId: string, userId?: string, userRole?: string): Promise<any> {
    const file = await prisma.sampleDocument.findUnique({
      where: { id: fileId },
      include: {
        sample: {
          select: {
            id: true,
            sampleCode: true,
            clientId: true,
          },
        },
      },
    });

    if (!file) {
      throw new AppError('File not found', 404);
    }

    // Check access permissions
    if (userId && userRole !== 'ADMIN' && userRole !== 'SUPERVISOR' && file.sample.clientId !== userId) {
      throw new AppError('Access denied', 403);
    }

    return file;
  }

  // Get files for a sample
  async getSampleFiles(sampleId: string, userId?: string, userRole?: string): Promise<any[]> {
    // Check if sample exists and user has access
    const sample = await prisma.sample.findUnique({
      where: { id: sampleId },
      select: { id: true, clientId: true },
    });

    if (!sample) {
      throw new AppError('Sample not found', 404);
    }

    if (userId && userRole !== 'ADMIN' && userRole !== 'SUPERVISOR' && sample.clientId !== userId) {
      throw new AppError('Access denied', 403);
    }

    const files = await prisma.sampleDocument.findMany({
      where: { sampleId },
      select: {
        id: true,
        filename: true,
        originalName: true,
        mimeType: true,
        size: true,
        uploadedAt: true,
      },
      orderBy: {
        uploadedAt: 'desc',
      },
    });

    return files.map(file => ({
      ...file,
      url: this.getFileUrlByType(file.filename, file.mimeType),
    }));
  }

  // Delete file
  async deleteFile(fileId: string, userId?: string, userRole?: string): Promise<void> {
    const file = await this.getFileById(fileId, userId, userRole);

    // Delete from database
    await prisma.sampleDocument.delete({
      where: { id: fileId },
    });

    // Delete physical file
    deleteFile(file.path);

    logger.info('File deleted successfully:', {
      fileId,
      filename: file.filename,
      deletedBy: userId,
    });
  }

  // Get file statistics
  async getFileStats(userId?: string, userRole?: string): Promise<any> {
    const where: any = {};

    // Access control
    if (userId && userRole !== 'ADMIN' && userRole !== 'SUPERVISOR') {
      where.sample = { clientId: userId };
    }

    const [
      totalFiles,
      totalSize,
      filesByType,
      recentFiles,
    ] = await Promise.all([
      prisma.sampleDocument.count({ where }),
      prisma.sampleDocument.aggregate({
        where,
        _sum: { size: true },
      }),
      prisma.sampleDocument.groupBy({
        by: ['mimeType'],
        where,
        _count: { mimeType: true },
      }),
      prisma.sampleDocument.count({
        where: {
          ...where,
          uploadedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
      }),
    ]);

    return {
      totalFiles,
      totalSize: totalSize._sum.size || 0,
      recentFiles,
      filesByType: filesByType.map(item => ({
        type: item.mimeType,
        count: item._count.mimeType,
      })),
    };
  }

  // Helper method to get file URL by type
  private getFileUrlByType(filename: string, mimeType: string): string {
    let subDir = 'documents';
    if (mimeType.startsWith('image/')) {
      subDir = 'images';
    } else if (mimeType === 'application/pdf') {
      subDir = 'pdfs';
    }
    return getFileUrl(filename, subDir);
  }
}
