import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { PlayerRepository } from '@/domain/players/application/repositories';
import { PlayerDoesNotExistError } from '@/domain/players/application/useCases/errors';
import { Deck } from '@/domain/cards/enterprise/entities/Deck';
import { DeckRepository } from '../../repositories/IDeckRepository';
import { DeckAlreadyExistsError } from '../errors/deck-already-exists';

interface IRequest {
  name: string;
  playerId: string;
}

type IOutput = Either<
  PlayerDoesNotExistError | DeckAlreadyExistsError,
  {
    deck: Deck;
  }
>;

@Injectable()
export class CreateDeckService {
  constructor(
    private deckRepository: DeckRepository,
    private playerRepository: PlayerRepository,
  ) {}
  async execute({ playerId, name }: IRequest): Promise<IOutput> {
    const player = await this.playerRepository.findById(playerId);

    if (!player) {
      return left(new PlayerDoesNotExistError(playerId));
    }

    const findExistingDeck = await this.deckRepository.findExistingDeck(
      playerId,
      name,
    );

    if (findExistingDeck) {
      return left(new DeckAlreadyExistsError());
    }

    const deck = Deck.create({ name, playerId: player.id });
    const createdDeck = await this.deckRepository.create(deck);
    return right({ deck: createdDeck });
  }
}
