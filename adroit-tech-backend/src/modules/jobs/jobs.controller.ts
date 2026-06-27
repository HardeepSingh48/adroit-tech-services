import { RequestHandler } from 'express';
import { JobsService } from './jobs.service';
import { sendSuccess, sendPaginated } from '../../shared/response.helper';
import { JobFiltersDto } from './jobs.types';

export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  listJobs: RequestHandler = async (req, res, next) => {
    try {
      const result = await this.jobsService.listJobs(req.query as unknown as JobFiltersDto);
      sendPaginated(res, result, 'Jobs retrieved successfully');
    } catch (err) {
      next(err);
    }
  };

  getFeaturedJobs: RequestHandler = async (_req, res, next) => {
    try {
      const jobs = await this.jobsService.getFeaturedJobs();
      sendSuccess(res, jobs, 'Featured jobs retrieved successfully');
    } catch (err) {
      next(err);
    }
  };

  getJobByIdOrSlug: RequestHandler = async (req, res, next) => {
    try {
      const job = await this.jobsService.getJobByIdOrSlug(req.params.idOrSlug);
      sendSuccess(res, job, 'Job details retrieved successfully');
    } catch (err) {
      next(err);
    }
  };

  createJob: RequestHandler = async (req, res, next) => {
    try {
      const job = await this.jobsService.createJob(req.user!.id, req.user!.role, req.body);
      sendSuccess(res, job, 'Job created successfully', 201);
    } catch (err) {
      next(err);
    }
  };

  updateJob: RequestHandler = async (req, res, next) => {
    try {
      const job = await this.jobsService.updateJob(req.params.id, req.user!.id, req.user!.role, req.body);
      sendSuccess(res, job, 'Job updated successfully');
    } catch (err) {
      next(err);
    }
  };

  updateJobStatus: RequestHandler = async (req, res, next) => {
    try {
      const job = await this.jobsService.updateJobStatus(req.params.id, req.body.status, req.user!.id, req.user!.role);
      sendSuccess(res, job, 'Job status updated successfully');
    } catch (err) {
      next(err);
    }
  };

  deleteJob: RequestHandler = async (req, res, next) => {
    try {
      await this.jobsService.softDeleteJob(req.params.id, req.user!.id, req.user!.role);
      sendSuccess(res, null, 'Job deleted successfully');
    } catch (err) {
      next(err);
    }
  };
}
