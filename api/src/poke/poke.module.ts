import { Module } from '@nestjs/common'
import { PokeController } from './poke.controller'

@Module({
  controllers: [PokeController]
})
export class PokeModule {}
