/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { HashProviderModel } from '../model/IHashProvider';
import bcrypt from 'bcryptjs';

export class HashProvider implements HashProviderModel {
  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, 8);
  }

  async compare(value: string, hashedValue: string): Promise<boolean> {
    return bcrypt.compare(value, hashedValue);
  }
}
