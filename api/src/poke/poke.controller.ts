import { Controller, Get, Param, Query } from '@nestjs/common'

@Controller('poke')
export class PokeController {
  @Get()
  async list(@Query('page') page = '1', @Query('size') size = '20') {
    const p = Math.max(1, parseInt(page, 10))
    const s = Math.max(1, parseInt(size, 10))
    const offset = (p - 1) * s
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${s}&offset=${offset}`
    const r = await fetch(url)
    const data = await r.json()
    return { page: p, size: s, count: data.count, results: data.results }
  }

  @Get(':name')
  async detail(@Param('name') name: string) {
    const r = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
    if (!r.ok) return { error: 'Not found' }
    const d = await r.json()
    return {
      name: d.name,
      id: d.id,
      height: d.height,
      weight: d.weight,
      sprites: d.sprites,
      types: d.types?.map((t: any) => t.type?.name)
    }
  }
}
