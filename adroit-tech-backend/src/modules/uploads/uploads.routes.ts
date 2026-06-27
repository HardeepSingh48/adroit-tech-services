import { Router } from 'express';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();
const service = new UploadsService();
const controller = new UploadsController(service);

router.use(authenticate);

router.post('/presigned-url', controller.getPresignedUrl);
router.delete('/:documentId', controller.deleteDocument);

export default router;
