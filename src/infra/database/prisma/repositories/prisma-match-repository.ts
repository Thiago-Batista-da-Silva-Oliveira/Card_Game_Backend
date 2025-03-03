import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

import { MatchRepository } from '@/domain/matches/application/repositories/IMatchRepository';
import { Match } from '@/domain/matches/enterprise/entities/Match';
import { PrismaMatchMapper } from '../mappers/prisma-match-mapper';

@Injectable()
export class PrismaMatchsRepository implements MatchRepository {
  constructor(private prisma: PrismaService) {}

  async create(match: Match): Promise<Match> {
    const data = PrismaMatchMapper.toPrisma(match);
    const prismaMatch = await this.prisma.match.create({
      data,
    });
    return PrismaMatchMapper.toDomain(prismaMatch);
  }

  async findById(matchId: string): Promise<Match | null> {
    const match = await this.prisma.match.findUnique({
      where: {
        id: matchId,
      },
      include: {
        turns: true,
        playersInMatch: true,
      },
    });

    if (!match) {
      return null;
    }
    return PrismaMatchMapper.toDomain(match);
  }

  async findOpenMatchByPlayerId(playerId: string): Promise<Match | null> {
    const match = await this.prisma.match.findFirst({
      where: {
        playersInMatch: {
          some: {
            playerId,
          },
        },
        status: 'open',
      },
      include: {
        playersInMatch: true,
        turns: true,
      },
    });

    if (!match) {
      return null;
    }

    return PrismaMatchMapper.toDomain(match);
  }

  async save(match: Match): Promise<Match> {
    const data = PrismaMatchMapper.toPrisma(match);
    await this.prisma.match.update({
      where: {
        id: match.id.toString(),
      },
      data,
    });
    return match;
  }
}
