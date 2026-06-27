import { Router } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { validate } from '../../middleware/validate.middleware';
import { authenticate } from '../../middleware/auth.middleware';
import { authRateLimiter } from '../../middleware/rateLimiter.middleware';
import {
  registerJobSeekerSchema,
  registerEmployerSchema,
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
} from './auth.schema';

const router = Router();
const authService = new AuthService();
const authController = new AuthController(authService);

router.post('/register/job-seeker', validate('body', registerJobSeekerSchema), authController.registerJobSeeker);
router.post('/register/employer', validate('body', registerEmployerSchema), authController.registerEmployer);
router.post('/login', authRateLimiter, validate('body', loginSchema), authController.login);
router.post('/refresh', validate('body', refreshTokenSchema), authController.refresh);
router.post('/logout', authenticate, authController.logout);
router.post('/logout-all', authenticate, authController.logoutAll);
router.get('/me', authenticate, authController.getMe);
router.patch('/change-password', authenticate, validate('body', changePasswordSchema), authController.changePassword);

export default router;
