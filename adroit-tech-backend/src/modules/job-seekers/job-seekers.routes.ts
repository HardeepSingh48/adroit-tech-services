import { Router } from 'express';
import { JobSeekersController } from './job-seekers.controller';
import { JobSeekersService } from './job-seekers.service';
import { validate } from '../../middleware/validate.middleware';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { UserRole } from '@prisma/client';
import { updateJobSeekerProfileSchema } from './job-seekers.schema';

const router = Router();
const service = new JobSeekersService();
const controller = new JobSeekersController(service);

router.use(authenticate, requireRole(UserRole.JOB_SEEKER));

router.get('/profile', controller.getProfile);
router.put('/profile', validate('body', updateJobSeekerProfileSchema), controller.updateProfile);

router.get('/applications', controller.listApplications);
router.get('/applications/:id', controller.getApplicationById);
router.post('/applications/:id/withdraw', controller.withdrawApplication);

router.get('/saved-jobs', controller.listSavedJobs);
router.post('/saved-jobs/:jobId', controller.saveJob);
router.delete('/saved-jobs/:jobId', controller.unsaveJob);

router.get('/notifications', controller.listNotifications);
router.patch('/notifications/:id/read', controller.markRead);
router.patch('/notifications/read-all', controller.markAllRead);

export default router;
