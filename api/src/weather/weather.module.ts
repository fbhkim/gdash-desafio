import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { WeatherLog, WeatherLogSchema } from './weather.schema'
import { WeatherService } from './weather.service'
import { WeatherController } from './weather.controller'
import { InsightService } from './insight.service'
import { IngestGuard } from '../common/ingest.guard'

@Module({
  imports: [MongooseModule.forFeature([{ name: WeatherLog.name, schema: WeatherLogSchema }])],
  providers: [WeatherService, InsightService, IngestGuard],
  controllers: [WeatherController],
  exports: [WeatherService]
})
export class WeatherModule {}
