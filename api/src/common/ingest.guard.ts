import { Injectable, UnauthorizedException } from '@nestjs/common'

@Injectable()
export class IngestGuard {
  canActivate(context: any): boolean {
    const req = context.switchToHttp().getRequest()
    const token = req.headers['x-ingest-token']
    const expected = process.env.INGEST_TOKEN || 'ingest-token'
    if (!token || token !== expected) {
      throw new UnauthorizedException()
    }
    return true
  }
}
