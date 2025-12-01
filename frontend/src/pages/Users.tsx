import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Dialog } from '../ui/dialog'
import { useToast, Toast } from '../ui/toast'

type User = { _id: string; email: string; name: string; role: string }

export default function Users() {
  const api = (import.meta as any).env.VITE_API_URL || 'http://localhost:3000/api'
  const [users, setUsers] = useState([] as User[])
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` }
  const { message, setMessage } = useToast()
  const [editOpen, setEditOpen] = useState(false)
  const [editUser, setEditUser] = useState(null as User | null)
  const [editName, setEditName] = useState('')
  const [editRole, setEditRole] = useState('user')
  const [editPassword, setEditPassword] = useState('')

  async function load() {
    try {
      const res = await axios.get(`${api}/users`, { headers })
      setUsers(res.data)
      setError('')
    } catch (e: any) {
      setError('Falha ao carregar usuários')
      if (e?.response?.status === 401) window.location.href = '/login'
    }
  }

  async function create() {
    try {
      setLoading(true)
      await axios.post(`${api}/users`, { email, name, password, role }, { headers })
      setEmail(''); setName(''); setPassword(''); setRole('user')
      await load()
      setMessage('Usuário criado')
    } catch {
      setError('Falha ao criar usuário')
    } finally {
      setLoading(false)
    }
  }

  async function remove(id: string) {
    try {
      setLoading(true)
      await axios.delete(`${api}/users/${id}`, { headers })
      await load()
      setMessage('Usuário removido')
    } catch {
      setError('Falha ao remover usuário')
    } finally {
      setLoading(false)
    }
  }

  function openEdit(u: User) {
    setEditUser(u)
    setEditName(u.name)
    setEditRole(u.role)
    setEditPassword('')
    setEditOpen(true)
  }

  async function saveEdit() {
    if (!editUser) return
    try {
      setLoading(true)
      await axios.patch(`${api}/users/${editUser._id}`, { name: editName, role: editRole, password: editPassword || undefined }, { headers })
      setEditOpen(false)
      await load()
      setMessage('Usuário atualizado')
    } catch {
      setError('Falha ao atualizar usuário')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Usuários</h1>
      <div className="bg-white p-4 rounded shadow space-y-2">
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div className="grid grid-cols-2 gap-2">
          <Input placeholder="Email" value={email} onChange={(e: any) => setEmail(e.target.value)} />
          <Input placeholder="Nome" value={name} onChange={(e: any) => setName(e.target.value)} />
          <Input type="password" placeholder="Senha" value={password} onChange={(e: any) => setPassword(e.target.value)} />
          <select className="border p-2" value={role} onChange={(e: any) => setRole(e.target.value)} aria-label="Papel do usuário" title="Papel">
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
        </div>
        <Button disabled={loading} onClick={create}>Criar usuário</Button>
      </div>

      <div className="bg-white rounded shadow overflow-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-2">Email</th>
              <th className="p-2">Nome</th>
              <th className="p-2">Papel</th>
              <th className="p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: User) => (
              <tr key={u._id} className="border-t">
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2 space-x-2"><Button onClick={() => openEdit(u)}>Editar</Button><Button onClick={() => remove(u._id)}>Remover</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} title="Editar usuário">
        <div className="space-y-2">
          <Input placeholder="Nome" value={editName} onChange={(e: any) => setEditName(e.target.value)} />
          <select className="border p-2" value={editRole} onChange={(e: any) => setEditRole(e.target.value)} aria-label="Papel do usuário" title="Papel">
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
          <Input type="password" placeholder="Nova senha (opcional)" value={editPassword} onChange={(e: any) => setEditPassword(e.target.value)} />
          <div className="flex justify-end gap-2">
            <Button onClick={() => setEditOpen(false)}>Cancelar</Button>
            <Button onClick={saveEdit} disabled={loading}>Salvar</Button>
          </div>
        </div>
      </Dialog>
      <Toast message={message} />
    </div>
  )
}
