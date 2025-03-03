/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { UniqueEntityID } from '@/core/entities/unique_entity_id';
import { Player } from '@/domain/players/enterprise/entities/Player';
import { Player as PrismaUser, Prisma } from '@prisma/client';

export class PrismaPlayerMapper {
  static toDomain(raw: PrismaUser): Player {
    return Player.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        accessType: raw.accessType,
        status: raw.status,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(player: Player): Prisma.PlayerUncheckedCreateInput {
    return {
      id: player.id.toString(),
      name: player.name,
      email: player.email,
      password: player.password,
      accessType: player.accessType || 'player',
      status: player.status || 'active',
      createdAt: player.createdAt,
      updatedAt: player.updatedAt,
    };
  }
}
