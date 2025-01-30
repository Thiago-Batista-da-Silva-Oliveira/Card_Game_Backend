import { Card } from '@/domain/cards/enterprise/entities/Card';
import { CardRepository } from '../../repositories/ICardRepository';
import { ICreateCardDTO } from '../../dtos/ICreateCardDTO';
import { Either, right } from '@/core/either';

type IOutput = Either<
  null,
  {
    card: Card;
  }
>;

export class CreateCardService {
  constructor(private cardRepository: CardRepository) {}
  async execute({ name }: ICreateCardDTO): Promise<IOutput> {
    const card = Card.create({ name });
    const createdCard = await this.cardRepository.create(card);
    return right({ card: createdCard });
  }
}
