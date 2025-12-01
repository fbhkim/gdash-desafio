import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { WeatherModule } from '../weather/weather.module'
import { UsersModule } from '../users/users.module'
import { AuthModule } from '../auth/auth.module'
import { UsersService } from '../users/users.service'
import { AppController } from './app.controller'
import { PokeModule } from '../poke/poke.module'

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://mongo:27017/gdash'),
    UsersModule,
    AuthModule,
    WeatherModule,
    PokeModule
  ],
  controllers: [AppController]
})
export class AppModule {
  constructor(private readonly usersService: UsersService) {}
  async onModuleInit() {
    const email = process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com'
    const password = process.env.DEFAULT_ADMIN_PASSWORD || '123456'
    const name = process.env.DEFAULT_ADMIN_NAME || 'Admin'
    await this.usersService.ensureDefaultAdmin(email, password, name)
  }
}
