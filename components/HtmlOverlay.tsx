export default function HtmlOverlay() {
  return (
    <div className="absolute inset-0 z-20 pointer-events-none flex flex-col item-center justify-between p-10 text-white">
      <h1 className="text-5xl font-bold tracking-widest drop-shadow-lg">
        Cosmic Arshive
      </h1>
      <p className="text-lg opacity-80 pointer-events-auto bg-black/40 px-6 py-3 rounded-full backdrop-blur-sm">
        Click and drag to move it.
      </p>
    </div>
  )
}
