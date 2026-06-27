import { RequestHandler } from 'express';
import { EmployerStatus } from '@prisma/client';
import { AdminService } from './admin.service';
import { sendSuccess, sendPaginated } from '../../shared/response.helper';

export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  getDashboard: RequestHandler = async (_req, res, next) => {
    try {
      const stats = await this.adminService.getPlatformStats();
      sendSuccess(res, stats, 'Platform dashboard stats retrieved');
    } catch (err) {
      next(err);
    }
  };

  listUsers: RequestHandler = async (req, res, next) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const result = await this.adminService.listUsers(page, limit);
      sendPaginated(res, result, 'Users retrieved successfully');
    } catch (err) {
      next(err);
    }
  };

  getUserById: RequestHandler = async (req, res, next) => {
    try {
      const user = await this.adminService.getUserById(req.params.id);
      sendSuccess(res, user, 'User details retrieved');
    } catch (err) {
      next(err);
    }
  };

  updateUserStatus: RequestHandler = async (req, res, next) => {
    try {
      const user = await this.adminService.updateUserStatus(req.params.id, req.body.status);
      sendSuccess(res, user, 'User status updated successfully');
    } catch (err) {
      next(err);
    }
  };

  listEmployers: RequestHandler = async (req, res, next) => {
    try {
      const employers = await this.adminService.listEmployers(req.query.status as EmployerStatus | undefined);
      sendSuccess(res, employers, 'Employers retrieved successfully');
    } catch (err) {
      next(err);
    }
  };

  getEmployerById: RequestHandler = async (req, res, next) => {
    try {
      const employer = await this.adminService.getEmployerById(req.params.id);
      sendSuccess(res, employer, 'Employer details retrieved');
    } catch (err) {
      next(err);
    }
  };

  approveEmployer: RequestHandler = async (req, res, next) => {
    try {
      const employer = await this.adminService.approveEmployer(req.params.id, req.user!.id);
      sendSuccess(res, employer, 'Employer approved successfully');
    } catch (err) {
      next(err);
    }
  };

  rejectEmployer: RequestHandler = async (req, res, next) => {
    try {
      const employer = await this.adminService.rejectEmployer(req.params.id, req.body.reason);
      sendSuccess(res, employer, 'Employer rejected');
    } catch (err) {
      next(err);
    }
  };

  listJobs: RequestHandler = async (_req, res, next) => {
    try {
      const jobs = await this.adminService.listJobs();
      sendSuccess(res, jobs, 'All jobs retrieved');
    } catch (err) {
      next(err);
    }
  };

  toggleJobFeatured: RequestHandler = async (req, res, next) => {
    try {
      const job = await this.adminService.toggleJobFeatured(req.params.id);
      sendSuccess(res, job, 'Job featured status updated');
    } catch (err) {
      next(err);
    }
  };

  hardDeleteJob: RequestHandler = async (req, res, next) => {
    try {
      await this.adminService.hardDeleteJob(req.params.id);
      sendSuccess(res, null, 'Job hard deleted');
    } catch (err) {
      next(err);
    }
  };

  listApplications: RequestHandler = async (_req, res, next) => {
    try {
      const apps = await this.adminService.listApplications();
      sendSuccess(res, apps, 'All platform applications retrieved');
    } catch (err) {
      next(err);
    }
  };

  listAuditLogs: RequestHandler = async (_req, res, next) => {
    try {
      const logs = await this.adminService.listAuditLogs();
      sendSuccess(res, logs, 'Audit logs retrieved');
    } catch (err) {
      next(err);
    }
  };
}
