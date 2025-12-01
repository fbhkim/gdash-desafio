import { useEffect } from 'react'
type Props = { open: boolean; onClose: () => void; title?: string; children?: any }
export function Dialog({ open, onClose, title, children }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow w-[400px] p-4 space-y-3">
        {title && <div className="text-lg font-semibold">{title}</div>}
        {children}
        <div className="flex justify-end"><button className="px-3 py-2 text-sm" onClick={onClose}>Fechar</button></div>
      </div>
    </div>
  )
}
