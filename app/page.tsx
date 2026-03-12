import CyberCity from "@/components/CyberCity";

export default function Home() {
  return (
    <main style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <CyberCity />

      {/* オーバーレイするテキスト（栽培ー感を出すUI） */}
      <div style={{
        position: 'absolute',
        top: '40px',
        left: '40px',
        color: '#0ff',
        pointerEvents: 'none'
      }}>
        <h1 style={{ fontSize: '3rem', letterSpacing: '0.2em' }}>PORTFOLIO 2026</h1>
        <p>CYBERNETIC INTERFACE ACTIVE</p>
      </div>
    </main>
  )
}
