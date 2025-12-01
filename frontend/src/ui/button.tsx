import { cn } from './utils'

type ButtonProps = {
  className?: string
  children?: any
  disabled?: boolean
} & { [key: string]: any }

export function Button({ className, children, ...props }: ButtonProps) {
  return (
    <button className={cn('inline-flex items-center justify-center rounded bg-gray-900 text-white px-3 py-2 text-sm hover:bg-gray-700 disabled:opacity-50', className)} {...props}>
      {children}
    </button>
  )
}
