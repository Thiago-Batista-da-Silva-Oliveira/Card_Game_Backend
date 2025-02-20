import { InMemoryPlayerRepository } from '@/domain/players/application/repositories/tests/InMemoryPlayerRepository';
import { InMemoryMatchRepository } from '../../repositories/tests/InMemoryMatchRepository';
import { makePlayer } from '@/domain/players/application/repositories/tests/factories/makePlayer';
import { PlaceACardService } from './PlaceACardService';
import { InMemoryCardRepository } from '@/domain/cards/application/repositories/tests/InMemoryCardRepository';
import { makeMatch } from '../../repositories/tests/factories/makeMatch';
import { makeCard } from '@/domain/cards/application/repositories/tests/factories/makeCard';
import { Turn, TURN_STATUS } from '@/domain/matches/enterprise/entities/Turn';
import { PlayersInMatchWatchedList } from '@/domain/matches/enterprise/entities/PlayersInMatchList';
import { PlayersInMatch } from '@/domain/matches/enterprise/entities/PlayersInMatch';
import { TurnWatchedList } from '@/domain/matches/enterprise/entities/TurnList';
import { MatchHistoryWatchedList } from '@/domain/matches/enterprise/entities/MatchHistoryList';

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

    const playersInMatchWatchedList = new PlayersInMatchWatchedList();
    playersInMatchWatchedList.add(
      PlayersInMatch.create({
        matchId: match.id,
        playerId: player1.id,
      }),
    );
    playersInMatchWatchedList.add(
      PlayersInMatch.create({
        matchId: match.id,
        playerId: player2.id,
      }),
    );

    match.playersInMatch = playersInMatchWatchedList;
    const turnsWatchedList = new TurnWatchedList();
    turnsWatchedList.add(
      Turn.create({
        matchId: match.id,
        playerId: player1.id,
        status: TURN_STATUS.MAKING_THE_PLAY,
        turn: 1,
        historic: new MatchHistoryWatchedList(),
      }),
    );

    match.turns = turnsWatchedList;

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
      inMemoryMatchRepository.items[0].playersInMatch?.currentItems?.find(
        (data) => data.playerId === player1.id,
      )?.currentCardsState?.currentItems?.length,
    ).toBe(1);
    expect(
      inMemoryMatchRepository.items[0].playersInMatch?.currentItems?.find(
        (data) => data.playerId === player2.id,
      )?.currentCardsState?.currentItems.length,
    ).toBe(undefined);
    expect(inMemoryMatchRepository.items[0].turns?.currentItems.length).toBe(1);
    expect(
      inMemoryMatchRepository.items[0].turns.currentItems[0].historic
        ?.currentItems?.length,
    ).toBe(1);
  });
});
