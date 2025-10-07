import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiResponse, LoginRequest, RegisterRequest } from '@/types';
import { AuthService } from '@/services/authService';
import { asyncHandler } from '@/middleware/errorHandler';
import { validateRequest } from '@/utils/validation';
import { loginSchema, registerSchema, changePasswordSchema, updateProfileSchema } from '@/utils/schemas';

const authService = new AuthService();

export const authController = {
  // Register new user
  register: asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const validatedData = validateRequest(registerSchema, req.body);
    
    const result = await authService.register(validatedData as RegisterRequest);

    const response: ApiResponse = {
      success: true,
      message: 'User registered successfully',
      data: {
        user: result.user,
        tokens: result.tokens,
      },
    };

    res.status(201).json(response);
  }),

  // Login user
  login: asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const validatedData = validateRequest(loginSchema, req.body);
    
    const result = await authService.login(validatedData as LoginRequest);

    const response: ApiResponse = {
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        tokens: result.tokens,
      },
    };

    res.status(200).json(response);
  }),

  // Refresh access token
  refreshToken: asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required',
      });
    }

    const tokens = await authService.refreshToken(refreshToken);

    const response: ApiResponse = {
      success: true,
      message: 'Token refreshed successfully',
      data: { tokens },
    };

    res.status(200).json(response);
  }),

  // Logout user
  logout: asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    const response: ApiResponse = {
      success: true,
      message: 'Logout successful',
    };

    res.status(200).json(response);
  }),

  // Logout from all devices
  logoutAll: asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user!.id;

    await authService.logoutAll(userId);

    const response: ApiResponse = {
      success: true,
      message: 'Logged out from all devices successfully',
    };

    res.status(200).json(response);
  }),

  // Get user profile
  getProfile: asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user!.id;

    const user = await authService.getProfile(userId);

    const response: ApiResponse = {
      success: true,
      data: { user },
    };

    res.status(200).json(response);
  }),

  // Update user profile
  updateProfile: asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const validatedData = validateRequest(updateProfileSchema, req.body);

    const user = await authService.updateProfile(userId, validatedData);

    const response: ApiResponse = {
      success: true,
      message: 'Profile updated successfully',
      data: { user },
    };

    res.status(200).json(response);
  }),

  // Change password
  changePassword: asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const validatedData = validateRequest(changePasswordSchema, req.body);

    await authService.changePassword(
      userId,
      validatedData.currentPassword,
      validatedData.newPassword
    );

    const response: ApiResponse = {
      success: true,
      message: 'Password changed successfully',
    };

    res.status(200).json(response);
  }),

  // Get current user info (for token validation)
  me: asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const response: ApiResponse = {
      success: true,
      data: { user: req.user },
    };

    res.status(200).json(response);
  }),
};
