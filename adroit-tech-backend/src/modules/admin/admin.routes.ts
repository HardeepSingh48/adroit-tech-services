import { Router } from 'express';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { validate } from '../../middleware/validate.middleware';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { UserRole } from '@prisma/client';
import { updateUserStatusSchema, rejectEmployerSchema } from './admin.schema';

const router = Router();
const service = new AdminService();
const controller = new AdminController(service);

router.use(authenticate, requireRole(UserRole.ADMIN));

router.get('/dashboard', controller.getDashboard);

router.get('/users', controller.listUsers);
router.get('/users/:id', controller.getUserById);
router.patch('/users/:id/status', validate('body', updateUserStatusSchema), controller.updateUserStatus);

router.get('/employers', controller.listEmployers);
router.get('/employers/:id', controller.getEmployerById);
router.patch('/employers/:id/approve', controller.approveEmployer);
router.patch('/employers/:id/reject', validate('body', rejectEmployerSchema), controller.rejectEmployer);

router.get('/jobs', controller.listJobs);
router.patch('/jobs/:id/feature', controller.toggleJobFeatured);
router.delete('/jobs/:id', controller.hardDeleteJob);

router.get('/applications', controller.listApplications);
router.get('/audit-logs', controller.listAuditLogs);

export default router;
