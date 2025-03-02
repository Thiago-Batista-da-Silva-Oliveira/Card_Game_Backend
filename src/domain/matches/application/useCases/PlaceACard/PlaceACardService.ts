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
  TurnHistory,
} from '@/domain/matches/enterprise/entities/TurnHistory';
import { CurrentCardState } from '@/domain/matches/enterprise/entities/CurrentCardState';
import { CurrentCardStateWatchedList } from '@/domain/matches/enterprise/entities/CurrentCardStateList';
import { TurnHistoryWatchedList } from '@/domain/matches/enterprise/entities/TurnHistoryList';

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
    } //

    const playerInMatch = match.playersInMatch
      ?.getItems()
      .find((p) => p.playerId.equals(new UniqueEntityID(playerId)));
    if (!playerInMatch) {
      return left(new NotAllowedError());
    }

    if (!playerInMatch.currentCardsState) {
      playerInMatch.currentCardsState = new CurrentCardStateWatchedList([]);
    }

    playerInMatch.currentCardsState?.add(
      CurrentCardState.create({
        playerId: new UniqueEntityID(playerId),
        cardId: new UniqueEntityID(cardId),
        position,
      }),
    );

    match.playersInMatch?.update(match.playersInMatch.getItems());

    const card = await this.cardRepository.findById(cardId);

    if (!card) {
      return left(new CardDoesNotExistsError());
    }

    const currentTurn = match.turns
      ?.getItems()
      .find((t) => t.turn === match.currentTurn);
    if (!currentTurn) {
      return left(new NotAllowedError());
    }

    if (!currentTurn.historic) {
      currentTurn.historic = new TurnHistoryWatchedList([]);
    }

    currentTurn.historic?.add(
      TurnHistory.create({
        turnId: new UniqueEntityID(currentTurn.id.toString()),
        playerId: new UniqueEntityID(playerId),
        action: ACTION.SUMMON,
        actionDescription: {
          type: ACTION.SUMMON,
          position,
          cardId: new UniqueEntityID(cardId),
          playerId: new UniqueEntityID(playerId),
        },
      }),
    );

    match.turns?.update(match.turns.getItems());

    await this.matchRepository.save(match);

    return right({ match });
  }
}
