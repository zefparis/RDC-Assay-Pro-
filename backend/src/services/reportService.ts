import { Report, Unit, MineralType, Prisma } from '@prisma/client';
import { prisma } from '@/config/database';
import { AppError, CreateReportRequest, ReportSearchQuery, PaginatedResponse } from '@/types';
import { logger } from '@/utils/logger';
import crypto from 'crypto';
import QRCode from 'qrcode';

export class ReportService {
  // Generate unique report code
  private async generateReportCode(sampleCode: string): Promise<string> {
    const prefix = 'RPT';
    return `${prefix}-${sampleCode}`;
  }

  // Generate secure hash for report
  private generateReportHash(reportData: any): string {
    const hashString = JSON.stringify({
      reportCode: reportData.reportCode,
      sampleId: reportData.sampleId,
      grade: reportData.grade,
      unit: reportData.unit,
      issuedAt: reportData.issuedAt,
    });
    
    return crypto.createHash('sha256').update(hashString).digest('hex').toUpperCase();
  }

  // Generate QR code for report verification
  private async generateQRCode(reportCode: string, hash: string): Promise<string> {
    const verificationUrl = `${process.env.FRONTEND_URL || 'https://rdcassay.africa'}/verify/${reportCode}?hash=${hash}`;
    return await QRCode.toDataURL(verificationUrl);
  }

  // Create new report
  async createReport(data: CreateReportRequest, issuedBy: string): Promise<Report> {
    // Check if sample exists and is ready for reporting
    const sample = await prisma.sample.findUnique({
      where: { id: data.sampleId },
      include: {
        report: true,
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
          },
        },
      },
    });

    if (!sample) {
      throw new AppError('Sample not found', 404);
    }

    if (sample.report) {
      throw new AppError('Report already exists for this sample', 409);
    }

    if (sample.status !== 'QA_QC' && sample.status !== 'ANALYZING') {
      throw new AppError('Sample is not ready for reporting', 400);
    }

    // Generate report code and hash
    const reportCode = await this.generateReportCode(sample.sampleCode);
    const reportData = {
      reportCode,
      sampleId: data.sampleId,
      grade: data.grade,
      unit: data.unit,
      issuedAt: new Date(),
    };
    const hash = this.generateReportHash(reportData);

    // Generate QR code
    const qrCode = await this.generateQRCode(reportCode, hash);

    // Create report
    const report = await prisma.report.create({
      data: {
        sampleId: data.sampleId,
        reportCode,
        grade: data.grade,
        unit: data.unit as Unit,
        certified: data.certified || false,
        hash,
        qrCode,
        notes: data.notes,
        issuedBy,
      },
      include: {
        sample: {
          include: {
            client: {
              select: {
                id: true,
                name: true,
                email: true,
                company: true,
              },
            },
          },
        },
        issuedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    // Update sample status and grade
    await prisma.sample.update({
      where: { id: data.sampleId },
      data: {
        status: 'REPORTED',
        grade: data.grade,
        completedAt: new Date(),
      },
    });

    // Add timeline event
    await prisma.timelineEvent.create({
      data: {
        sampleId: data.sampleId,
        status: 'REPORTED',
        notes: `Report ${reportCode} generated`,
        userId: issuedBy,
      },
    });

    logger.info('Report created successfully:', { 
      reportId: report.id, 
      reportCode: report.reportCode,
      sampleId: data.sampleId,
      issuedBy 
    });

    return report;
  }

  // Get report by ID
  async getReportById(id: string, userId?: string, userRole?: string): Promise<Report> {
    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        sample: {
          include: {
            client: {
              select: {
                id: true,
                name: true,
                email: true,
                company: true,
              },
            },
            timeline: {
              orderBy: {
                timestamp: 'asc',
              },
            },
          },
        },
        issuedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!report) {
      throw new AppError('Report not found', 404);
    }

    // Check access permissions
    if (userId && userRole !== 'ADMIN' && userRole !== 'SUPERVISOR' && report.sample.clientId !== userId) {
      throw new AppError('Access denied', 403);
    }

    return report;
  }

  // Get report by code
  async getReportByCode(reportCode: string, userId?: string, userRole?: string): Promise<Report> {
    const report = await prisma.report.findUnique({
      where: { reportCode },
      include: {
        sample: {
          include: {
            client: {
              select: {
                id: true,
                name: true,
                email: true,
                company: true,
              },
            },
            timeline: {
              orderBy: {
                timestamp: 'asc',
              },
            },
          },
        },
        issuedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!report) {
      throw new AppError('Report not found', 404);
    }

    // Check access permissions (allow public access for verification)
    if (userId && userRole !== 'ADMIN' && userRole !== 'SUPERVISOR' && report.sample.clientId !== userId) {
      // For public verification, only return limited data
      if (!userId) {
        return {
          ...report,
          sample: {
            ...report.sample,
            client: {
              id: '',
              name: 'Confidential',
              email: '',
              company: report.sample.client.company || 'Confidential',
            },
          },
        } as Report;
      }
      throw new AppError('Access denied', 403);
    }

    return report;
  }

  // Search reports with pagination
  async searchReports(query: ReportSearchQuery, userId?: string, userRole?: string): Promise<PaginatedResponse<Report>> {
    const {
      search,
      mineral,
      site,
      certified,
      dateFrom,
      dateTo,
      page = 1,
      limit = 10,
      sortBy = 'issuedAt',
      sortOrder = 'desc',
    } = query;

    // Build where clause
    const where: Prisma.ReportWhereInput = {};

    // Build conditions array for AND logic
    const conditions: Prisma.ReportWhereInput[] = [];

    // Access control
    if (userId && userRole !== 'ADMIN' && userRole !== 'SUPERVISOR') {
      conditions.push({
        sample: { clientId: userId }
      });
    }

    if (mineral) {
      conditions.push({
        sample: { mineral: mineral as MineralType }
      });
    }

    if (site) {
      conditions.push({
        sample: { site: { contains: site, mode: 'insensitive' } }
      });
    }

    if (search) {
      conditions.push({
        OR: [
          { reportCode: { contains: search, mode: 'insensitive' } },
          { sample: { sampleCode: { contains: search, mode: 'insensitive' } } },
          { sample: { site: { contains: search, mode: 'insensitive' } } },
          { sample: { client: { name: { contains: search, mode: 'insensitive' } } } },
          { sample: { client: { company: { contains: search, mode: 'insensitive' } } } },
        ]
      });
    }

    // Apply all conditions with AND logic
    if (conditions.length > 0) {
      where.AND = conditions;
    }

    if (certified !== undefined) {
      where.certified = certified;
    }

    if (dateFrom || dateTo) {
      where.issuedAt = {};
      if (dateFrom) where.issuedAt.gte = new Date(dateFrom);
      if (dateTo) where.issuedAt.lte = new Date(dateTo);
    }

    // Get total count
    const total = await prisma.report.count({ where });

    // Get paginated results
    const reports = await prisma.report.findMany({
      where,
      include: {
        sample: {
          include: {
            client: {
              select: {
                id: true,
                name: true,
                email: true,
                company: true,
              },
            },
          },
        },
        issuedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: reports,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  // Verify report authenticity
  async verifyReport(reportCode: string, providedHash?: string): Promise<{ valid: boolean; report?: Report; message: string }> {
    const report = await prisma.report.findUnique({
      where: { reportCode },
      include: {
        sample: {
          include: {
            client: {
              select: {
                id: true,
                name: true,
                email: true,
                company: true,
              },
            },
          },
        },
        issuedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!report) {
      return {
        valid: false,
        message: 'Report not found',
      };
    }

    // Verify hash if provided
    if (providedHash && providedHash.toUpperCase() !== report.hash) {
      return {
        valid: false,
        message: 'Report hash verification failed - document may have been tampered with',
      };
    }

    // Return limited data for public verification
    const publicReport = {
      ...report,
      sample: {
        ...report.sample,
        client: {
          id: '',
          name: 'Confidential',
          email: '',
          company: report.sample.client.company || 'Confidential',
        },
      },
    } as Report;

    return {
      valid: true,
      report: publicReport,
      message: 'Report is authentic and verified',
    };
  }

  // Update report certification status
  async updateCertification(id: string, certified: boolean, userId: string): Promise<Report> {
    const report = await prisma.report.findUnique({
      where: { id },
      select: { id: true, certified: true },
    });

    if (!report) {
      throw new AppError('Report not found', 404);
    }

    const updatedReport = await prisma.report.update({
      where: { id },
      data: { certified },
      include: {
        sample: {
          include: {
            client: {
              select: {
                id: true,
                name: true,
                email: true,
                company: true,
              },
            },
          },
        },
        issuedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    logger.info('Report certification updated:', { 
      reportId: id, 
      certified,
      updatedBy: userId 
    });

    return updatedReport;
  }

  // Get report statistics
  async getReportStats(userId?: string, userRole?: string): Promise<any> {
    const where: Prisma.ReportWhereInput = {};

    // Access control
    if (userId && userRole !== 'ADMIN' && userRole !== 'SUPERVISOR') {
      where.sample = { clientId: userId };
    }

    const [
      totalReports,
      certifiedReports,
      recentReports,
    ] = await Promise.all([
      prisma.report.count({ where }),
      prisma.report.count({ 
        where: { 
          ...where, 
          certified: true 
        } 
      }),
      prisma.report.count({
        where: {
          ...where,
          issuedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      }),
    ]);

    return {
      totalReports,
      certifiedReports,
      recentReports,
      certificationRate: totalReports > 0 ? Math.round((certifiedReports / totalReports) * 100) : 0,
    };
  }
}
