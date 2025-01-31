import { makePlayer } from '../../repositories/tests/factories/makePlayer';
import { InMemoryHashProvider } from '../../repositories/tests/InMemoryHashProvider';
import { InMemoryPlayerRepository } from '../../repositories/tests/InMemoryPlayerRepository';
import { IncorrectCredentialsError } from '../errors';
import { PlayerAlreadyExistsError } from '../errors/player-already-exists-error';
import { SessionService } from './SessionService';

let inMemoryPlayerRepository: InMemoryPlayerRepository;
let inMemoryHashRepository: InMemoryHashProvider;

let sut: SessionService;

describe('Player session', () => {
  beforeEach(() => {
    inMemoryPlayerRepository = new InMemoryPlayerRepository();
    inMemoryHashRepository = new InMemoryHashProvider();
    sut = new SessionService(inMemoryPlayerRepository, inMemoryHashRepository);
  });

  it('should be able login', async () => {
    inMemoryPlayerRepository.items.push(
      makePlayer({ email: 'Jhon@doe.com.br' }),
    );

    const result = await sut.execute({
      email: 'Jhon@doe.com.br',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
  });

  it('should not be able to login with a wrong email', async () => {
    inMemoryPlayerRepository.items.push(
      makePlayer({ email: 'Jhon@doe.com.br' }),
    );
    const result = await sut.execute({
      email: 'Jhon2@doe.com.br',
      password: '123456',
    });

    expect(result.isLeft()).toBe(true);

    expect(result.value).toBeInstanceOf(IncorrectCredentialsError);
  });

  it('should not be able to login with a wrong password', async () => {
    inMemoryPlayerRepository.items.push(
      makePlayer({ email: 'Jhon@doe.com.br' }),
    );
    const result = await sut.execute({
      email: 'Jhon@doe.com.br',
      password: '1234567',
    });

    expect(result.isLeft()).toBe(true);

    expect(result.value).toBeInstanceOf(IncorrectCredentialsError);
  });
});
