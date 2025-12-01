declare module 'react'
declare module 'react-dom/client'
declare module 'react-router-dom'
declare module 'react/jsx-runtime'
declare module 'axios'

interface ImportMeta { env: any }

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any
  }
}
