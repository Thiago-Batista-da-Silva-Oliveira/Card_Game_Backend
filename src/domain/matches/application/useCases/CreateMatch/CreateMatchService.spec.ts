import { InMemoryPlayerRepository } from '@/domain/players/application/repositories/tests/InMemoryPlayerRepository';
import { InMemoryMatchRepository } from '../../repositories/tests/InMemoryMatchRepository';
import { CreateMatchService } from './CreateMatchService';
import { makePlayer } from '@/domain/players/application/repositories/tests/factories/makePlayer';
import { PlayerDoesNotExistError } from '@/domain/players/application/useCases/errors';

let inMemoryPlayerRepository: InMemoryPlayerRepository;
let inMemoryMatchRepository: InMemoryMatchRepository;

let sut: CreateMatchService;

describe('Create Match', () => {
  beforeEach(() => {
    inMemoryPlayerRepository = new InMemoryPlayerRepository();
    inMemoryMatchRepository = new InMemoryMatchRepository();
    sut = new CreateMatchService(
      inMemoryMatchRepository,
      inMemoryPlayerRepository,
    );
  });

  it('should be able to create a match', async () => {
    const player1 = makePlayer({ email: 'Jhon@doe1.com.br' });
    const player2 = makePlayer({ email: 'Jhon@doe2.com.br' });

    inMemoryPlayerRepository.items.push(player1);
    inMemoryPlayerRepository.items.push(player2);

    const result = await sut.execute({
      playersIds: [player1.id.toValue(), player2.id.toValue()],
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      match: inMemoryMatchRepository.items[0],
    });
    expect(
      inMemoryMatchRepository.items[0].playersInMatch?.currentItems?.length,
    ).toBe(2);
  });

  it('should not be able to create a match with invalid player ids', async () => {
    const player1 = makePlayer({ email: 'Jhon@doe1.com.br' });
    const player2 = makePlayer({ email: 'Jhon@doe2.com.br' });

    inMemoryPlayerRepository.items.push(player1);
    inMemoryPlayerRepository.items.push(player2);

    const result = await sut.execute({
      playersIds: [player1.id.toValue(), 'invalid id'],
    });

    expect(result.isRight()).toBe(false);

    expect(result.value).toBeInstanceOf(PlayerDoesNotExistError);
  });
});
