import { InMemoryPlayerRepository } from '@/domain/players/application/repositories/tests/InMemoryPlayerRepository';
import { makePlayer } from '@/domain/players/application/repositories/tests/factories/makePlayer';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { InMemoryDeckRepository } from '../../repositories/tests/InMemoryDeckRepository';
import { CreateDeckService } from './CreateDeckService';
import { DeckAlreadyExistsError } from '../errors/deck-already-exists';
import { makeDeck } from '../../repositories/tests/factories/makeDeck';

let inMemoryDeckRepository: InMemoryDeckRepository;
let inMemoryPlayerRepository: InMemoryPlayerRepository;
let sut: CreateDeckService;

describe('Create Deck', () => {
  beforeEach(() => {
    inMemoryDeckRepository = new InMemoryDeckRepository();
    inMemoryPlayerRepository = new InMemoryPlayerRepository();
    sut = new CreateDeckService(
      inMemoryDeckRepository,
      inMemoryPlayerRepository,
    );
  });

  it('should be able to create a deck', async () => {
    const player = makePlayer({
      accessType: 'player',
    });
    inMemoryPlayerRepository.items.push(player);
    const result = await sut.execute({
      name: 'Paladin',
      playerId: player.id.toValue(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      deck: inMemoryDeckRepository.items[0],
    });
  });

  it('should not be able to create a deck with a repeated name', async () => {
    const player = makePlayer({
      accessType: 'player',
    });
    const createDeck = makeDeck({
      name: 'Paladin',
      playerId: player.id,
    });
    inMemoryPlayerRepository.items.push(player);
    inMemoryDeckRepository.items.push(createDeck);
    const result = await sut.execute({
      name: 'Paladin',
      playerId: player.id.toValue(),
    });

    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(DeckAlreadyExistsError);
  });
});
