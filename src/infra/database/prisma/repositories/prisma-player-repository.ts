import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PlayerRepository } from '@/domain/players/application/repositories';
import { Player } from '@/domain/players/enterprise/entities/Player';
import { PrismaPlayerMapper } from '../mappers/prisma-player-mapper';

@Injectable()
export class PrismaPlayersRepository implements PlayerRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<Player | null> {
    const player = await this.prisma.player.findUnique({
      where: {
        email,
      },
    });

    if (!player) {
      return null;
    }

    return PrismaPlayerMapper.toDomain(player);
  }

  async findById(id: string): Promise<Player | undefined> {
    const player = await this.prisma.player.findUnique({
      where: {
        id,
      },
    });

    if (!player) {
      return undefined;
    }

    return PrismaPlayerMapper.toDomain(player);
  }

  async register(player: Player): Promise<Player> {
    const data = PrismaPlayerMapper.toPrisma(player);

    const prismaPlayer = await this.prisma.player.create({
      data,
    });

    return PrismaPlayerMapper.toDomain(prismaPlayer);
  }
}
