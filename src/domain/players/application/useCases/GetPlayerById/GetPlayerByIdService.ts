import { Player } from '@/domain/players/enterprise/entities/Player';
import { PlayerRepository } from '../../repositories';
import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { PlayerDoesNotExistError } from '../errors';

interface IRequest {
  id: string;
}

type IOutput = Either<
  PlayerDoesNotExistError,
  {
    player: Player;
  }
>;
@Injectable()
export class GetPlayerByIdService {
  constructor(private playerRepository: PlayerRepository) {}
  async execute({ id }: IRequest): Promise<IOutput> {
    const player = await this.playerRepository.findById(id);

    if (!player) {
      return left(new PlayerDoesNotExistError(id));
    }

    return right({ player });
  }
}
