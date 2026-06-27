import { Router } from 'express';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { ApplicationsService } from '../applications/applications.service';
import { ApplicationsController } from '../applications/applications.controller';
import { validate } from '../../middleware/validate.middleware';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { UserRole } from '@prisma/client';
import { createJobSchema, updateJobSchema, updateJobStatusSchema, jobQuerySchema } from './jobs.schema';
import { applyForJobSchema } from '../applications/applications.schema';

const router = Router();
const jobsService = new JobsService();
const jobsController = new JobsController(jobsService);

const applicationsService = new ApplicationsService();
const applicationsController = new ApplicationsController(applicationsService);

router.get('/', validate('query', jobQuerySchema), jobsController.listJobs);
router.get('/featured', jobsController.getFeaturedJobs);
router.get('/:idOrSlug', jobsController.getJobByIdOrSlug);

router.post('/', authenticate, requireRole(UserRole.EMPLOYER, UserRole.ADMIN), validate('body', createJobSchema), jobsController.createJob);
router.put('/:id', authenticate, requireRole(UserRole.EMPLOYER, UserRole.ADMIN), validate('body', updateJobSchema), jobsController.updateJob);
router.patch('/:id/status', authenticate, requireRole(UserRole.EMPLOYER, UserRole.ADMIN), validate('body', updateJobStatusSchema), jobsController.updateJobStatus);
router.delete('/:id', authenticate, requireRole(UserRole.EMPLOYER, UserRole.ADMIN), jobsController.deleteJob);

router.post('/:id/applications', authenticate, requireRole(UserRole.JOB_SEEKER), validate('body', applyForJobSchema), applicationsController.applyForJob);

export default router;
