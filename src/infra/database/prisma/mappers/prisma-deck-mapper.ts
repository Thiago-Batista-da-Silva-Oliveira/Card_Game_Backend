import { UniqueEntityID } from '@/core/entities/unique_entity_id';
import { Deck } from '@/domain/cards/enterprise/entities/Deck';
import { DeckHasCards } from '@/domain/cards/enterprise/entities/DeckHasCards';
import { DeckHasCardWatchedList } from '@/domain/cards/enterprise/entities/DeckHasCardsWatchedList';
import {
  Deck as PrismaDeck,
  Prisma,
  DeckHasCard as PrismaDeckHasCard,
} from '@prisma/client';

type PrismaDeckWithRelations = PrismaDeck & {
  deckHasCards?: PrismaDeckHasCard[];
};

export class PrismaDeckMapper {
  static toDomain(raw: PrismaDeckWithRelations): Deck {
    return Deck.create(
      {
        name: raw.name,
        playerId: new UniqueEntityID(raw.playerId),
        deckHasCards: new DeckHasCardWatchedList(
          raw.deckHasCards?.map((data) =>
            DeckHasCards.create({
              cardId: new UniqueEntityID(data.cardId),
              deckId: new UniqueEntityID(data.deckId),
            }),
          ) || [],
        ),
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(deck: Deck): Prisma.DeckUncheckedCreateInput {
    return {
      name: deck.name,
      playerId: deck.playerId.toValue(),
      createdAt: deck.createdAt,
      updatedAt: new Date(),
      deckHasCards: {
        create: deck.deckHasCards.getNewItems().map((data) => ({
          cardId: data.cardId.toValue(),
          deckId: data.deckId.toValue(),
        })),
      },
      id: deck.id.toString(),
    };
  }
}
