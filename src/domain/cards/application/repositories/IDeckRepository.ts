import { Deck } from '../../enterprise/entities/Deck';

export abstract class DeckRepository {
  abstract create(card: Deck): Promise<Deck>;
  abstract findExistingDeck(playerId: string, name: string): Promise<boolean>;
}
