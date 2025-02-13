import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { PlayerRepository } from '@/domain/players/application/repositories';
import { PlayerDoesNotExistError } from '@/domain/players/application/useCases/errors';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { MatchRepository } from '../../repositories/IMatchRepository';
import { Match } from '@/domain/matches/enterprise/entities/Match';
import { MatchDoesNotExistError } from '../errors/match-does-not-exists-error';
import { CardRepository } from '@/domain/cards/application/repositories';
import { CardDoesNotExistsError } from '@/domain/cards/application/useCases/errors/card-does-not-exists';
import { UniqueEntityID } from '@/core/entities/unique_entity_id';
import {
  ACTION,
  MatchHistory,
} from '@/domain/matches/enterprise/entities/MatchHistory';

interface IRequest {
  playerId: string;
  matchId: string;
  cardId: string;
  position: number;
}

type IOutput = Either<
  | PlayerDoesNotExistError
  | NotAllowedError
  | MatchDoesNotExistError
  | CardDoesNotExistsError,
  {
    match: Match;
  }
>;

@Injectable()
export class PlaceACardService {
  constructor(
    private matchRepository: MatchRepository,
    private playerRepository: PlayerRepository,
    private cardRepository: CardRepository,
  ) {}
  async execute({
    playerId,
    matchId,
    cardId,
    position,
  }: IRequest): Promise<IOutput> {
    const player = await this.playerRepository.findById(playerId);

    if (!player) {
      return left(new PlayerDoesNotExistError(playerId));
    }

    const match = await this.matchRepository.findById(matchId);

    if (!match || match.status === 'finished' || !match.playersInMatch) {
      return left(new MatchDoesNotExistError(matchId));
    }
    const playerInMatch = match.playersInMatch?.find(
      (player) => player.playerId.toValue() === playerId,
    );

    if (!playerInMatch) {
      return left(new NotAllowedError());
    }
    const card = await this.cardRepository.findById(cardId);

    if (!card) {
      return left(new CardDoesNotExistsError());
    }

    const currentTurnIndex = match.turns?.findIndex(
      (data) => data.turn === match.currentTurn,
    );

    const playerInMatchIndex = match.playersInMatch?.findIndex(
      (player) => player.playerId.toValue() === playerId,
    );

    if (playerInMatchIndex === undefined || playerInMatchIndex === -1) {
      return left(new NotAllowedError());
    }

    if (currentTurnIndex === undefined || currentTurnIndex === -1) {
      return left(new NotAllowedError());
    }

    const updatedPlayer = {
      ...match.playersInMatch[playerInMatchIndex],
      currentCardsState: [
        ...(match.playersInMatch[playerInMatchIndex].currentCardsState || []),
        {
          cardId: new UniqueEntityID(cardId),
          position,
        },
      ],
    };

    match.playersInMatch[playerInMatchIndex] = updatedPlayer;

    const updatedTurn = {
      ...match.turns[currentTurnIndex],
      historic: [
        ...(match.turns[currentTurnIndex].historic || []),
        MatchHistory.create({
          matchId: new UniqueEntityID(matchId),
          playerId: new UniqueEntityID(playerId),
          action: ACTION.SUMMON,
          actionDescription: {
            position,
            cardId: new UniqueEntityID(cardId),
            playerId: new UniqueEntityID(playerId),
          },
        }),
      ],
    };

    match.turns[currentTurnIndex] = updatedTurn;

    await this.matchRepository.save(match);

    return right({ match });
  }
}
