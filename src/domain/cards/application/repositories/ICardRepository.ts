import { Card } from '../../enterprise/entities/Card';

export abstract class CardRepository {
  abstract create(card: Card): Promise<Card>;
}
