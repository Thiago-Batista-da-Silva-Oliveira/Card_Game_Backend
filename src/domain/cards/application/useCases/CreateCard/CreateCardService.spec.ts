import { InMemoryCardRepository } from '../../repositories/tests/InMemoryCardRepository';
import { CreateCardService } from './CreateCardService';

let inMemoryCardRepository: InMemoryCardRepository;
let sut: CreateCardService;

describe('Create Card', () => {
  beforeEach(() => {
    inMemoryCardRepository = new InMemoryCardRepository();
    sut = new CreateCardService(inMemoryCardRepository);
  });

  it('should be able to create a card', async () => {
    const result = await sut.execute({
      name: 'Paladin',
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryCardRepository.items[0].name).toEqual(
      result.value?.card.name,
    );
  });
});
