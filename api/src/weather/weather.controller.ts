import { Body, Controller, Get, Header, Post, Query, UseGuards } from '@nestjs/common'
import { WeatherService, CreateWeatherDto } from './weather.service'
import { InsightService } from './insight.service'
import { IngestGuard } from '../common/ingest.guard'
import * as XLSX from 'xlsx'

@Controller('weather')
export class WeatherController {
  constructor(private readonly service: WeatherService, private readonly insight: InsightService) {}

  @UseGuards(IngestGuard)
  @Post('logs')
  async ingest(@Body() body: CreateWeatherDto) {
    return this.service.create(body)
  }

  @Get('logs')
  async list(@Query('limit') limit = '100', @Query('skip') skip = '0') {
    return this.service.list(parseInt(limit, 10), parseInt(skip, 10))
  }

  @Get('export.csv')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="weather.csv"')
  async exportCsv() {
    type WeatherEntry = { timestamp: string; location: string; condition: string; temperature: number; humidity: number; windSpeed: number; rainProbability?: number }
    const logs = (await this.service.all()) as WeatherEntry[]
    const header: string[] = ['timestamp', 'location', 'condition', 'temperature', 'humidity', 'windSpeed', 'rainProbability']
    const rows: (string | number)[][] = logs.map((l: WeatherEntry) => [l.timestamp, l.location, l.condition, l.temperature, l.humidity, l.windSpeed, l.rainProbability ?? ''])
    const csv = [header.join(','), ...rows.map((r: (string | number)[]) => r.join(','))].join('\n')
    return csv
  }

  @Get('export.xlsx')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename="weather.xlsx"')
  async exportXlsx() {
    type WeatherEntry = { timestamp: string; location: string; condition: string; temperature: number; humidity: number; windSpeed: number; rainProbability?: number }
    const logs = (await this.service.all()) as WeatherEntry[]
    const data: WeatherEntry[] = logs.map((l: WeatherEntry) => ({ timestamp: l.timestamp, location: l.location, condition: l.condition, temperature: l.temperature, humidity: l.humidity, windSpeed: l.windSpeed, rainProbability: l.rainProbability }))
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'weather')
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
    return buf
  }

  @Get('insights')
  async insights() {
    return this.insight.compute()
  }
}
