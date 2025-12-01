import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ timestamps: true })
export class WeatherLog extends Document {
  @Prop({ required: true })
  location!: string
  @Prop({ required: true })
  temperature!: number
  @Prop({ required: true })
  humidity!: number
  @Prop({ required: true })
  windSpeed!: number
  @Prop({ required: true })
  condition!: string
  @Prop({ required: false })
  rainProbability?: number
  @Prop({ required: true })
  timestamp!: string
}

export const WeatherLogSchema = SchemaFactory.createForClass(WeatherLog)
