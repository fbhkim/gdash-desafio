import { Injectable, UnauthorizedException, Inject } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(private readonly users: UsersService, @Inject(JwtService) private readonly jwt: any) {}

  async validateUser(email: string, password: string) {
    const user = await this.users.findByEmail(email)
    if (!user) throw new UnauthorizedException()
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) throw new UnauthorizedException()
    const payload = { sub: user.id, email: user.email, role: user.role }
    const token = await this.jwt.signAsync(payload, { expiresIn: '7d' })
    return { token }
  }
}
