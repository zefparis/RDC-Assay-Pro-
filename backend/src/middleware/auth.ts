import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '@/config/database';
import { config } from '@/config/environment';
import { AuthenticatedRequest, TokenPayload, AppError } from '@/types';
import { logger } from '@/utils/logger';

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Access token required', 401);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify the token
    const decoded = jwt.verify(token, config.jwt.secret) as TokenPayload;

    // Get user from database (best-effort)
    let user = null as unknown as typeof req.user;
    try {
      user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          company: true,
          phone: true,
          avatar: true,
          isActive: true,
          isVerified: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (e: any) {
      logger.warn('Failed to fetch user from DB in authenticate. Considering demo fallback.', {
        error: e?.message || e,
      });
    }

    if (!user) {
      // Demo fallback: trust token payload if feature enabled
      if (config.features?.demoLoginEnabled && decoded?.email === 'admin@rdcassay.africa') {
        user = {
          id: decoded.userId || 'demo-admin',
          email: decoded.email,
          name: 'System Administrator',
          role: (decoded as any).role || 'ADMIN',
          company: 'RDC Assay Pro',
          phone: null,
          avatar: null,
          isActive: true,
          isVerified: true,
          lastLoginAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        } as any;
      } else {
        throw new AppError('User not found', 401);
      }
    }

    if (!user.isActive) {
      throw new AppError('Account is deactivated', 401);
    }

    // Attach user to request
    req.user = user;
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      logger.warn('Invalid JWT token:', { error: error.message, ip: req.ip });
      next(new AppError('Invalid token', 401));
    } else if (error instanceof jwt.TokenExpiredError) {
      logger.warn('Expired JWT token:', { ip: req.ip });
      next(new AppError('Token expired', 401));
    } else {
      next(error);
    }
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Authentication required', 401));
      return;
    }

    if (!roles.includes(req.user.role)) {
      logger.warn('Unauthorized access attempt:', {
        userId: req.user.id,
        userRole: req.user.role,
        requiredRoles: roles,
        path: req.path,
        method: req.method,
        ip: req.ip,
      });
      
      next(new AppError('Insufficient permissions', 403));
      return;
    }

    next();
  };
};

// Optional authentication - doesn't throw error if no token
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next();
      return;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, config.jwt.secret) as TokenPayload;

    let user = null as unknown as typeof req.user;
    try {
      user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          company: true,
          phone: true,
          avatar: true,
          isActive: true,
          isVerified: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (e: any) {
      logger.warn('Failed to fetch user from DB in optionalAuth. Considering demo fallback.', {
        error: e?.message || e,
      });
    }

    if (user && user.isActive) {
      req.user = user;
    } else if (config.features?.demoLoginEnabled && decoded?.email === 'admin@rdcassay.africa') {
      req.user = {
        id: decoded.userId || 'demo-admin',
        email: decoded.email,
        name: 'System Administrator',
        role: (decoded as any).role || 'ADMIN',
        company: 'RDC Assay Pro',
        phone: null,
        avatar: null,
        isActive: true,
        isVerified: true,
        lastLoginAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any;
    }

    next();
  } catch (error) {
    // Ignore auth errors for optional auth
    next();
  }
};

// Check if user owns the resource or is admin
export const checkOwnership = (resourceUserIdField: string = 'userId') => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Authentication required', 401));
      return;
    }

    // Admins can access any resource
    if (req.user.role === 'ADMIN' || req.user.role === 'SUPERVISOR') {
      next();
      return;
    }

    // Check if user owns the resource
    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
    
    if (resourceUserId && resourceUserId !== req.user.id) {
      next(new AppError('Access denied', 403));
      return;
    }

    next();
  };
};
