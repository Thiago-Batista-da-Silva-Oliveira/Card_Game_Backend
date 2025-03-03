/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { UniqueEntityID } from '@/core/entities/unique_entity_id';
import { Deck } from '@/domain/cards/enterprise/entities/Deck';
import { CurrentCardState } from '@/domain/matches/enterprise/entities/CurrentCardState';
import { CurrentCardStateWatchedList } from '@/domain/matches/enterprise/entities/CurrentCardStateList';
import { Match } from '@/domain/matches/enterprise/entities/Match';
import { PlayersInMatch } from '@/domain/matches/enterprise/entities/PlayersInMatch';
import { PlayersInMatchWatchedList } from '@/domain/matches/enterprise/entities/PlayersInMatchList';
import { Turn, TURN_STATUS } from '@/domain/matches/enterprise/entities/Turn';
import { TurnHistory } from '@/domain/matches/enterprise/entities/TurnHistory';
import { TurnHistoryWatchedList } from '@/domain/matches/enterprise/entities/TurnHistoryList';
import { TurnWatchedList } from '@/domain/matches/enterprise/entities/TurnList';
import {
  Match as PrismaMatch,
  Prisma,
  PlayersInMatch as PrismaPlayersInMatch,
  Turn as PrismaTurn,
  CurrentCardState as PrismaCurrentCardState,
  TurnHistory as PrismaTurnHistory,
} from '@prisma/client';

type PrismaPlayersInMatchWithRelations = PrismaPlayersInMatch & {
  currentCardsState?: PrismaCurrentCardState[];
};

type PrismaTurnWithRelations = PrismaTurn & {
  turnHistory?: PrismaTurnHistory[];
};

type PrismaMatchWithRelations = PrismaMatch & {
  playersInMatch?: PrismaPlayersInMatchWithRelations[];
  turns?: PrismaTurnWithRelations[];
};

export class PrismaMatchMapper {
  static toDomain(raw: PrismaMatchWithRelations): Match {
    return Match.create(
      {
        winnerId: raw.winnerId ? new UniqueEntityID(raw.winnerId) : undefined,
        finishedAt: raw.finishedAt ? new Date(raw.finishedAt) : undefined,
        status: raw.status,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        playersInMatch: new PlayersInMatchWatchedList(
          raw.playersInMatch?.map((data) =>
            PlayersInMatch.create({
              matchId: new UniqueEntityID(data.matchId),
              playerId: new UniqueEntityID(data.playerId),
              life: data.life,
              remainingCardsInDeck: data.remainingCardsInDeck,
              currentCardsState: new CurrentCardStateWatchedList(
                data.currentCardsState?.map((currentCard) =>
                  CurrentCardState.create({
                    cardId: new UniqueEntityID(currentCard.cardId),
                    playerId: new UniqueEntityID(currentCard.playerId),
                    position: currentCard.position,
                    attackModification: currentCard.attackModification ?? 0,
                    deffenseModification: currentCard.deffenseModification ?? 0,
                  }),
                ),
              ),
            }),
          ) || [],
        ),
        currentTurn: raw.currentTurn ?? 0,
        turns: new TurnWatchedList(
          raw.turns?.map((data) =>
            Turn.create({
              matchId: new UniqueEntityID(data.matchId),
              turn: data.turn,
              playerId: new UniqueEntityID(data.playerId),
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
              status: data.status as TURN_STATUS,
              historic: new TurnHistoryWatchedList(
                data.turnHistory?.map((turnHistory) =>
                  TurnHistory.create({
                    turnId: new UniqueEntityID(turnHistory.turnId),
                    playerId: new UniqueEntityID(turnHistory.playerId),
                    action: turnHistory.action as any,
                    createdAt: turnHistory.createdAt,
                    updatedAt: turnHistory.updatedAt,
                    actionDescription: turnHistory.actionDescription as any,
                    actionResult: turnHistory.actionResult as any,
                  }),
                ),
              ),
            }),
          ) || [],
        ),
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(match: Match): Prisma.MatchUncheckedCreateInput {
    return {
      winnerId: match.winnerId?.toString(),
      status: match.status as any,
      finishedAt: match.finishedAt ? new Date(match.finishedAt) : undefined,
      createdAt: match.createdAt,
      updatedAt: new Date(),
      currentTurn: match.currentTurn ?? 0,
      playersInMatch: {
        create: match.playersInMatch?.getNewItems().map((player) => ({
          playerId: player.playerId.toString(),
          life: player.life,
          remainingCardsInDeck: player.remainingCardsInDeck,
          currentCardsState: {
            create: player.currentCardsState?.getNewItems().map((card) => ({
              cardId: card.cardId.toString(),
              playerId: card.playerId.toString(),
              position: card.position,
              attackModification: card.attackModification,
              deffenseModification: card.deffenseModification,
            })),
          },
        })),
      },
      turns: {
        create: match.turns?.getNewItems().map((turn) => ({
          turn: turn.turn,
          playerId: turn.playerId.toString(),
          createdAt: turn.createdAt,
          updatedAt: turn.updatedAt,
          status: turn.status as any,
          turnHistory: {
            create: turn.historic?.getNewItems().map((history) => ({
              playerId: history.playerId.toString(),
              action: history.action as any,
              actionDescription: history.actionDescription as any,
              actionResult: history.actionResult as any,
              createdAt: history.createdAt,
              updatedAt: history.updatedAt,
            })),
          },
        })),
      },
      id: match.id.toString(),
    };
  }
}
