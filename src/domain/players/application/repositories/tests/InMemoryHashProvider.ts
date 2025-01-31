/* eslint-disable @typescript-eslint/require-await */
import { HashProviderModel } from '../../providers/hashProvider/model/IHashProvider';

export class InMemoryHashProvider implements HashProviderModel {
  async hash(value: string): Promise<string> {
    return value;
  }

  async compare(value: string, hashedValue: string): Promise<boolean> {
    return value === hashedValue;
  }
}
