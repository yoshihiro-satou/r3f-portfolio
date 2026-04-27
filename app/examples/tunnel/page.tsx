'use client'
import dynamic from "next/dynamic"

const TunnelScene = dynamic(() => import('./TunnelScene'), { ssr: false })

export default function TunnelPage() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <TunnelScene />
    </div>
  )
}
