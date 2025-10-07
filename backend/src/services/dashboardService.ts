import { Prisma } from '@prisma/client';
import { prisma } from '@/config/database';
import { DashboardStats, ActivitySummary, StatusCount, MineralCount, MonthlyTrend } from '@/types';
import { logger } from '@/utils/logger';

export class DashboardService {
  // Get comprehensive dashboard statistics
  async getDashboardStats(userId?: string, userRole?: string): Promise<DashboardStats> {
    const where: Prisma.SampleWhereInput = {};

    // Access control
    if (userId && userRole !== 'ADMIN' && userRole !== 'SUPERVISOR') {
      where.clientId = userId;
    }

    const [
      totalSamples,
      activeSamples,
      analyzingSamples,
      completedReports,
      samplesByStatus,
      samplesByMineral,
      recentActivities,
      monthlyTrends,
      avgProcessingTime,
    ] = await Promise.all([
      this.getTotalSamples(where),
      this.getActiveSamples(where),
      this.getAnalyzingSamples(where),
      this.getCompletedReports(where),
      this.getSamplesByStatus(where),
      this.getSamplesByMineral(where),
      this.getRecentActivities(userId, userRole),
      this.getMonthlyTrends(where),
      this.getAverageProcessingTime(where),
    ]);

    // Calculate monthly growth
    const monthlyGrowth = this.calculateMonthlyGrowth(monthlyTrends);

    return {
      totalSamples,
      activeSamples,
      analyzingSamples,
      completedReports,
      averageProcessingTime: avgProcessingTime,
      monthlyGrowth,
      recentActivities,
      samplesByStatus,
      samplesByMineral,
      monthlyTrends,
    };
  }

  // Get total samples count
  private async getTotalSamples(where: Prisma.SampleWhereInput): Promise<number> {
    return await prisma.sample.count({ where });
  }

  // Get active samples (not completed)
  private async getActiveSamples(where: Prisma.SampleWhereInput): Promise<number> {
    return await prisma.sample.count({
      where: {
        ...where,
        status: { not: 'REPORTED' },
      },
    });
  }

  // Get samples currently being analyzed
  private async getAnalyzingSamples(where: Prisma.SampleWhereInput): Promise<number> {
    return await prisma.sample.count({
      where: {
        ...where,
        status: 'ANALYZING',
      },
    });
  }

  // Get completed reports count
  private async getCompletedReports(where: Prisma.SampleWhereInput): Promise<number> {
    return await prisma.sample.count({
      where: {
        ...where,
        status: 'REPORTED',
      },
    });
  }

  // Get samples grouped by status
  private async getSamplesByStatus(where: Prisma.SampleWhereInput): Promise<StatusCount[]> {
    const statusCounts = await prisma.sample.groupBy({
      by: ['status'],
      where,
      _count: {
        status: true,
      },
    });

    const total = statusCounts.reduce((sum, item) => sum + item._count.status, 0);

    return statusCounts.map(item => ({
      status: item.status,
      count: item._count.status,
      percentage: total > 0 ? Math.round((item._count.status / total) * 100) : 0,
    }));
  }

  // Get samples grouped by mineral type
  private async getSamplesByMineral(where: Prisma.SampleWhereInput): Promise<MineralCount[]> {
    const mineralCounts = await prisma.sample.groupBy({
      by: ['mineral'],
      where,
      _count: {
        mineral: true,
      },
    });

    const total = mineralCounts.reduce((sum, item) => sum + item._count.mineral, 0);

    return mineralCounts.map(item => ({
      mineral: item.mineral,
      count: item._count.mineral,
      percentage: total > 0 ? Math.round((item._count.mineral / total) * 100) : 0,
    }));
  }

  // Get recent activities
  private async getRecentActivities(userId?: string, userRole?: string): Promise<ActivitySummary[]> {
    const where: Prisma.ActivityWhereInput = {};

    // Access control for activities
    if (userId && userRole !== 'ADMIN' && userRole !== 'SUPERVISOR') {
      // For non-admin users, only show their own activities
      where.userId = userId;
    }

    const activities = await prisma.activity.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: 10,
    });

    return activities.map(activity => ({
      id: activity.id,
      action: activity.action,
      entity: activity.entity,
      entityId: activity.entityId,
      timestamp: activity.timestamp.toISOString(),
      user: {
        name: activity.user.name,
        email: activity.user.email,
      },
    }));
  }

  // Get monthly trends for the last 12 months
  private async getMonthlyTrends(where: Prisma.SampleWhereInput): Promise<MonthlyTrend[]> {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    // Get samples created each month
    const sampleTrends = await prisma.$queryRaw<Array<{ month: string; count: bigint }>>`
      SELECT 
        TO_CHAR(DATE_TRUNC('month', "receivedAt"), 'YYYY-MM') as month,
        COUNT(*) as count
      FROM "samples"
      WHERE "receivedAt" >= ${twelveMonthsAgo}
      ${where.clientId ? Prisma.sql`AND "clientId" = ${where.clientId}` : Prisma.empty}
      GROUP BY DATE_TRUNC('month', "receivedAt")
      ORDER BY month
    `;

    // Get reports issued each month
    const reportTrends = await prisma.$queryRaw<Array<{ month: string; count: bigint }>>`
      SELECT 
        TO_CHAR(DATE_TRUNC('month', r."issuedAt"), 'YYYY-MM') as month,
        COUNT(*) as count
      FROM "reports" r
      JOIN "samples" s ON r."sampleId" = s.id
      WHERE r."issuedAt" >= ${twelveMonthsAgo}
      ${where.clientId ? Prisma.sql`AND s."clientId" = ${where.clientId}` : Prisma.empty}
      GROUP BY DATE_TRUNC('month', r."issuedAt")
      ORDER BY month
    `;

    // Combine trends
    const trends: MonthlyTrend[] = [];
    const sampleMap = new Map(sampleTrends.map(t => [t.month, Number(t.count)]));
    const reportMap = new Map(reportTrends.map(t => [t.month, Number(t.count)]));

    // Generate all months in the last 12 months
    for (let i = 0; i < 12; i++) {
      const date = new Date(twelveMonthsAgo);
      date.setMonth(date.getMonth() + i);
      const monthKey = date.toISOString().slice(0, 7);
      
      trends.push({
        month: monthKey,
        samples: sampleMap.get(monthKey) || 0,
        reports: reportMap.get(monthKey) || 0,
      });
    }

    return trends;
  }

  // Calculate average processing time
  private async getAverageProcessingTime(where: Prisma.SampleWhereInput): Promise<string> {
    const completedSamples = await prisma.sample.findMany({
      where: {
        ...where,
        status: 'REPORTED',
        completedAt: { not: null },
      },
      select: {
        receivedAt: true,
        completedAt: true,
      },
    });

    if (completedSamples.length === 0) {
      return '0h';
    }

    const totalHours = completedSamples.reduce((sum, sample) => {
      if (sample.completedAt) {
        const diffMs = sample.completedAt.getTime() - sample.receivedAt.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);
        return sum + diffHours;
      }
      return sum;
    }, 0);

    const avgHours = Math.round(totalHours / completedSamples.length);

    if (avgHours < 24) {
      return `${avgHours}h`;
    } else {
      const days = Math.round(avgHours / 24);
      return `${days}d`;
    }
  }

  // Calculate monthly growth percentage
  private calculateMonthlyGrowth(trends: MonthlyTrend[]): number {
    if (trends.length < 2) return 0;

    const currentMonth = trends[trends.length - 1];
    const previousMonth = trends[trends.length - 2];

    if (previousMonth.samples === 0) {
      return currentMonth.samples > 0 ? 100 : 0;
    }

    const growth = ((currentMonth.samples - previousMonth.samples) / previousMonth.samples) * 100;
    return Math.round(growth * 10) / 10; // Round to 1 decimal place
  }

  // Get system-wide statistics (admin only)
  async getSystemStats(): Promise<any> {
    const [
      totalUsers,
      activeUsers,
      totalSamples,
      totalReports,
      usersByRole,
      systemHealth,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.sample.count(),
      prisma.report.count(),
      this.getUsersByRole(),
      this.getSystemHealth(),
    ]);

    return {
      totalUsers,
      activeUsers,
      totalSamples,
      totalReports,
      usersByRole,
      systemHealth,
    };
  }

  // Get users grouped by role
  private async getUsersByRole(): Promise<Array<{ role: string; count: number }>> {
    const roleCounts = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        role: true,
      },
    });

    return roleCounts.map(item => ({
      role: item.role,
      count: item._count.role,
    }));
  }

  // Get basic system health metrics
  private async getSystemHealth(): Promise<any> {
    const [
      dbConnected,
      pendingSamples,
      overdueSamples,
      recentErrors,
    ] = await Promise.all([
      this.checkDatabaseHealth(),
      this.getPendingSamples(),
      this.getOverdueSamples(),
      this.getRecentErrors(),
    ]);

    return {
      database: dbConnected ? 'healthy' : 'error',
      pendingSamples,
      overdueSamples,
      recentErrors,
      status: dbConnected && overdueSamples < 10 && recentErrors < 5 ? 'healthy' : 'warning',
    };
  }

  // Check database connectivity
  private async checkDatabaseHealth(): Promise<boolean> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      logger.error('Database health check failed:', error);
      return false;
    }
  }

  // Get count of samples pending analysis
  private async getPendingSamples(): Promise<number> {
    return await prisma.sample.count({
      where: {
        status: { in: ['RECEIVED', 'PREP'] },
      },
    });
  }

  // Get count of overdue samples
  private async getOverdueSamples(): Promise<number> {
    const now = new Date();
    return await prisma.sample.count({
      where: {
        dueDate: { lt: now },
        status: { not: 'REPORTED' },
      },
    });
  }

  // Get recent error count (placeholder - would integrate with logging system)
  private async getRecentErrors(): Promise<number> {
    // This would typically query a logging system or error tracking service
    // For now, return 0 as placeholder
    return 0;
  }
}
