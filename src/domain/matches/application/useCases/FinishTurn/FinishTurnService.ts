import { Injectable } from '@nestjs/common';
import { MatchRepository } from '../../repositories/IMatchRepository';
import { PlayerRepository } from '@/domain/players/application/repositories';
import { Either, left, right } from '@/core/either';
import { PlayerDoesNotExistError } from '@/domain/players/application/useCases/errors';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Match } from '@/domain/matches/enterprise/entities/Match';
import { MatchDoesNotExistError } from '../errors/match-does-not-exists-error';
import { Turn, TURN_STATUS } from '@/domain/matches/enterprise/entities/Turn';
import { UniqueEntityID } from '@/core/entities/unique_entity_id';

interface IRequest {
  playerId: string;
}

type IOutput = Either<
  PlayerDoesNotExistError | NotAllowedError | MatchDoesNotExistError,
  {
    match: Match;
  }
>;

@Injectable()
export class FinishTurnService {
  constructor(
    private matchRepository: MatchRepository,
    private playerRepository: PlayerRepository,
  ) {}
  async execute({ playerId }: IRequest): Promise<IOutput> {
    const playerExists = await this.playerRepository.findById(playerId);

    if (!playerExists) {
      return left(new PlayerDoesNotExistError(playerId));
    }

    const findMatch =
      await this.matchRepository.findOpenMatchByPlayerId(playerId);

    if (!findMatch) {
      return left(new MatchDoesNotExistError(playerId));
    }

    const currentTurnIndex = findMatch.turns.findIndex(
      (data) => data.turn === findMatch.currentTurn,
    );

    if (
      currentTurnIndex === -1 ||
      findMatch.turns
        .find((turn) => turn.turn === findMatch.currentTurn)
        ?.playerId.toValue() !== playerId
    ) {
      return left(new NotAllowedError());
    }

    const newTurn = findMatch.currentTurn ? findMatch.currentTurn + 1 : 1;

    findMatch.turns[currentTurnIndex].status = TURN_STATUS.FINISHED;
    findMatch.turns = [
      ...findMatch.turns,
      Turn.create({
        matchId: findMatch.id,
        status: TURN_STATUS.MAKING_THE_PLAY,
        turn: newTurn,
        playerId:
          findMatch.playersInMatch?.find(
            (player) => player.playerId.toValue() !== playerId,
          )?.playerId || new UniqueEntityID(),
      }),
    ];
    findMatch.currentTurn = newTurn;
    await this.matchRepository.save(findMatch);

    return right({
      match: findMatch,
    });
  }
}
