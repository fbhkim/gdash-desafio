import { Body, Controller, Get, Param, Patch, Post, Delete, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../auth/jwt.guard'

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  async list() {
    return this.users.list()
  }

  @Post()
  async create(@Body() body: { email: string; name: string; password: string; role: string }) {
    return this.users.create(body.email, body.name, body.password, body.role)
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: Partial<{ email: string; name: string; password: string; role: string }>) {
    return this.users.update(id, body)
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.users.remove(id)
  }
}
