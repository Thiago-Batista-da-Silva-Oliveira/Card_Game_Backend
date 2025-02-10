import { Card } from '../../enterprise/entities/Card';

export abstract class CardRepository {
  abstract create(card: Card): Promise<Card>;
  abstract findById(cardId: string): Promise<Card | null>;
}
