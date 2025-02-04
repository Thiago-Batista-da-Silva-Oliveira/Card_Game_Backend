/* eslint-disable @typescript-eslint/require-await */
import { Deck } from '@/domain/cards/enterprise/entities/Deck';
import { DeckRepository } from '../IDeckRepository';

export class InMemoryDeckRepository implements DeckRepository {
  public items: Deck[] = [];

  async create(deck: Deck): Promise<Deck> {
    this.items.push(deck);
    return deck;
  }

  async findExistingDeck(playerId: string, name: string): Promise<boolean> {
    return !!this.items.find(
      (deck) => deck.playerId.toValue() === playerId && deck.name === name,
    );
  }
}
