/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common';
import { z } from 'zod';
import { RegisterPlayerService } from '@/domain/players/application/useCases/RegisterPlayer/RegisterPlayerService';
import { PlayerAlreadyExistsError } from '@/domain/players/application/useCases/errors';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { Public } from '@/infra/auth/public';

const createPlayerBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type CreatePlayerBodySchema = z.infer<typeof createPlayerBodySchema>;

@Controller('/player')
@Public()
export class RegisterPlayerController {
  constructor(private registerPlayer: RegisterPlayerService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createPlayerBodySchema))
  async handle(@Body() body: CreatePlayerBodySchema) {
    const { name, email, password } = body;

    const result = await this.registerPlayer.execute({
      name,
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case PlayerAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
