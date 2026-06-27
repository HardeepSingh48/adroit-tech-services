import { RequestHandler } from 'express';
import { UploadsService } from './uploads.service';
import { sendSuccess } from '../../shared/response.helper';

export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  getPresignedUrl: RequestHandler = async (req, res, next) => {
    try {
      const result = await this.uploadsService.getPresignedUploadUrl(req.user!.id, req.body);
      sendSuccess(res, result, 'Presigned URL generated successfully');
    } catch (err) {
      next(err);
    }
  };

  deleteDocument: RequestHandler = async (req, res, next) => {
    try {
      await this.uploadsService.deleteDocument(req.user!.id, req.params.documentId);
      sendSuccess(res, null, 'Document deleted successfully');
    } catch (err) {
      next(err);
    }
  };
}
