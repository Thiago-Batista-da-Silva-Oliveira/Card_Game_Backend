/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
      where: { id: match.id.toString() },
      data: {
        ...data,
        playersInMatch: {
          deleteMany: match?.playersInMatch
            ?.getRemovedItems()
            .map((player) => ({
              playerId: player.playerId.toString(),
            })),
          createMany: {
            data:
              match?.playersInMatch?.getNewItems().map((player) => ({
                playerId: player.playerId.toString(),
                life: player.life,
                remainingCardsInDeck: player.remainingCardsInDeck,
                currentCardsState: {
                  deleteMany: player?.currentCardsState
                    ?.getRemovedItems()
                    .map((card) => ({
                      cardId: card.cardId.toString(),
                      playerId: card.playerId.toString(),
                    })),
                  createMany: {
                    data: player?.currentCardsState
                      ?.getNewItems()
                      .map((card) => ({
                        cardId: card.cardId.toString(),
                        playerId: card.playerId.toString(),
                        position: card.position,
                        attackModification: card.attackModification,
                        deffenseModification: card.deffenseModification,
                      })),
                  },
                },
              })) || [],
          },
        },
        turns: {
          deleteMany: match?.turns?.getRemovedItems()?.map((turn) => ({
            turn: turn.turn,
          })),
          createMany: {
            data:
              match.turns?.getNewItems()?.map((turn) => ({
                turn: turn.turn,
                playerId: turn.playerId.toString(),
                createdAt: turn.createdAt,
                updatedAt: turn.updatedAt,
                status: turn.status as any,
                turnHistory: {
                  createMany: {
                    data: turn.historic?.getNewItems()?.map((history) => ({
                      playerId: history.playerId.toString(),
                      action: history.action as any,
                      actionDescription: history.actionDescription as any,
                      actionResult: history.actionResult as any,
                      createdAt: history.createdAt,
                      updatedAt: history.updatedAt,
                    })),
                  },
                },
              })) || [],
          },
        },
      },
    });

    return match;
  }
}
