import { UseCaseError } from '@/core/errors/use-case-error';

export class MatchDoesNotExistError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Match "${identifier}" does not exist.`);
  }
}
