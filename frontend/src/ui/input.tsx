type Props = { className?: string } & { [key: string]: any }
export function Input({ className, ...props }: Props) {
  return <input className={(className ? className + ' ' : '') + 'border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-gray-400'} {...props} />
}
