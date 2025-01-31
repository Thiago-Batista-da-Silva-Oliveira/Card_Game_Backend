import { Player } from '@/domain/players/enterprise/entities/Player';
import { PlayerRepository } from '../../repositories';
import { Either, left, right } from '@/core/either';
import { HashProviderModel } from '../../providers/hashProvider/model/IHashProvider';
import { Injectable } from '@nestjs/common';
import { IncorrectCredentialsError } from '../errors';

interface IRequest {
  email: string;
  password: string;
}

type IOutput = Either<
  IncorrectCredentialsError,
  {
    player: Omit<Player, 'password'>;
  }
>;
@Injectable()
export class SessionService {
  constructor(
    private playerRepository: PlayerRepository,
    private hashProvider: HashProviderModel,
  ) {}
  async execute({ email, password }: IRequest): Promise<IOutput> {
    const playerAlreadyExists = await this.playerRepository.findByEmail(email);

    if (!playerAlreadyExists) {
      return left(new IncorrectCredentialsError());
    }

    const comparePassword = await this.hashProvider.compare(
      password,
      playerAlreadyExists.password,
    );

    if (!comparePassword) {
      return left(new IncorrectCredentialsError());
    }

    const { password: _, ...playerWithoutPassword } = playerAlreadyExists;

    return right({ player: playerWithoutPassword as Omit<Player, 'password'> });
  }
}
