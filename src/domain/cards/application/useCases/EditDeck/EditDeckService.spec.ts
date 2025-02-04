import { makePlayer } from '@/domain/players/application/repositories/tests/factories/makePlayer';
import { InMemoryDeckRepository } from '../../repositories/tests/InMemoryDeckRepository';
import { makeDeck } from '../../repositories/tests/factories/makeDeck';
import { EditDeckService } from './EditDeckService';
import { makeCard } from '../../repositories/tests/factories/makeCard';
import { Card } from '@/domain/cards/enterprise/entities/Card';
import { DeckHasCards } from '@/domain/cards/enterprise/entities/DeckHasCards';
import { DeckHasCardWatchedList } from '@/domain/cards/enterprise/entities/DeckHasCardsWatchedList';

let inMemoryDeckRepository: InMemoryDeckRepository;
let sut: EditDeckService;

describe('Edit Deck', () => {
  beforeEach(() => {
    inMemoryDeckRepository = new InMemoryDeckRepository();
    sut = new EditDeckService(inMemoryDeckRepository);
  });

  it('should be able to edit a deck name', async () => {
    const player = makePlayer({
      accessType: 'player',
    });
    const deck = makeDeck({
      playerId: player.id,
      name: 'Mage',
    });

    inMemoryDeckRepository.items.push(deck);

    const result = await sut.execute({
      cards: [],
      deckId: deck.id.toValue(),
      playerId: player.id.toValue(),
      name: 'Frost Mage',
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryDeckRepository.items[0].name === 'Frost Mage');
  });

  it('should be able to edit the deck cards', async () => {
    const player = makePlayer({
      accessType: 'player',
    });
    const card1 = makeCard({
      name: 'Warrior',
    });
    const card2 = makeCard({
      name: 'Priest',
    });

    const card3 = makeCard({
      name: 'Ninja',
    });

    const card4 = makeCard({
      name: 'Monk',
    });

    const cards: Card[] = [];
    cards.push(card1);
    cards.push(card2);

    const deck = makeDeck({
      playerId: player.id,
    });

    const deckHasCards = cards.map((card) => {
      const data = DeckHasCards.create({
        cardId: card.id,
        deckId: deck.id,
      });
      inMemoryDeckRepository.deckHasCards.push(data);
      return data;
    });

    deck.deckHasCards = new DeckHasCardWatchedList(deckHasCards);

    inMemoryDeckRepository.items.push(deck);

    const result = await sut.execute({
      cards: [card1.id.toValue(), card3.id.toValue(), card4.id.toValue()],
      deckId: deck.id.toValue(),
      playerId: player.id.toValue(),
    });

    expect(result.isRight()).toBe(true);
    expect(
      inMemoryDeckRepository.items[0].deckHasCards.getRemovedItems()[0]
        .cardId === card2.id,
    );
    expect(
      inMemoryDeckRepository.items[0].deckHasCards.currentItems.length === 3,
    );
  });
});
