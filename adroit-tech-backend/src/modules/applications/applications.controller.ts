import { RequestHandler } from 'express';
import { ApplicationsService } from './applications.service';
import { sendSuccess } from '../../shared/response.helper';

export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  applyForJob: RequestHandler = async (req, res, next) => {
    try {
      const result = await this.applicationsService.applyForJob(req.user!.id, req.params.id, req.body);
      sendSuccess(res, result, 'Application submitted successfully', 201);
    } catch (err) {
      next(err);
    }
  };

  updateStatus: RequestHandler = async (req, res, next) => {
    try {
      const result = await this.applicationsService.updateApplicationStatus(req.params.id, req.user!.id, req.user!.role, req.body);
      sendSuccess(res, result, 'Application status updated successfully');
    } catch (err) {
      next(err);
    }
  };

  addNotes: RequestHandler = async (req, res, next) => {
    try {
      const result = await this.applicationsService.addEmployerNotes(req.params.id, req.user!.id, req.user!.role, req.body);
      sendSuccess(res, result, 'Notes saved successfully');
    } catch (err) {
      next(err);
    }
  };
}
