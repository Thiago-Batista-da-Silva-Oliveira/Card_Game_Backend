import { Card } from '@/domain/cards/enterprise/entities/Card';
import { CardRepository } from '../../repositories/ICardRepository';
import { ICreateCardDTO } from '../../dtos/ICreateCardDTO';
import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';

type IOutput = Either<
  null,
  {
    card: Card;
  }
>;

@Injectable()
export class CreateCardService {
  constructor(private cardRepository: CardRepository) {}
  async execute({ name }: ICreateCardDTO): Promise<IOutput> {
    const card = Card.create({ name });
    const createdCard = await this.cardRepository.create(card);
    return right({ card: createdCard });
  }
}
