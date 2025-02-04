import { UseCaseError } from '@/core/errors/use-case-error';

export class DeckDoesNotExistsError extends Error implements UseCaseError {
  constructor() {
    super(`Deck does not exists.`);
  }
}
