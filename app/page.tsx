import  Top3d  from '@/app/Top3d'
import StartButton  from '@/components/ui/buttton/StartButton'

export default function page() {
  return (
      <div className='w-screen h-screen relative'>
        <Top3d />
        <div className='absolute inset-x-0 bottom-10 z-10 flex justify-self-center pointer-events-none'>
          <StartButton href="/examples" >Go Sumples</StartButton>
        </div>
      </div>
  )
}
