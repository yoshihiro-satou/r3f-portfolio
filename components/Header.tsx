import StartButton from "./ui/buttton/StartButton";

export default function Header() {
  return(
    <header className="fixed top-0 left-0 right-0 z-10 bg-black/40 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="flex justify-between items-center pl-10 pr-10">
        <h1 className=" text-3xl text-emerald-500 flex font-passero">R3F samples</h1>
        <StartButton href="/">back</StartButton>
      </div>
    </header>
  )
}
