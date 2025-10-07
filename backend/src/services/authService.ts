import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { prisma } from '@/config/database';
import { config } from '@/config/environment';
import { AppError, LoginRequest, RegisterRequest, AuthTokens, TokenPayload } from '@/types';
import { logger } from '@/utils/logger';

export class AuthService {
  // Generate JWT tokens
  private generateTokens(user: User): AuthTokens {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const jwtSecret = config.jwt.secret;
    const jwtRefreshSecret = config.jwt.refreshSecret || config.jwt.secret;
    
    // @ts-ignore - Temporary fix for JWT typing issues
    const accessToken = jwt.sign(
      payload, 
      jwtSecret, 
      {
        expiresIn: config.jwt.expiresIn,
      }
    );

    // @ts-ignore - Temporary fix for JWT typing issues
    const refreshToken = jwt.sign(
      payload, 
      jwtRefreshSecret, 
      {
        expiresIn: config.jwt.refreshExpiresIn,
      }
    );

    // Calculate expiration time in seconds
    const decoded = jwt.decode(accessToken) as any;
    const expiresIn = decoded.exp - decoded.iat;

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }

  // Hash password
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, config.security.bcryptRounds);
  }

  // Verify password
  private async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // Register new user
  async register(data: RegisterRequest): Promise<{ user: Omit<User, 'password'>; tokens: AuthTokens }> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    // Hash password
    const hashedPassword = await this.hashPassword(data.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        password: hashedPassword,
        name: data.name,
        company: data.company,
        phone: data.phone,
        role: 'CLIENT', // Default role
      },
    });

    // Generate tokens
    const tokens = this.generateTokens(user);

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    logger.info('User registered successfully:', { userId: user.id, email: user.email });

    return {
      user: userWithoutPassword,
      tokens,
    };
  }

  // Login user
  async login(data: LoginRequest): Promise<{ user: Omit<User, 'password'>; tokens: AuthTokens }> {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    if (!user.isActive) {
      throw new AppError('Account is deactivated', 401);
    }

    // Verify password
    const isPasswordValid = await this.verifyPassword(data.password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate tokens
    const tokens = this.generateTokens(user);

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    logger.info('User logged in successfully:', { userId: user.id, email: user.email });

    return {
      user: userWithoutPassword,
      tokens,
    };
  }

  // Refresh access token
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as TokenPayload;

      // Check if refresh token exists in database
      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (!storedToken || storedToken.expiresAt < new Date()) {
        throw new AppError('Invalid or expired refresh token', 401);
      }

      if (!storedToken.user.isActive) {
        throw new AppError('Account is deactivated', 401);
      }

      // Generate new tokens
      const tokens = this.generateTokens(storedToken.user);

      // Update refresh token in database
      await prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: {
          token: tokens.refreshToken,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });

      logger.info('Token refreshed successfully:', { userId: storedToken.user.id });

      return tokens;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError('Invalid refresh token', 401);
      }
      throw error;
    }
  }

  // Logout user
  async logout(refreshToken: string): Promise<void> {
    try {
      // Remove refresh token from database
      await prisma.refreshToken.delete({
        where: { token: refreshToken },
      });

      logger.info('User logged out successfully');
    } catch (error) {
      // Token might not exist, which is fine
      logger.warn('Logout attempted with invalid token');
    }
  }

  // Logout from all devices
  async logoutAll(userId: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });

    logger.info('User logged out from all devices:', { userId });
  }

  // Change password
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Verify current password
    const isCurrentPasswordValid = await this.verifyPassword(currentPassword, user.password);

    if (!isCurrentPasswordValid) {
      throw new AppError('Current password is incorrect', 400);
    }

    // Hash new password
    const hashedNewPassword = await this.hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    // Logout from all devices for security
    await this.logoutAll(userId);

    logger.info('Password changed successfully:', { userId });
  }

  // Get user profile
  async getProfile(userId: string): Promise<Omit<User, 'password'>> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
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

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  // Update user profile
  async updateProfile(
    userId: string,
    data: Partial<Pick<User, 'name' | 'company' | 'phone' | 'avatar'>>
  ): Promise<Omit<User, 'password'>> {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
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

    logger.info('User profile updated:', { userId });

    return user;
  }
}
