import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PlayerRepository } from '@/domain/players/application/repositories';
import { PrismaPlayersRepository } from './prisma/repositories/prisma-player-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: PlayerRepository,
      useClass: PrismaPlayersRepository,
    },
  ],
  exports: [PrismaService],
})
export class DatabaseModule {}
