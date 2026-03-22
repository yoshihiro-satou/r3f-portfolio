import GameScene from '@/components/pinball/GameScene'

export default function PinballlPage() {
  return (
    // 画面いっぱいに広がる真っ黒な背景の領域
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#111'}}>
      <GameScene />
    </div>
  )
}
