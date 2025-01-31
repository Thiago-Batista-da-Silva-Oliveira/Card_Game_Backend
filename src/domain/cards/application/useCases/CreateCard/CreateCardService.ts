import { Card } from '@/domain/cards/enterprise/entities/Card';
import { CardRepository } from '../../repositories/ICardRepository';
import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { PlayerRepository } from '@/domain/players/application/repositories';
import { PlayerDoesNotExistError } from '@/domain/players/application/useCases/errors';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

interface IRequest {
  name: string;
  userId: string;
}

type IOutput = Either<
  PlayerDoesNotExistError | NotAllowedError,
  {
    card: Card;
  }
>;

@Injectable()
export class CreateCardService {
  constructor(
    private cardRepository: CardRepository,
    private playerRepository: PlayerRepository,
  ) {}
  async execute({ userId, name }: IRequest): Promise<IOutput> {
    const player = await this.playerRepository.findById(userId);

    if (!player) {
      return left(new PlayerDoesNotExistError(userId));
    }

    if (player.accessType !== 'admin') {
      return left(new NotAllowedError());
    }

    const card = Card.create({ name });
    const createdCard = await this.cardRepository.create(card);
    return right({ card: createdCard });
  }
}
