import { UseCaseError } from '@/core/errors/use-case-error';

export class CardDoesNotExistsError extends Error implements UseCaseError {
  constructor() {
    super(`Card does not exists.`);
  }
}
