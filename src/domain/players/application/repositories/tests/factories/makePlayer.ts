import {
  Player,
  PlayerProps,
} from '@/domain/players/enterprise/entities/Player';
import { UniqueEntityID } from 'src/core/entities/unique_entity_id';

export function makePlayer(
  override: Partial<PlayerProps> = {},
  id?: UniqueEntityID,
) {
  const player = Player.create(
    {
      name: 'Joe',
      email: 'joe@doe.com',
      password: '123456',
      ...override,
    },
    id,
  );

  return player;
}
