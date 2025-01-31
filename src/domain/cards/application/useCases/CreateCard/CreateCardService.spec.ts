import { InMemoryPlayerRepository } from '@/domain/players/application/repositories/tests/InMemoryPlayerRepository';
import { InMemoryCardRepository } from '../../repositories/tests/InMemoryCardRepository';
import { CreateCardService } from './CreateCardService';
import { makePlayer } from '@/domain/players/application/repositories/tests/factories/makePlayer';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

let inMemoryCardRepository: InMemoryCardRepository;
let inMemoryPlayerRepository: InMemoryPlayerRepository;
let sut: CreateCardService;

describe('Create Card', () => {
  beforeEach(() => {
    inMemoryCardRepository = new InMemoryCardRepository();
    inMemoryPlayerRepository = new InMemoryPlayerRepository();
    sut = new CreateCardService(
      inMemoryCardRepository,
      inMemoryPlayerRepository,
    );
  });

  it('should be able to create a card', async () => {
    const player = makePlayer({
      accessType: 'admin',
    });
    inMemoryPlayerRepository.items.push(player);
    const result = await sut.execute({
      name: 'Paladin',
      userId: player.id.toValue(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      card: inMemoryCardRepository.items[0],
    });
  });

  it('should not be able to create a card as a not admin player', async () => {
    const player = makePlayer({
      accessType: 'player',
    });
    inMemoryPlayerRepository.items.push(player);
    const result = await sut.execute({
      name: 'Paladin',
      userId: player.id.toValue(),
    });

    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
