import { useEffect, useState } from 'react'
export function useToast() {
  const [message, setMessage] = useState('')
  useEffect(() => {
    if (!message) return
    const t = setTimeout(() => setMessage(''), 3000)
    return () => clearTimeout(t)
  }, [message])
  return { message, setMessage }
}
export function Toast({ message }: { message: string }) {
  if (!message) return null
  return <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded shadow">{message}</div>
}
