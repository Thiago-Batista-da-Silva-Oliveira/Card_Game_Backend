import { Player } from '../../enterprise/entities/Player';

export abstract class PlayerRepository {
  abstract register(player: Player): Promise<Player>;
  abstract findByEmail(email: string): Promise<Player | null>;
  abstract findById(id: string): Promise<Player | undefined>;
}
