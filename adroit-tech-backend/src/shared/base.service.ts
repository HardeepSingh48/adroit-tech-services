import { PrismaClient } from '@prisma/client';
import { NotFoundError } from './errors';

export abstract class BaseService {
  protected prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  protected async findOrThrow<T>(
    findFn: () => Promise<T | null>,
    label: string
  ): Promise<T> {
    const record = await findFn();
    if (!record) throw new NotFoundError(`${label} not found`);
    return record;
  }
}
