import { makePlayer } from '../../repositories/tests/factories/makePlayer';
import { InMemoryHashProvider } from '../../repositories/tests/InMemoryHashProvider';
import { InMemoryPlayerRepository } from '../../repositories/tests/InMemoryPlayerRepository';
import { PlayerAlreadyExistsError } from '../errors/player-already-exists-error';
import { RegisterPlayerService } from './RegisterPlayerService';

let inMemoryPlayerRepository: InMemoryPlayerRepository;
let inMemoryHashRepository: InMemoryHashProvider;

let sut: RegisterPlayerService;

describe('Register Player', () => {
  beforeEach(() => {
    inMemoryPlayerRepository = new InMemoryPlayerRepository();
    inMemoryHashRepository = new InMemoryHashProvider();
    sut = new RegisterPlayerService(
      inMemoryPlayerRepository,
      inMemoryHashRepository,
    );
  });

  it('should be able to register a player', async () => {
    const result = await sut.execute({
      email: 'joe@doe.com.br',
      name: 'Joe Doe',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      player: inMemoryPlayerRepository.items[0],
    });
  });

  it('should not be able to register a already register player', async () => {
    inMemoryPlayerRepository.items.push(
      makePlayer({ email: 'Jhon@doe.com.br' }),
    );
    const result = await sut.execute({
      email: 'Jhon@doe.com.br',
      name: 'Joe Doe',
      password: '123456',
    });

    expect(result.isLeft()).toBe(true);

    expect(result.value).toBeInstanceOf(PlayerAlreadyExistsError);
  });
});
