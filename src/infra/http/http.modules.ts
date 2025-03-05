import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { RegisterPlayerController } from './controllers/register-player.controller';
import { RegisterPlayerService } from '@/domain/players/application/useCases/RegisterPlayer/RegisterPlayerService';
import { CryptographyModule } from '../cryptography/cryptography.module';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [RegisterPlayerController],
  providers: [RegisterPlayerService],
})
export class HttpModule {}
