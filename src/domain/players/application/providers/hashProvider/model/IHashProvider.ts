export abstract class HashProviderModel {
  abstract hash(value: string): Promise<string>;
  abstract compare(value: string, hashedValue: string): Promise<boolean>;
}
