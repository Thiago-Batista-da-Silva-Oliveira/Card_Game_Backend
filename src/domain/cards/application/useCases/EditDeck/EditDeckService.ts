import { DeckRepository } from '../../repositories/IDeckRepository';
import { Either, left, right } from '@/core/either';
import { DeckDoesNotExistsError } from '../errors/deck-does-not-exists';
import { DeckAlreadyExistsError } from '../errors/deck-already-exists';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { DeckHasCardWatchedList } from '@/domain/cards/enterprise/entities/DeckHasCardsWatchedList';
import { DeckHasCards } from '@/domain/cards/enterprise/entities/DeckHasCards';
import { UniqueEntityID } from '@/core/entities/unique_entity_id';
import { Deck } from '@/domain/cards/enterprise/entities/Deck';

interface IRequest {
  playerId: string;
  deckId: string;
  name?: string;
  cards: string[];
}

type IOutput = Either<
  NotAllowedError | DeckAlreadyExistsError | DeckDoesNotExistsError,
  {
    deck: Deck;
  }
>;

export class EditDeckService {
  constructor(private deckRepository: DeckRepository) {}
  async execute({ deckId, name, playerId, cards }: IRequest): Promise<IOutput> {
    const findDeck = await this.deckRepository.findDeckById(deckId);

    if (!findDeck) {
      return left(new DeckDoesNotExistsError());
    }

    if (findDeck.playerId.toValue() !== playerId) {
      return left(new NotAllowedError());
    }
    if (name && name !== findDeck.name) {
      const findExistingDeck = await this.deckRepository.findExistingDeck(
        playerId,
        name,
      );

      if (findExistingDeck) {
        return left(new DeckAlreadyExistsError());
      }
    }
    const currentCards =
      await this.deckRepository.findManyCardsByDeckId(deckId);

    const deckHasCardsList = new DeckHasCardWatchedList(currentCards);

    const editedCards = cards.map((card) => {
      return DeckHasCards.create({
        cardId: new UniqueEntityID(card),
        deckId: new UniqueEntityID(deckId),
      });
    });

    if (name) {
      findDeck.name = name;
    }
    deckHasCardsList.update(editedCards);
    findDeck.deckHasCards = deckHasCardsList;

    await this.deckRepository.save(findDeck);

    return right({
      deck: findDeck,
    });
  }
}
