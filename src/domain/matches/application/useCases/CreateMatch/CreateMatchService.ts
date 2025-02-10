import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { PlayerRepository } from '@/domain/players/application/repositories';
import { PlayerDoesNotExistError } from '@/domain/players/application/useCases/errors';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { MatchRepository } from '../../repositories/IMatchRepository';
import { Match } from '@/domain/matches/enterprise/entities/Match';
import { UniqueEntityID } from '@/core/entities/unique_entity_id';

interface IRequest {
  playersIds: string[];
}

type IOutput = Either<
  PlayerDoesNotExistError | NotAllowedError,
  {
    match: Match;
  }
>;

@Injectable()
export class CreateMatchService {
  constructor(
    private matchRepository: MatchRepository,
    private playerRepository: PlayerRepository,
  ) {}
  async execute({ playersIds }: IRequest): Promise<IOutput> {
    for (let i = 0; i < playersIds.length; i++) {
      const player = await this.playerRepository.findById(playersIds[i]);

      if (!player) {
        return left(new PlayerDoesNotExistError(playersIds[i]));
      }
    }

    const match = Match.create({
      playersInMatchProps: [],
    });

    match.playersInMatchProps = playersIds.map((playerId) => ({
      matchId: match.id,
      playerId: new UniqueEntityID(playerId),
    }));
    const createdMatch = await this.matchRepository.create(match);
    return right({ match: createdMatch });
  }
}
