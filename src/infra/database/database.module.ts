import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PlayerRepository } from '@/domain/players/application/repositories';
import { PrismaPlayersRepository } from './prisma/repositories/prisma-player-repository';
import { CardRepository } from '@/domain/cards/application/repositories';
import { PrismaCardsRepository } from './prisma/repositories/prisma-card-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: PlayerRepository,
      useClass: PrismaPlayersRepository,
    },
    {
      provide: CardRepository,
      useClass: PrismaCardsRepository,
    },
  ],
  exports: [PrismaService],
})
export class DatabaseModule {}
