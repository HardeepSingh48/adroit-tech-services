import { DocumentType } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { BaseService } from '../../shared/base.service';
import { prisma } from '../../database/prisma';
import { config } from '../../config';
import { PresignedUrlDto } from './uploads.types';
import { NotFoundError } from '../../shared/errors';

export class UploadsService extends BaseService {
  constructor() {
    super(prisma);
  }

  async getPresignedUploadUrl(userId: string, dto: PresignedUrlDto) {
    const ext = dto.fileName.split('.').pop() || 'file';
    const s3Key = `${dto.fileType.toLowerCase()}s/${userId}/${uuidv4()}.${ext}`;
    const uploadUrl = `${config.AWS_CLOUDFRONT_DOMAIN}/upload-mock/${s3Key}`;

    return {
      uploadUrl,
      s3Key,
      expiresIn: 300,
    };
  }

  async confirmUpload(userId: string, s3Key: string, fileType: DocumentType, originalName: string, sizeBytes = 1024) {
    const fileName = s3Key.split('/').pop() || originalName;
    const url = `${config.AWS_CLOUDFRONT_DOMAIN}/${s3Key}`;

    return this.prisma.document.create({
      data: {
        userId,
        type: fileType,
        fileName,
        originalName,
        mimeType: 'application/octet-stream',
        sizeBytes,
        s3Key,
        s3Bucket: config.AWS_S3_BUCKET,
        url,
      },
    });
  }

  async deleteDocument(userId: string, documentId: string) {
    const doc = await this.prisma.document.findFirst({ where: { id: documentId, userId } });
    if (!doc) throw new NotFoundError('Document not found');
    await this.prisma.document.delete({ where: { id: documentId } });
  }
}
