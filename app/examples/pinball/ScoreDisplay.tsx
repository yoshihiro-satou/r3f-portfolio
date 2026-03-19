'use client'
interface Props {
  score: number
}

export default function ScoreDisplay({ score }: Props) {
  return (
    <div className='absolute top-20 left-4 z-30 text-white text-3xl font-bold tracking-wider drop-shadow-lg'>
      SCORE: {score}
    </div>
  )
}
