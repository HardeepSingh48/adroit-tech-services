import { DocumentType } from '@prisma/client';

export interface PresignedUrlDto {
  fileType: DocumentType;
  fileName: string;
  mimeType: string;
}
