import { Injectable } from '@nestjs/common'
import { WeatherService } from './weather.service'

@Injectable()
export class InsightService {
  constructor(private readonly weather: WeatherService) {}

  async compute() {
    type WeatherEntry = {
      location: string
      temperature: number
      humidity: number
      windSpeed: number
      condition: string
      rainProbability?: number
      timestamp: string
    }
    const logs = (await this.weather.all()) as WeatherEntry[]
    if (logs.length === 0) {
      return { summary: 'Sem dados', metrics: {} }
    }
    const temps = logs.map((l: WeatherEntry) => l.temperature)
    const hums = logs.map((l: WeatherEntry) => l.humidity)
    const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / (arr.length || 1)
    const avgTemp = parseFloat(avg(temps).toFixed(2))
    const avgHum = parseFloat(avg(hums).toFixed(2))
    const trend = temps.length > 3 && temps[temps.length - 1] > temps[temps.length - 3] ? 'subindo' : 'caindo'
    const comfort = Math.max(0, Math.min(100, Math.round(100 - Math.abs(avgTemp - 22) * 3 - Math.abs(avgHum - 50) * 0.5)))
    const last = logs[logs.length - 1]
    const rainAlert = last.rainProbability && last.rainProbability > 60 ? 'Alta chance de chuva' : 'Sem alerta de chuva'

    const parseDate = (s: string) => new Date(s)
    const now = new Date()
    const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000)
    const inLastHours = (h: number) => logs.filter(l => parseDate(l.timestamp) >= hoursAgo(h))
    const last24 = inLastHours(24)
    const last72 = inLastHours(72)
    const avg24Temp = parseFloat(avg(last24.map(l => l.temperature)).toFixed(2))
    const avg24Hum = parseFloat(avg(last24.map(l => l.humidity)).toFixed(2))
    const avg72Temp = parseFloat(avg(last72.map(l => l.temperature)).toFixed(2))
    const avg72Hum = parseFloat(avg(last72.map(l => l.humidity)).toFixed(2))

    const classify = (t: number, h: number, rain?: number) => {
      if (rain && rain > 60) return 'chuvoso'
      if (t <= 15) return 'frio'
      if (t >= 32) return 'quente'
      if (t >= 26 && h >= 70) return 'quente'
      return 'agradável'
    }
    const classification = classify(last.temperature, last.humidity, last.rainProbability)

    const summary = `Nas últimas 72h, T média ${avg72Temp}°C e U média ${avg72Hum}%. Tendência ${trend}, conforto ${comfort}. Última leitura: ${classification}. ${rainAlert}.`

    return {
      summary,
      metrics: {
        avgTemp,
        avgHum,
        trend,
        comfort,
        rainAlert,
        avg24Temp,
        avg24Hum,
        avg72Temp,
        avg72Hum,
        classification
      },
      last,
      windows: {
        last24Count: last24.length,
        last72Count: last72.length
      }
    }
  }
}
