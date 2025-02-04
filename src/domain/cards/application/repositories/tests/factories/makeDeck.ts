import { Deck, DeckProps } from '@/domain/cards/enterprise/entities/Deck';
import { UniqueEntityID } from 'src/core/entities/unique_entity_id';

export function makeDeck(
  override: Partial<DeckProps> = {},
  id?: UniqueEntityID,
) {
  const deck = Deck.create(
    {
      name: 'Paladin deck',
      playerId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return deck;
}
