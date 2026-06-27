import { RequestHandler } from 'express';
import { AuthService } from './auth.service';
import { sendSuccess } from '../../shared/response.helper';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  registerJobSeeker: RequestHandler = async (req, res, next) => {
    try {
      const result = await this.authService.registerJobSeeker(req.body);
      sendSuccess(res, result, 'Registration successful', 201);
    } catch (err) {
      next(err);
    }
  };

  registerEmployer: RequestHandler = async (req, res, next) => {
    try {
      const result = await this.authService.registerEmployer(req.body);
      sendSuccess(res, result, 'Employer registration successful', 201);
    } catch (err) {
      next(err);
    }
  };

  login: RequestHandler = async (req, res, next) => {
    try {
      const result = await this.authService.login(req.body);
      sendSuccess(res, result, 'Login successful', 200);
    } catch (err) {
      next(err);
    }
  };

  refresh: RequestHandler = async (req, res, next) => {
    try {
      const result = await this.authService.refreshTokens(req.body.refreshToken);
      sendSuccess(res, result, 'Tokens refreshed successfully', 200);
    } catch (err) {
      next(err);
    }
  };

  logout: RequestHandler = async (req, res, next) => {
    try {
      await this.authService.logout(req.user!.id, req.user!.sessionId);
      sendSuccess(res, null, 'Logout successful', 200);
    } catch (err) {
      next(err);
    }
  };

  logoutAll: RequestHandler = async (req, res, next) => {
    try {
      await this.authService.logoutAll(req.user!.id);
      sendSuccess(res, null, 'Logged out from all sessions', 200);
    } catch (err) {
      next(err);
    }
  };

  getMe: RequestHandler = async (req, res, next) => {
    try {
      const user = await this.authService.getCurrentUser(req.user!.id);
      sendSuccess(res, user, 'Current user retrieved successfully', 200);
    } catch (err) {
      next(err);
    }
  };

  changePassword: RequestHandler = async (req, res, next) => {
    try {
      await this.authService.changePassword(req.user!.id, req.body);
      sendSuccess(res, null, 'Password changed successfully', 200);
    } catch (err) {
      next(err);
    }
  };
}
