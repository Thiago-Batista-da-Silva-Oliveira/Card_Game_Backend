/* eslint-disable @typescript-eslint/require-await */
import { Player } from '@/domain/players/enterprise/entities/Player';
import { PlayerRepository } from '../IPlayerRepository';

export class InMemoryPlayerRepository implements PlayerRepository {
  public items: Player[] = [];

  async register(player: Player): Promise<Player> {
    this.items.push(player);
    return player;
  }

  async findByEmail(email: string): Promise<Player | undefined> {
    return this.items.find((player) => player.email === email);
  }

  async findById(id: string): Promise<Player | undefined> {
    return this.items.find((player) => player.id.toValue() === id);
  }
}
