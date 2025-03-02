import { InMemoryPlayerRepository } from '@/domain/players/application/repositories/tests/InMemoryPlayerRepository';
import { InMemoryMatchRepository } from '../../repositories/tests/InMemoryMatchRepository';
import { makePlayer } from '@/domain/players/application/repositories/tests/factories/makePlayer';
import { FinishTurnService } from './FinishTurnService';
import { makeMatch } from '../../repositories/tests/factories/makeMatch';
import { Turn, TURN_STATUS } from '@/domain/matches/enterprise/entities/Turn';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { PlayersInMatchWatchedList } from '@/domain/matches/enterprise/entities/PlayersInMatchList';
import { PlayersInMatch } from '@/domain/matches/enterprise/entities/PlayersInMatch';
import { TurnWatchedList } from '@/domain/matches/enterprise/entities/TurnList';
import { TurnHistoryWatchedList } from '@/domain/matches/enterprise/entities/TurnHistoryList';

let inMemoryPlayerRepository: InMemoryPlayerRepository;
let inMemoryMatchRepository: InMemoryMatchRepository;

let sut: FinishTurnService;

describe('Finish turn', () => {
  beforeEach(() => {
    inMemoryPlayerRepository = new InMemoryPlayerRepository();
    inMemoryMatchRepository = new InMemoryMatchRepository();
    sut = new FinishTurnService(
      inMemoryMatchRepository,
      inMemoryPlayerRepository,
    );
  });

  it('should be able to finish a turn', async () => {
    const player1 = makePlayer({ email: 'Jhon@doe1.com.br' });
    const player2 = makePlayer({ email: 'Jhon@doe2.com.br' });

    inMemoryPlayerRepository.items.push(player1);
    inMemoryPlayerRepository.items.push(player2);

    const match = makeMatch();

    const playersInMatchWatchedList = new PlayersInMatchWatchedList();
    playersInMatchWatchedList.add(
      PlayersInMatch.create({
        matchId: match.id,
        playerId: player1.id,
      }),
    );
    playersInMatchWatchedList.add(
      PlayersInMatch.create({
        matchId: match.id,
        playerId: player2.id,
      }),
    );

    match.playersInMatch = playersInMatchWatchedList;
    const turnsWatchedList = new TurnWatchedList();
    turnsWatchedList.add(
      Turn.create({
        matchId: match.id,
        playerId: player1.id,
        status: TURN_STATUS.MAKING_THE_PLAY,
        turn: 1,
        historic: new TurnHistoryWatchedList(),
      }),
    );

    match.turns = turnsWatchedList;

    inMemoryMatchRepository.items.push(match);

    const result = await sut.execute({
      playerId: player1.id.toValue(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryMatchRepository.items[0].currentTurn).toBe(2);
    expect(inMemoryMatchRepository.items[0].turns?.getItems().length).toBe(2);
  });

  it('should not be able to finish a turn that is not yours', async () => {
    const player1 = makePlayer({ email: 'Jhon@doe1.com.br' });
    const player2 = makePlayer({ email: 'Jhon@doe2.com.br' });

    inMemoryPlayerRepository.items.push(player1);
    inMemoryPlayerRepository.items.push(player2);

    const match = makeMatch();

    const playersInMatchWatchedList = new PlayersInMatchWatchedList();
    playersInMatchWatchedList.add(
      PlayersInMatch.create({
        matchId: match.id,
        playerId: player1.id,
      }),
    );
    playersInMatchWatchedList.add(
      PlayersInMatch.create({
        matchId: match.id,
        playerId: player2.id,
      }),
    );

    match.playersInMatch = playersInMatchWatchedList;
    const turnsWatchedList = new TurnWatchedList();
    turnsWatchedList.add(
      Turn.create({
        matchId: match.id,
        playerId: player1.id,
        status: TURN_STATUS.MAKING_THE_PLAY,
        turn: 1,
        historic: new TurnHistoryWatchedList(),
      }),
    );

    match.turns = turnsWatchedList;

    inMemoryMatchRepository.items.push(match);

    const result = await sut.execute({
      playerId: player2.id.toValue(),
    });

    expect(result.isRight()).toBe(false);

    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
