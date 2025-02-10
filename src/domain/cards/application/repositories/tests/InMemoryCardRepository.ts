/* eslint-disable @typescript-eslint/require-await */
import { Card } from 'src/domain/cards/enterprise/entities/Card';
import { CardRepository } from '../ICardRepository';

export class InMemoryCardRepository implements CardRepository {
  public items: Card[] = [];

  async create(card: Card): Promise<Card> {
    this.items.push(card);
    return card;
  }

  async findById(cardId: string): Promise<Card | null> {
    const card =
      this.items.find((card) => card.id.toValue() === cardId) || null;

    return card || null;
  }
}
