import { useEffect, useState } from 'react'
import { Button } from '../ui/button'

type Item = { name: string; url: string }

export default function Explore() {
  const api = (import.meta as any).env.VITE_API_URL || 'http://localhost:3000/api'
  const [items, setItems] = useState([] as Item[])
  const [page, setPage] = useState(1)
  const [count, setCount] = useState(0)
  const [detail, setDetail] = useState(null as any)
  const [error, setError] = useState('')

  async function load(p = page) {
    try {
      const r = await fetch(`${api}/poke?page=${p}&size=20`)
      const d = await r.json()
      setItems(d.results || [])
      setCount(d.count || 0)
      setPage(d.page || p)
      setError('')
    } catch {
      setError('Falha ao carregar lista')
    }
  }

  async function show(name: string) {
    try {
      const r = await fetch(`${api}/poke/${name}`)
      const d = await r.json()
      setDetail(d)
      setError('')
    } catch {
      setError('Falha ao carregar detalhe')
    }
  }

  useEffect(() => { load(1) }, [])

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Explorar PokéAPI</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
          <ul className="space-y-2">
            {items.map((it: Item) => (
              <li key={it.name} className="flex justify-between">
                <span>{it.name}</span>
                <Button onClick={() => show(it.name)}>Detalhe</Button>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => load(Math.max(1, page - 1))}>Anterior</Button>
            <Button onClick={() => load(page + 1)}>Próxima</Button>
            <span className="text-sm">Página {page}</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          {detail ? (
            <div>
              <div className="text-xl font-semibold">{detail.name}</div>
              <div>ID: {detail.id}</div>
              <div>Tipos: {detail.types?.join(', ')}</div>
              {detail.sprites?.front_default && (
                <img alt={detail.name} src={detail.sprites.front_default} className="mt-2" />
              )}
            </div>
          ) : (
            <div>Selecione um item</div>
          )}
        </div>
      </div>
    </div>
  )
}
