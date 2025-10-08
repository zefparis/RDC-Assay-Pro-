import { Sample, SampleStatus, MineralType, Unit, Prisma } from '@prisma/client';
import { prisma } from '@/config/database';
import { config } from '@/config/environment';
import { AppError, CreateSampleRequest, UpdateSampleRequest, SampleSearchQuery, PaginatedResponse } from '@/types';
import { logger } from '@/utils/logger';
import QRCode from 'qrcode';

export class SampleService {
  // Generate unique sample code
  private async generateSampleCode(): Promise<string> {
    const prefix = 'RC';
    const year = new Date().getFullYear().toString().slice(-2);
    
    // Get the last sample number for this year
    let lastSample: Sample | null = null;
    try {
      lastSample = await prisma.sample.findFirst({
        where: {
          sampleCode: {
            startsWith: `${prefix}-${year}`,
          },
        },
        orderBy: {
          sampleCode: 'desc',
        },
      });
    } catch (e: any) {
      // In demo mode or if DB not ready, continue with fallback counter starting at 0
      logger.warn('Failed to query last sample for code generation. Using fallback counter.', {
        error: e?.message || e,
      });
    }

    let nextNumber = 1;
    if (lastSample) {
      const lastNumber = parseInt(lastSample.sampleCode.split('-')[2] || '0');
      nextNumber = lastNumber + 1;
    }

    return `${prefix}-${year}${nextNumber.toString().padStart(4, '0')}`;
  }

  // Generate QR code for sample tracking
  private async generateSampleQRCode(sampleCode: string): Promise<string> {
    const trackUrl = `${process.env.FRONTEND_URL || 'https://rdcassay.africa'}/track/${sampleCode}`;
    return await QRCode.toDataURL(trackUrl);
  }

  // Create new sample
  async createSample(data: CreateSampleRequest, clientId: string): Promise<Sample> {
    const sampleCode = await this.generateSampleCode();

    try {
      const sample = await prisma.sample.create({
        data: {
          sampleCode,
          mineral: data.mineral as MineralType,
          site: data.site,
          unit: data.unit as Unit,
          mass: data.mass,
          notes: data.notes,
          priority: data.priority || 1,
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
          clientId,
        },
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
      });

      // Create initial timeline event
      await prisma.timelineEvent.create({
        data: {
          sampleId: sample.id,
          status: 'RECEIVED',
          notes: 'Sample received and logged into system',
        },
      });

      logger.info('Sample created successfully:', { 
        sampleId: sample.id, 
        sampleCode: sample.sampleCode,
        clientId 
      });

      return sample;
    } catch (e: any) {
      // Demo fallback: if DB write fails and demo mode is enabled, return an in-memory sample
      if (config.features?.demoLoginEnabled) {
        const now = new Date();
        const demoSample: Sample = {
          id: `demo-${Math.random().toString(36).slice(2)}`,
          sampleCode,
          mineral: data.mineral as MineralType,
          site: data.site,
          status: 'RECEIVED' as SampleStatus,
          grade: null,
          unit: data.unit as Unit,
          mass: data.mass,
          notes: (data.notes as any) ?? null,
          clientId,
          analystId: null,
          priority: data.priority || 1,
          receivedAt: now,
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
          completedAt: null,
          createdAt: now,
          updatedAt: now,
        } as unknown as Sample;

        logger.warn('DEMO SAMPLE FALLBACK USED (no DB write). Ensure migrations/seed are applied in production.', {
          error: e?.message || e,
        });

        return demoSample;
      }

      throw e;
    }
  }

  // Get sample by ID
  async getSampleById(id: string, userId?: string, userRole?: string): Promise<Sample> {
    const sample = await prisma.sample.findUnique({
      where: { id },
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
        documents: {
          select: {
            id: true,
            filename: true,
            originalName: true,
            mimeType: true,
            size: true,
            uploadedAt: true,
          },
        },
        report: {
          select: {
            id: true,
            reportCode: true,
            grade: true,
            unit: true,
            certified: true,
            issuedAt: true,
          },
        },
      },
    });

    if (!sample) {
      throw new AppError('Sample not found', 404);
    }

    // Check access permissions
    if (userId && userRole !== 'ADMIN' && userRole !== 'SUPERVISOR' && sample.clientId !== userId) {
      throw new AppError('Access denied', 403);
    }

    return sample;
  }

  // Get sample by code
  async getSampleByCode(sampleCode: string, userId?: string, userRole?: string): Promise<Sample> {
    try {
      const sample = await prisma.sample.findUnique({
        where: { sampleCode },
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
          documents: {
            select: {
              id: true,
              filename: true,
              originalName: true,
              mimeType: true,
              size: true,
              uploadedAt: true,
            },
          },
          report: {
            select: {
              id: true,
              reportCode: true,
              grade: true,
              unit: true,
              certified: true,
              issuedAt: true,
            },
          },
        },
      });

      if (!sample) {
        throw new AppError('Sample not found', 404);
      }

      // Check access permissions
      if (userId && userRole !== 'ADMIN' && userRole !== 'SUPERVISOR' && sample.clientId !== userId) {
        throw new AppError('Access denied', 403);
      }

      // Attach QR code only if report exists or status is REPORTED
      if ((sample as any).report || sample.status === 'REPORTED') {
        try {
          const qr = await this.generateSampleQRCode(sample.sampleCode);
          (sample as any).qrCode = qr;
        } catch (e: any) {
          logger.warn('Failed to generate QR code for sample', { error: e?.message || e });
        }
      }

      return sample as any;
    } catch (e: any) {
      if (config.features?.demoLoginEnabled) {
        // Demo fallback: synthesize a sample with minimal fields and a QR code
        const now = new Date();
        const demoSample: any = {
          id: `demo-${sampleCode}`,
          sampleCode,
          mineral: 'CU',
          site: 'Kolwezi',
          status: 'RECEIVED',
          grade: null,
          unit: 'PERCENT',
          mass: 5,
          notes: null,
          clientId: userId || 'demo-client',
          analystId: null,
          priority: 1,
          receivedAt: now,
          dueDate: null,
          completedAt: null,
          createdAt: now,
          updatedAt: now,
          client: {
            id: userId || 'demo-client',
            name: 'Demo Client',
            email: 'demo@example.com',
            company: 'GeoCert Africa — Filiale de SGS',
          },
          timeline: [
            { id: `tl-${sampleCode}-1`, sampleId: `demo-${sampleCode}`, status: 'RECEIVED', notes: 'Sample created (demo)', userId: null, timestamp: now },
          ],
          documents: [],
          report: null,
        };

        // In demo, do NOT generate QR unless reported
        if (demoSample.status === 'REPORTED') {
          try {
            (demoSample as any).qrCode = await this.generateSampleQRCode(sampleCode);
          } catch (e2: any) {
            logger.warn('Failed to generate demo QR code for sample', { error: e2?.message || e2 });
          }
        }

        logger.warn('DEMO SAMPLE BY CODE FALLBACK USED (no DB). Returning synthetic sample.', {
          error: e?.message || e,
        });
        return demoSample as Sample;
      }
      throw e;
    }
  }

  // Search samples with pagination
  async searchSamples(query: SampleSearchQuery, userId?: string, userRole?: string): Promise<PaginatedResponse<Sample>> {
    const {
      search,
      mineral,
      site,
      status,
      clientId,
      analystId,
      priority,
      dateFrom,
      dateTo,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    // Build where clause
    const where: Prisma.SampleWhereInput = {};

    // Access control
    if (userId && userRole !== 'ADMIN' && userRole !== 'SUPERVISOR') {
      where.clientId = userId;
    } else if (clientId) {
      where.clientId = clientId;
    }

    if (search) {
      where.OR = [
        { sampleCode: { contains: search, mode: 'insensitive' } },
        { site: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
        { client: { name: { contains: search, mode: 'insensitive' } } },
        { client: { company: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (mineral) where.mineral = mineral as MineralType;
    if (site) where.site = { contains: site, mode: 'insensitive' };
    if (status) where.status = status as SampleStatus;
    if (analystId) where.analystId = analystId;
    if (priority) where.priority = priority;

    if (dateFrom || dateTo) {
      where.receivedAt = {};
      if (dateFrom) where.receivedAt.gte = new Date(dateFrom);
      if (dateTo) where.receivedAt.lte = new Date(dateTo);
    }

    try {
      // Get total count
      const total = await prisma.sample.count({ where });

      // Get paginated results
      const samples = await prisma.sample.findMany({
        where,
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
              timestamp: 'desc',
            },
            take: 1,
          },
          report: {
            select: {
              id: true,
              reportCode: true,
              certified: true,
              issuedAt: true,
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
        data: samples,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } catch (e: any) {
      if (config.features?.demoLoginEnabled) {
        logger.warn('DEMO SAMPLES SEARCH FALLBACK USED (no DB).', {
          error: e?.message || e,
        });
        // If a search term is provided, return a synthetic sample so tracker can work in demo mode
        const demoList: any[] = [];
        if (search && typeof search === 'string') {
          const code = search.toUpperCase();
          demoList.push({
            id: `demo-${code}`,
            sampleCode: code,
            mineral: 'CU',
            site: 'Kolwezi',
            status: 'RECEIVED',
            grade: null,
            unit: 'PERCENT',
            mass: 5,
            notes: null,
            client: { id: 'demo-client', name: 'Demo Client', email: 'demo@example.com', company: 'GeoCert Africa — Filiale de SGS' },
            timeline: [],
            report: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            receivedAt: new Date(),
          });
        }
        return {
          success: true,
          data: demoList,
          pagination: {
            page,
            limit,
            total: demoList.length,
            totalPages: demoList.length > 0 ? 1 : 0,
            hasNext: false,
            hasPrev: false,
          },
        } as any;
      }
      throw e;
    }
  }

  // Update sample
  async updateSample(id: string, data: UpdateSampleRequest, userId?: string, userRole?: string): Promise<Sample> {
    // Check if sample exists and user has permission
    const existingSample = await this.getSampleById(id, userId, userRole);

    // Prepare update data
    const updateData: Prisma.SampleUpdateInput = {};

    if (data.mineral) updateData.mineral = data.mineral as MineralType;
    if (data.site) updateData.site = data.site;
    if (data.unit) updateData.unit = data.unit as Unit;
    if (data.mass !== undefined) updateData.mass = data.mass;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.grade !== undefined) updateData.grade = data.grade;
    if (data.dueDate) updateData.dueDate = new Date(data.dueDate);
    if (data.analystId) updateData.analystId = data.analystId;

    // Handle status change
    if (data.status && data.status !== existingSample.status) {
      updateData.status = data.status as SampleStatus;
      
      // Update completion date if status is REPORTED
      if (data.status === 'REPORTED') {
        updateData.completedAt = new Date();
      }

      // Create timeline event for status change
      await prisma.timelineEvent.create({
        data: {
          sampleId: id,
          status: data.status as SampleStatus,
          notes: `Status changed to ${data.status}`,
          userId,
        },
      });
    }

    const updatedSample = await prisma.sample.update({
      where: { id },
      data: updateData,
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
        documents: {
          select: {
            id: true,
            filename: true,
            originalName: true,
            mimeType: true,
            size: true,
            uploadedAt: true,
          },
        },
        report: {
          select: {
            id: true,
            reportCode: true,
            grade: true,
            unit: true,
            certified: true,
            issuedAt: true,
          },
        },
      },
    });

    logger.info('Sample updated successfully:', { 
      sampleId: id, 
      updatedBy: userId,
      changes: Object.keys(data)
    });

    return updatedSample;
  }

  // Delete sample (soft delete by setting status to CANCELLED)
  async deleteSample(id: string, userId?: string, userRole?: string): Promise<void> {
    // Check if sample exists and user has permission
    await this.getSampleById(id, userId, userRole);

    // Only allow deletion if sample is not yet analyzed
    const sample = await prisma.sample.findUnique({
      where: { id },
      select: { status: true },
    });

    if (sample?.status === 'ANALYZING' || sample?.status === 'QA_QC' || sample?.status === 'REPORTED') {
      throw new AppError('Cannot delete sample that is being analyzed or has been reported', 400);
    }

    await prisma.sample.update({
      where: { id },
      data: { 
        status: 'CANCELLED',
        updatedAt: new Date(),
      },
    });

    // Create timeline event
    await prisma.timelineEvent.create({
      data: {
        sampleId: id,
        status: 'CANCELLED',
        notes: 'Sample cancelled',
        userId,
      },
    });

    logger.info('Sample cancelled:', { sampleId: id, cancelledBy: userId });
  }

  // Add timeline event
  async addTimelineEvent(sampleId: string, status: SampleStatus, notes?: string, userId?: string): Promise<void> {
    // Check if sample exists
    const sample = await prisma.sample.findUnique({
      where: { id: sampleId },
      select: { id: true, status: true },
    });

    if (!sample) {
      throw new AppError('Sample not found', 404);
    }

    // Create timeline event
    await prisma.timelineEvent.create({
      data: {
        sampleId,
        status,
        notes,
        userId,
      },
    });

    // Update sample status if different
    if (sample.status !== status) {
      const updateData: Prisma.SampleUpdateInput = { status };
      
      if (status === 'REPORTED') {
        updateData.completedAt = new Date();
      }

      await prisma.sample.update({
        where: { id: sampleId },
        data: updateData,
      });
    }

    logger.info('Timeline event added:', { sampleId, status, userId });
  }

  // Get sample statistics
  async getSampleStats(userId?: string, userRole?: string): Promise<any> {
    const where: Prisma.SampleWhereInput = {};

    // Access control
    if (userId && userRole !== 'ADMIN' && userRole !== 'SUPERVISOR') {
      where.clientId = userId;
    }

    const [
      totalSamples,
      activeSamples,
      analyzingSamples,
      completedSamples,
      samplesByStatus,
      samplesByMineral,
    ] = await Promise.all([
      prisma.sample.count({ where }),
      prisma.sample.count({ 
        where: { 
          ...where, 
          status: { not: 'REPORTED' } 
        } 
      }),
      prisma.sample.count({ 
        where: { 
          ...where, 
          status: 'ANALYZING' 
        } 
      }),
      prisma.sample.count({ 
        where: { 
          ...where, 
          status: 'REPORTED' 
        } 
      }),
      prisma.sample.groupBy({
        by: ['status'],
        where,
        _count: {
          status: true,
        },
      }),
      prisma.sample.groupBy({
        by: ['mineral'],
        where,
        _count: {
          mineral: true,
        },
      }),
    ]);

    return {
      totalSamples,
      activeSamples,
      analyzingSamples,
      completedSamples,
      samplesByStatus: samplesByStatus.map(item => ({
        status: item.status,
        count: item._count.status,
        percentage: totalSamples > 0 ? Math.round((item._count.status / totalSamples) * 100) : 0,
      })),
      samplesByMineral: samplesByMineral.map(item => ({
        mineral: item.mineral,
        count: item._count.mineral,
        percentage: totalSamples > 0 ? Math.round((item._count.mineral / totalSamples) * 100) : 0,
      })),
    };
  }
}
