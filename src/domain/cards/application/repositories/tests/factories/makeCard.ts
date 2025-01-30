import { UniqueEntityID } from 'src/core/entities/unique_entity_id';
import { Card, CardProps } from 'src/domain/cards/enterprise/entities/Card';

export function makeCard(
  override: Partial<CardProps> = {},
  id?: UniqueEntityID,
) {
  const card = Card.create(
    {
      name: 'Paladin',
      ...override,
    },
    id,
  );

  return card;
}
