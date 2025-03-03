import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

import { CardRepository } from '@/domain/cards/application/repositories';
import { Card } from '@/domain/cards/enterprise/entities/Card';
import { PrismaCardMapper } from '../mappers/prisma-card-mapper';

@Injectable()
export class PrismaCardsRepository implements CardRepository {
  constructor(private prisma: PrismaService) {}

  async create(card: Card): Promise<Card> {
    const data = PrismaCardMapper.toPrisma(card);
    const prismaCard = await this.prisma.card.create({
      data,
    });
    return PrismaCardMapper.toDomain(prismaCard);
  }

  async findById(cardId: string): Promise<Card | null> {
    const card = await this.prisma.card.findUnique({
      where: {
        id: cardId,
      },
    });

    if (!card) {
      return null;
    }
    return PrismaCardMapper.toDomain(card);
  }
}
