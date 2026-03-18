import PinballScene from './PinballScene.client'
import ScoreDisplay from './ScoreDisplay'

export default function PinballPage() {
  return (
    <div className='relative w-screen h-screen overflow-x-hidden bg-gradient-to-b from-indigo-950 to-black'>
      <PinballScene />
      <ScoreDisplay />
    </div>
  )
}
