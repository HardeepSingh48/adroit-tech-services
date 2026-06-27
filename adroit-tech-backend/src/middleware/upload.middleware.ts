import multer from 'multer';
import { Request } from 'express';
import { BadRequestError } from '../shared/errors';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_DOC_TYPES = ['application/pdf', ...ALLOWED_IMAGE_TYPES];

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_DOC_SIZE = 5 * 1024 * 1024; // 5MB

const storage = multer.memoryStorage();

const fileFilter = (allowedTypes: string[]) => (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new BadRequestError(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`));
  }
  cb(null, true);
};

export const uploadImage = multer({
  storage,
  limits: { fileSize: MAX_IMAGE_SIZE },
  fileFilter: fileFilter(ALLOWED_IMAGE_TYPES),
});

export const uploadDocument = multer({
  storage,
  limits: { fileSize: MAX_DOC_SIZE },
  fileFilter: fileFilter(ALLOWED_DOC_TYPES),
});
