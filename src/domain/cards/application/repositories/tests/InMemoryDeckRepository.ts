/* eslint-disable @typescript-eslint/require-await */
import { Deck } from '@/domain/cards/enterprise/entities/Deck';
import { DeckRepository } from '../IDeckRepository';
import { DeckHasCards } from '@/domain/cards/enterprise/entities/DeckHasCards';
import { UniqueEntityID } from '@/core/entities/unique_entity_id';

export class InMemoryDeckRepository implements DeckRepository {
  public items: Deck[] = [];
  public deckHasCards: DeckHasCards[] = [];

  async create(deck: Deck): Promise<Deck> {
    this.items.push(deck);
    return deck;
  }

  async findExistingDeck(playerId: string, name: string): Promise<boolean> {
    return !!this.items.find(
      (deck) => deck.playerId.toValue() === playerId && deck.name === name,
    );
  }

  async findDeckById(id: string): Promise<Deck | null> {
    const deck = this.items.find((deck) => deck.id.toValue() === id);

    return deck || null;
  }

  async findManyCardsByDeckId(id: string): Promise<DeckHasCards[]> {
    return this.deckHasCards.filter((deck) => deck.deckId.toValue() === id);
  }

  async addCardsToDeck(deckId: string, cards: string[]): Promise<void> {
    cards.map((card) => {
      this.deckHasCards.push(
        DeckHasCards.create({
          deckId: new UniqueEntityID(deckId),
          cardId: new UniqueEntityID(card),
        }),
      );
    });
  }

  async removeCardsFromDeck(deckId: string, cards: string[]): Promise<void> {
    this.deckHasCards = this.deckHasCards.filter(
      (deckCard) =>
        deckCard.deckId.toValue() !== deckId ||
        (!cards.includes(deckCard.cardId.toValue()) &&
          deckId === deckCard.deckId.toValue()),
    );
  }

  async save(deck: Deck): Promise<Deck> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toValue() === deck.id.toValue(),
    );

    this.items[itemIndex] = deck;

    return this.items[itemIndex];
  }
}
