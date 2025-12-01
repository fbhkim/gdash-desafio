import { useState } from 'react'
import axios from 'axios'
import { Button } from '../ui/button'

export default function Login() {
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('123456')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const api = (import.meta as any).env.VITE_API_URL

  async function submit(e: any) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await axios.post(`${api}/auth/login`, { email, password })
      localStorage.setItem('token', res.data.token)
      window.location.href = '/'
    } catch {
      setError('Falha no login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={submit} className="bg-white p-6 rounded shadow w-80 space-y-3">
        <h1 className="text-xl font-semibold">Entrar</h1>
        <input className="border p-2 w-full" placeholder="Email" value={email} onChange={(e: any) => setEmail(e.target.value)} />
        <input className="border p-2 w-full" type="password" placeholder="Senha" value={password} onChange={(e: any) => setPassword(e.target.value)} />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <Button disabled={loading} className="w-full">{loading ? 'Entrando...' : 'Entrar'}</Button>
      </form>
    </div>
  )
}
