import { makePlayer } from '../../repositories/tests/factories/makePlayer';
import { InMemoryPlayerRepository } from '../../repositories/tests/InMemoryPlayerRepository';
import { PlayerDoesNotExistError } from '../errors';
import { GetPlayerByIdService } from './GetPlayerByIdService';

let inMemoryPlayerRepository: InMemoryPlayerRepository;

let sut: GetPlayerByIdService;

describe('Get Player', () => {
  beforeEach(() => {
    inMemoryPlayerRepository = new InMemoryPlayerRepository();
    sut = new GetPlayerByIdService(inMemoryPlayerRepository);
  });

  it('should be able to get a player', async () => {
    const player = makePlayer({ email: 'Jhon@doe.com.br' });
    inMemoryPlayerRepository.items.push(player);

    const result = await sut.execute({ id: player.id.toValue() });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      player: inMemoryPlayerRepository.items[0],
    });
  });

  it('should not be able to get a player with a invalid id', async () => {
    const result = await sut.execute({
      id: 'invalid-id',
    });

    expect(result.isLeft()).toBe(true);

    expect(result.value).toBeInstanceOf(PlayerDoesNotExistError);
  });
});
