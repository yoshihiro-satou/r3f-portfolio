const Section = ({ title, desc }: { title: string, desc: string}) => (
    <section className="h-screen flex flex-col justify-items-center p-10 mt-10 text-white">
      <h1 className="text-6xl font-bold">{title}</h1>
      <p className="mt-4 text-xl opacity-80">{desc}</p>
    </section>
  )
export default function Overlay() {
  return (
    <div className="w-screen">
      <Section title="Section 1" desc="Welcome to the immeresive 3D world." />
      <Section title="Section 2" desc="Background evolve with your scroll." />
      <Section title="Section 3" desc="Using R3F and Drei effectively." />
      <Section title="Section 4" desc="End of the journey." />
    </div>
  )
}
