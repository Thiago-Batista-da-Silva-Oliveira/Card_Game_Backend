import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { PlayerRepository } from '@/domain/players/application/repositories';
import { PlayerDoesNotExistError } from '@/domain/players/application/useCases/errors';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { MatchRepository } from '../../repositories/IMatchRepository';
import { Match } from '@/domain/matches/enterprise/entities/Match';
import { UniqueEntityID } from '@/core/entities/unique_entity_id';
import { Turn, TURN_STATUS } from '@/domain/matches/enterprise/entities/Turn';
import { PlayersInMatch } from '@/domain/matches/enterprise/entities/PlayersInMatch';
import { PlayersInMatchWatchedList } from '@/domain/matches/enterprise/entities/PlayersInMatchList';
import { TurnWatchedList } from '@/domain/matches/enterprise/entities/TurnList';
import { MatchHistoryWatchedList } from '@/domain/matches/enterprise/entities/MatchHistoryList';

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

    const match = Match.create({});

    const matchHasPlayers = new PlayersInMatchWatchedList([]);

    const createPlayersInMatch = playersIds.map((playerId) =>
      PlayersInMatch.create({
        matchId: match.id,
        playerId: new UniqueEntityID(playerId),
      }),
    );

    matchHasPlayers.update(createPlayersInMatch);

    match.playersInMatch = matchHasPlayers;

    const matchTurn = new TurnWatchedList();

    matchTurn.add(
      Turn.create({
        matchId: match.id,
        playerId: new UniqueEntityID(playersIds[0]),
        status: TURN_STATUS.MAKING_THE_PLAY,
        turn: 1,
        historic: new MatchHistoryWatchedList(),
      }),
    );

    match.turns = matchTurn;

    const createdMatch = await this.matchRepository.create(match);
    return right({ match: createdMatch });
  }
}
