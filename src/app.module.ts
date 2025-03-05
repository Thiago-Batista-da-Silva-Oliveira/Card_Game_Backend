import { Module } from '@nestjs/common';
import { HttpModule } from './infra/http/http.modules';
import { EnvModuele } from './infra/env/env.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './infra/env/env';
import { AuthModule } from './infra/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    HttpModule,
    EnvModuele,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
