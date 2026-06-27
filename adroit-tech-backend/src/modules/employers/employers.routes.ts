import { Router } from 'express';
import { EmployersController } from './employers.controller';
import { EmployersService } from './employers.service';
import { ApplicationsService } from '../applications/applications.service';
import { ApplicationsController } from '../applications/applications.controller';
import { validate } from '../../middleware/validate.middleware';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { UserRole } from '@prisma/client';
import { updateEmployerProfileSchema } from './employers.schema';
import { updateApplicationStatusSchema, addEmployerNotesSchema } from '../applications/applications.schema';

const router = Router();
const service = new EmployersService();
const controller = new EmployersController(service);

const appService = new ApplicationsService();
const appController = new ApplicationsController(appService);

router.use(authenticate, requireRole(UserRole.EMPLOYER));

router.get('/profile', controller.getProfile);
router.put('/profile', validate('body', updateEmployerProfileSchema), controller.updateProfile);
router.get('/dashboard/stats', controller.getDashboardStats);

router.get('/jobs', controller.listJobs);
router.get('/jobs/:id', controller.getJobById);
router.get('/jobs/:id/applications', controller.getJobApplications);

router.get('/applications', controller.listAllApplications);
router.get('/applications/:id', controller.getApplicationById);
router.patch('/applications/:id/status', validate('body', updateApplicationStatusSchema), appController.updateStatus);
router.patch('/applications/:id/notes', validate('body', addEmployerNotesSchema), appController.addNotes);

router.get('/notifications', controller.listNotifications);

export default router;
