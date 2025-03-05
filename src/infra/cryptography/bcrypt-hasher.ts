import { HashProviderModel } from '@/domain/players/application/providers/hashProvider/model/IHashProvider';
import bcrypt from 'bcryptjs';

export class HashProvider implements HashProviderModel {
  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, 8);
  }

  async compare(value: string, hashedValue: string): Promise<boolean> {
    return bcrypt.compare(value, hashedValue);
  }
}
