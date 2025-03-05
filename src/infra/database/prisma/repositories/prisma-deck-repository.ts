import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

import { DeckRepository } from '@/domain/cards/application/repositories/IDeckRepository';
import { Deck } from '@/domain/cards/enterprise/entities/Deck';
import { PrismaDeckMapper } from '../mappers/prisma-deck-mapper';
import { DeckHasCards } from '@/domain/cards/enterprise/entities/DeckHasCards';
import { UniqueEntityID } from '@/core/entities/unique_entity_id';

@Injectable()
export class PrismaDecksRepository implements DeckRepository {
  constructor(private prisma: PrismaService) {}

  async create(deck: Deck): Promise<Deck> {
    const data = PrismaDeckMapper.toPrisma(deck);
    const prismaDeck = await this.prisma.deck.create({
      data,
    });
    return PrismaDeckMapper.toDomain(prismaDeck);
  }

  async addCardsToDeck(deckId: string, cards: string[]): Promise<void> {
    await this.prisma.deckHasCard.createMany({
      data: cards.map((cardId) => ({
        cardId,
        deckId,
      })),
    });
  }

  async findDeckById(id: string): Promise<Deck | null> {
    const deck = await this.prisma.deck.findUnique({
      where: {
        id,
      },
      include: {
        deckHasCards: true,
      },
    });

    if (!deck) {
      return null;
    }

    return PrismaDeckMapper.toDomain(deck);
  }

  async findExistingDeck(playerId: string, name: string): Promise<boolean> {
    const existingDeck = await this.prisma.deck.findFirst({
      where: {
        playerId,
        name,
      },
    });

    return !!existingDeck;
  }

  async findManyCardsByDeckId(id: string): Promise<DeckHasCards[]> {
    const cards = await this.prisma.deckHasCard.findMany({
      where: {
        deckId: id,
      },
    });

    return cards.map((card) => {
      return DeckHasCards.create({
        cardId: new UniqueEntityID(card.cardId),
        deckId: new UniqueEntityID(card.deckId),
      });
    });
  }

  async removeCardsFromDeck(deckId: string, cards: string[]): Promise<void> {
    await this.prisma.deckHasCard.deleteMany({
      where: {
        deckId,
        cardId: {
          in: cards,
        },
      },
    });
  }

  async save(deck: Deck): Promise<Deck> {
    const data = PrismaDeckMapper.toPrisma(deck);
    await this.prisma.deck.update({
      where: { id: deck.id.toString() },
      data: {
        ...data,
        deckHasCards: {
          deleteMany: deck.deckHasCards.getRemovedItems().map((data) => ({
            cardId: data.cardId.toValue(),
            deckId: data.deckId.toValue(),
          })),
          createMany: {
            data: deck.deckHasCards.getNewItems().map((data) => ({
              cardId: data.cardId.toValue(),
              deckId: data.deckId.toValue(),
            })),
          },
        },
      },
    });

    return deck;
  }
}
