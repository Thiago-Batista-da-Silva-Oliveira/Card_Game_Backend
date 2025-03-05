import { Module } from '@nestjs/common';
import { JwtEncrypter } from './jwt-encrypter';
import { Encrypter } from '@/domain/players/application/providers/hashProvider/model/encrypter';
import { HashProvider } from './bcrypt-hasher';
import { HashProviderModel } from '@/domain/players/application/providers/hashProvider/model/IHashProvider';

@Module({
  providers: [
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
    {
      provide: HashProviderModel,
      useClass: HashProvider,
    },
  ],
  exports: [Encrypter, HashProviderModel],
})
export class CryptographyModule {}
