import { UniqueEntityID } from '@/core/entities/unique_entity_id';
import { Card } from '@/domain/cards/enterprise/entities/Card';
import { Card as PrismaCard, Prisma } from '@prisma/client';

export class PrismaCardMapper {
  static toDomain(raw: PrismaCard): Card {
    return Card.create(
      {
        name: raw.name,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(card: Card): Prisma.CardUncheckedCreateInput {
    return {
      name: card.name,
      createdAt: card.createdAt,
      updatedAt: new Date(),
      id: card.id.toString(),
    };
  }
}
