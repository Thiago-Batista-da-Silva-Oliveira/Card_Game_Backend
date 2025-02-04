import { Deck } from '../../enterprise/entities/Deck';
import { DeckHasCards } from '../../enterprise/entities/DeckHasCards';

export abstract class DeckRepository {
  abstract create(deck: Deck): Promise<Deck>;
  abstract findExistingDeck(playerId: string, name: string): Promise<boolean>;
  abstract findDeckById(id: string): Promise<Deck | null>;
  abstract save(deck: Deck): Promise<Deck>;
  abstract findManyCardsByDeckId(id: string): Promise<DeckHasCards[]>;
  abstract removeCardsFromDeck(deckId: string, cards: string[]): Promise<void>;
  abstract addCardsToDeck(deckId: string, cards: string[]): Promise<void>;
}
