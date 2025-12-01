import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

type Weather = {
  timestamp: string
  location: string
  condition: string
  temperature: number
  humidity: number
  windSpeed: number
  rainProbability?: number
}

export default function Dashboard() {
  const api = (import.meta as any).env.VITE_API_URL || 'http://localhost:3000/api'
  const [logs, setLogs] = useState([] as Weather[])
  const [insights, setInsights] = useState(null as any)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    const token = localStorage.getItem('token')
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    try {
      const [l, i] = await Promise.all([
        axios.get(`${api}/weather/logs`, { headers }),
        axios.get(`${api}/weather/insights`, { headers })
      ])
      setLogs(l.data)
      setInsights(i.data)
      setError('')
    } catch {
      setError('Falha ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard de Clima</h1>
        <div className="space-x-2">
          <a href={`${api}/weather/export.csv`}><Button>Exportar CSV</Button></a>
          <a href={`${api}/weather/export.xlsx`}><Button>Exportar XLSX</Button></a>
          <Link to="/users"><Button>Usuários</Button></Link>
          <Link to="/explorar"><Button>Explorar</Button></Link>
        </div>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {loading ? (
        <div>Carregando...</div>
      ) : (
        <>
          {insights && (
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded shadow">
                <div className="text-sm">Resumo</div>
                <div className="text-lg">{insights.summary}</div>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <div className="text-sm">Conforto</div>
                <div className="text-2xl font-semibold">{insights.metrics.comfort}</div>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <div className="text-sm">Tendência</div>
                <div className="text-2xl font-semibold">{insights.metrics.trend}</div>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <div className="text-sm">Alerta</div>
                <div className="text-2xl font-semibold">{insights.metrics.rainAlert}</div>
              </div>
            </div>
          )}

          {insights && (
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded shadow">
                <div className="text-sm">Temp atual</div>
                <div className="text-2xl font-semibold">{insights.last?.temperature}°C</div>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <div className="text-sm">Umidade atual</div>
                <div className="text-2xl font-semibold">{insights.last?.humidity}%</div>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <div className="text-sm">Vento</div>
                <div className="text-2xl font-semibold">{insights.last?.windSpeed} m/s</div>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <div className="text-sm">Condição</div>
                <div className="text-2xl font-semibold">{insights.last?.condition}</div>
              </div>
            </div>
          )}

          {insights && (
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded shadow">
                <div className="text-sm">Média 24h</div>
                <div>{insights.metrics.avg24Temp}°C / {insights.metrics.avg24Hum}%</div>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <div className="text-sm">Média 72h</div>
                <div>{insights.metrics.avg72Temp}°C / {insights.metrics.avg72Hum}%</div>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <div className="text-sm">Classificação</div>
                <div className="text-2xl font-semibold">{insights.metrics.classification}</div>
              </div>
            </div>
          )}

          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm mb-2">Temperatura ao longo do tempo</div>
            <SvgLineChart data={logs.map((l: Weather) => l.temperature)} height={180} width={600} />
          </div>

          <div className="bg-white rounded shadow overflow-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="p-2">Data/Hora</th>
                  <th className="p-2">Local</th>
                  <th className="p-2">Condição</th>
                  <th className="p-2">Temp</th>
                  <th className="p-2">Umidade</th>
                  <th className="p-2">Vento</th>
                  <th className="p-2">Chuva %</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l: Weather, idx: number) => (
                  <tr key={idx} className="border-t">
                    <td className="p-2">{l.timestamp}</td>
                    <td className="p-2">{l.location}</td>
                    <td className="p-2">{l.condition}</td>
                    <td className="p-2">{l.temperature}</td>
                    <td className="p-2">{l.humidity}</td>
                    <td className="p-2">{l.windSpeed}</td>
                    <td className="p-2">{l.rainProbability ?? ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

function SvgLineChart({ data, width, height }: { data: number[]; width: number; height: number }) {
  if (!data || data.length === 0) return <div className="text-sm">Sem dados</div>
  const min = Math.min(...data)
  const max = Math.max(...data)
  const pad = 10
  const xs = data.map((_, i) => pad + (i * (width - pad * 2)) / Math.max(1, data.length - 1))
  const ys = data.map(v => pad + (height - pad * 2) * (1 - (v - min) / Math.max(0.0001, max - min)))
  const d = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x} ${ys[i]}`).join(' ')
  return (
    <svg width={width} height={height}>
      <path d={d} stroke="#111827" fill="none" strokeWidth={2} />
    </svg>
  )
}
