import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const hashToken = async (token: string): Promise<string> => {
  return bcrypt.hash(token, 10);
};

export const compareHash = async (data: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(data, hash);
};
