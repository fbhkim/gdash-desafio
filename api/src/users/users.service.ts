import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User } from './user.schema'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly model: any) {}

  async ensureDefaultAdmin(email: string, password: string, name: string) {
    const existing = await this.model.findOne({ email }).exec()
    if (existing) return existing
    const passwordHash = await bcrypt.hash(password, 10)
    return this.model.create({ email, passwordHash, name, role: 'admin' })
  }

  async findByEmail(email: string) {
    return this.model.findOne({ email }).exec()
  }

  async list() {
    return this.model.find().lean().exec()
  }

  async create(email: string, name: string, password: string, role: string) {
    const passwordHash = await bcrypt.hash(password, 10)
    return this.model.create({ email, name, passwordHash, role })
  }

  async update(id: string, data: Partial<{ email: string; name: string; password: string; role: string }>) {
    const update: any = { ...data }
    if (data.password) update.passwordHash = await bcrypt.hash(data.password, 10)
    delete update.password
    return this.model.findByIdAndUpdate(id, update, { new: true }).lean().exec()
  }

  async remove(id: string) {
    await this.model.findByIdAndDelete(id).exec()
    return { ok: true }
  }
}
