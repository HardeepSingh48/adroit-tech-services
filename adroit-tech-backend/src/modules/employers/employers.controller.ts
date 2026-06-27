import { RequestHandler } from 'express';
import { EmployersService } from './employers.service';
import { sendSuccess } from '../../shared/response.helper';

export class EmployersController {
  constructor(private readonly employersService: EmployersService) {}

  getProfile: RequestHandler = async (req, res, next) => {
    try {
      const profile = await this.employersService.getProfile(req.user!.id);
      sendSuccess(res, profile, 'Employer profile retrieved successfully');
    } catch (err) {
      next(err);
    }
  };

  updateProfile: RequestHandler = async (req, res, next) => {
    try {
      const profile = await this.employersService.updateProfile(req.user!.id, req.body);
      sendSuccess(res, profile, 'Employer profile updated successfully');
    } catch (err) {
      next(err);
    }
  };

  getDashboardStats: RequestHandler = async (req, res, next) => {
    try {
      const stats = await this.employersService.getDashboardStats(req.user!.id);
      sendSuccess(res, stats, 'Dashboard stats retrieved successfully');
    } catch (err) {
      next(err);
    }
  };

  listJobs: RequestHandler = async (req, res, next) => {
    try {
      const jobs = await this.employersService.listJobs(req.user!.id);
      sendSuccess(res, jobs, 'Jobs retrieved successfully');
    } catch (err) {
      next(err);
    }
  };

  getJobById: RequestHandler = async (req, res, next) => {
    try {
      const job = await this.employersService.getJobById(req.user!.id, req.params.id);
      sendSuccess(res, job, 'Job details retrieved successfully');
    } catch (err) {
      next(err);
    }
  };

  getJobApplications: RequestHandler = async (req, res, next) => {
    try {
      const apps = await this.employersService.getJobApplications(req.user!.id, req.params.id);
      sendSuccess(res, apps, 'Applications for job retrieved successfully');
    } catch (err) {
      next(err);
    }
  };

  listAllApplications: RequestHandler = async (req, res, next) => {
    try {
      const apps = await this.employersService.listAllApplications(req.user!.id);
      sendSuccess(res, apps, 'All applications retrieved successfully');
    } catch (err) {
      next(err);
    }
  };

  getApplicationById: RequestHandler = async (req, res, next) => {
    try {
      const app = await this.employersService.getApplicationById(req.user!.id, req.params.id);
      sendSuccess(res, app, 'Application details retrieved successfully');
    } catch (err) {
      next(err);
    }
  };

  listNotifications: RequestHandler = async (req, res, next) => {
    try {
      const notifs = await this.employersService.listNotifications(req.user!.id);
      sendSuccess(res, notifs, 'Notifications retrieved successfully');
    } catch (err) {
      next(err);
    }
  };
}
