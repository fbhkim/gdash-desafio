import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { WeatherLog } from './weather.schema'

export type CreateWeatherDto = {
  location: string
  temperature: number
  humidity: number
  windSpeed: number
  condition: string
  rainProbability?: number
  timestamp: string
}

@Injectable()
export class WeatherService {
  constructor(@InjectModel(WeatherLog.name) private readonly model: any) {}

  async create(dto: CreateWeatherDto) {
    return this.model.create(dto)
  }

  async list(limit = 100, skip = 0) {
    return this.model
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec()
  }

  async all() {
    return this.model.find().sort({ timestamp: 1 }).lean().exec()
  }
}
