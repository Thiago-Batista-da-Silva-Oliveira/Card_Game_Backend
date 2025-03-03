import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PlayerRepository } from '@/domain/players/application/repositories';
import { PrismaPlayersRepository } from './prisma/repositories/prisma-player-repository';
import { CardRepository } from '@/domain/cards/application/repositories';
import { PrismaCardsRepository } from './prisma/repositories/prisma-card-repository';
import { PrismaDecksRepository } from './prisma/repositories/prisma-deck-repository';
import { DeckRepository } from '@/domain/cards/application/repositories/IDeckRepository';

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
    {
      provide: DeckRepository,
      useClass: PrismaDecksRepository,
    },
  ],
  exports: [PrismaService],
})
export class DatabaseModule {}
