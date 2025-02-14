import { InMemoryPlayerRepository } from '@/domain/players/application/repositories/tests/InMemoryPlayerRepository';
import { InMemoryMatchRepository } from '../../repositories/tests/InMemoryMatchRepository';
import { makePlayer } from '@/domain/players/application/repositories/tests/factories/makePlayer';
import { FinishTurnService } from './FinishTurnService';
import { makeMatch } from '../../repositories/tests/factories/makeMatch';
import { TURN_STATUS } from '@/domain/matches/enterprise/entities/Turn';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

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

    match.playersInMatch = [
      {
        matchId: match.id,
        playerId: player1.id,
      },
      {
        matchId: match.id,
        playerId: player2.id,
      },
    ];
    match.turns = [
      {
        matchId: match.id,
        playerId: player1.id,
        status: TURN_STATUS.MAKING_THE_PLAY,
        turn: 1,
        historic: [],
      },
    ];

    inMemoryMatchRepository.items.push(match);

    const result = await sut.execute({
      playerId: player1.id.toValue(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryMatchRepository.items[0].currentTurn).toBe(2);
    expect(inMemoryMatchRepository.items[0].turns.length).toBe(2);
  });

  it('should not be able to finish a turn that is not yours', async () => {
    const player1 = makePlayer({ email: 'Jhon@doe1.com.br' });
    const player2 = makePlayer({ email: 'Jhon@doe2.com.br' });

    inMemoryPlayerRepository.items.push(player1);
    inMemoryPlayerRepository.items.push(player2);

    const match = makeMatch();

    match.playersInMatch = [
      {
        matchId: match.id,
        playerId: player1.id,
      },
      {
        matchId: match.id,
        playerId: player2.id,
      },
    ];
    match.turns = [
      {
        matchId: match.id,
        playerId: player1.id,
        status: TURN_STATUS.MAKING_THE_PLAY,
        turn: 1,
        historic: [],
      },
    ];

    inMemoryMatchRepository.items.push(match);

    const result = await sut.execute({
      playerId: player2.id.toValue(),
    });

    expect(result.isRight()).toBe(false);

    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
