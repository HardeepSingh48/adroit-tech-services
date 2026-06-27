import { RequestHandler } from 'express';
import { JobSeekersService } from './job-seekers.service';
import { sendSuccess } from '../../shared/response.helper';

export class JobSeekersController {
  constructor(private readonly jobSeekersService: JobSeekersService) {}

  getProfile: RequestHandler = async (req, res, next) => {
    try {
      const profile = await this.jobSeekersService.getProfile(req.user!.id);
      sendSuccess(res, profile, 'Profile retrieved successfully');
    } catch (err) {
      next(err);
    }
  };

  updateProfile: RequestHandler = async (req, res, next) => {
    try {
      const profile = await this.jobSeekersService.updateProfile(req.user!.id, req.body);
      sendSuccess(res, profile, 'Profile updated successfully');
    } catch (err) {
      next(err);
    }
  };

  listApplications: RequestHandler = async (req, res, next) => {
    try {
      const apps = await this.jobSeekersService.listApplications(req.user!.id);
      sendSuccess(res, apps, 'Applications retrieved successfully');
    } catch (err) {
      next(err);
    }
  };

  getApplicationById: RequestHandler = async (req, res, next) => {
    try {
      const app = await this.jobSeekersService.getApplicationById(req.user!.id, req.params.id);
      sendSuccess(res, app, 'Application details retrieved successfully');
    } catch (err) {
      next(err);
    }
  };

  withdrawApplication: RequestHandler = async (req, res, next) => {
    try {
      const app = await this.jobSeekersService.withdrawApplication(req.user!.id, req.params.id);
      sendSuccess(res, app, 'Application withdrawn successfully');
    } catch (err) {
      next(err);
    }
  };

  listSavedJobs: RequestHandler = async (req, res, next) => {
    try {
      const jobs = await this.jobSeekersService.listSavedJobs(req.user!.id);
      sendSuccess(res, jobs, 'Saved jobs retrieved successfully');
    } catch (err) {
      next(err);
    }
  };

  saveJob: RequestHandler = async (req, res, next) => {
    try {
      const saved = await this.jobSeekersService.saveJob(req.user!.id, req.params.jobId);
      sendSuccess(res, saved, 'Job saved successfully', 201);
    } catch (err) {
      next(err);
    }
  };

  unsaveJob: RequestHandler = async (req, res, next) => {
    try {
      await this.jobSeekersService.unsaveJob(req.user!.id, req.params.jobId);
      sendSuccess(res, null, 'Job removed from saved');
    } catch (err) {
      next(err);
    }
  };

  listNotifications: RequestHandler = async (req, res, next) => {
    try {
      const notifs = await this.jobSeekersService.listNotifications(req.user!.id);
      sendSuccess(res, notifs, 'Notifications retrieved successfully');
    } catch (err) {
      next(err);
    }
  };

  markRead: RequestHandler = async (req, res, next) => {
    try {
      const notif = await this.jobSeekersService.markNotificationRead(req.user!.id, req.params.id);
      sendSuccess(res, notif, 'Notification marked as read');
    } catch (err) {
      next(err);
    }
  };

  markAllRead: RequestHandler = async (req, res, next) => {
    try {
      await this.jobSeekersService.markAllNotificationsRead(req.user!.id);
      sendSuccess(res, null, 'All notifications marked as read');
    } catch (err) {
      next(err);
    }
  };
}
