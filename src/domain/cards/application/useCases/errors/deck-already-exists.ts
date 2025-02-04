import { UseCaseError } from '@/core/errors/use-case-error';

export class DeckAlreadyExistsError extends Error implements UseCaseError {
  constructor() {
    super(`Deck already exists.`);
  }
}
