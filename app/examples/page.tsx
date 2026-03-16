import { CanvasGridFloor } from "@/components/CanvasGridFloor"

export default function page() {
  return (
      <div className='w-screen h-screen relative bg-[#05050f]'>
        <CanvasGridFloor />
        <div className='absolute inset-x-0 bottom-10 z-10 flex justify-self-center pointer-events-none'>
          
        </div>
      </div>
  )
}
