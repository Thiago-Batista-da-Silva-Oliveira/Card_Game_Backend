import { Player } from '@/domain/players/enterprise/entities/Player';
import { IPlayerRegistrationDTO } from '../../dtos';
import { PlayerRepository } from '../../repositories';
import { PlayerAlreadyExistsError } from '../errors/player-already-exists-error';
import { Either, left, right } from '@/core/either';
import { HashProviderModel } from '../../providers/hashProvider/model/IHashProvider';
import { Injectable } from '@nestjs/common';

type IOutput = Either<
  PlayerAlreadyExistsError,
  {
    player: Player;
  }
>;
@Injectable()
export class RegisterPlayerService {
  constructor(
    private playerRepository: PlayerRepository,
    private hashProvider: HashProviderModel,
  ) {}
  async execute({
    email,
    name,
    password,
  }: IPlayerRegistrationDTO): Promise<IOutput> {
    const playerAlreadyExists = await this.playerRepository.findByEmail(email);

    if (playerAlreadyExists) {
      return left(new PlayerAlreadyExistsError(email));
    }

    const hashedPassword = await this.hashProvider.hash(password);

    const player = Player.create({ email, name, password: hashedPassword });

    const createdPlayer = await this.playerRepository.register(player);

    return right({ player: createdPlayer });
  }
}
