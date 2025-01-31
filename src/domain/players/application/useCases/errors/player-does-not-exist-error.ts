import { UseCaseError } from '@/core/errors/use-case-error';

export class PlayerDoesNotExistError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Player "${identifier}" does not exist.`);
  }
}
