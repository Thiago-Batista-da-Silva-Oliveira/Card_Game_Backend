import { InMemoryPlayerRepository } from '@/domain/players/application/repositories/tests/InMemoryPlayerRepository';
import { InMemoryMatchRepository } from '../../repositories/tests/InMemoryMatchRepository';
import { makePlayer } from '@/domain/players/application/repositories/tests/factories/makePlayer';
import { PlaceACardService } from './PlaceACardService';
import { InMemoryCardRepository } from '@/domain/cards/application/repositories/tests/InMemoryCardRepository';
import { makeMatch } from '../../repositories/tests/factories/makeMatch';
import { makeCard } from '@/domain/cards/application/repositories/tests/factories/makeCard';
import { TURN_STATUS } from '@/domain/matches/enterprise/entities/Turn';

let inMemoryPlayerRepository: InMemoryPlayerRepository;
let inMemoryMatchRepository: InMemoryMatchRepository;
let inMemoryCardRepository: InMemoryCardRepository;

let sut: PlaceACardService;

describe('Place a card', () => {
  beforeEach(() => {
    inMemoryPlayerRepository = new InMemoryPlayerRepository();
    inMemoryMatchRepository = new InMemoryMatchRepository();
    inMemoryCardRepository = new InMemoryCardRepository();
    sut = new PlaceACardService(
      inMemoryMatchRepository,
      inMemoryPlayerRepository,
      inMemoryCardRepository,
    );
  });

  it('should be able to place a card ', async () => {
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

    const card = makeCard();

    inMemoryCardRepository.items.push(card);

    const result = await sut.execute({
      playerId: player1.id.toValue(),
      matchId: match.id.toValue(),
      cardId: card.id.toValue(),
      position: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(
      inMemoryMatchRepository.items[0].playersInMatch?.find(
        (data) => data.playerId === player1.id,
      )?.currentCardsState?.length,
    ).toBe(1);
    expect(
      inMemoryMatchRepository.items[0].playersInMatch?.find(
        (data) => data.playerId === player2.id,
      )?.currentCardsState?.length,
    ).toBe(undefined);
    expect(inMemoryMatchRepository.items[0].turns?.length).toBe(1);
    expect(inMemoryMatchRepository.items[0].turns[0].historic?.length).toBe(1);
  });
});
