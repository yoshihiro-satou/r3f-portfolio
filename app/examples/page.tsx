import ListScene from "../ListScene.client"
import { spaceItems } from "@/lib/items"
import HtmlOverlay from "@/components/HtmlOverlay"


export default function SpaceListPage() {
  return (
    <div className="relative w-screen h-screen overflow-hidden  bg-black">
      <ListScene items={spaceItems} />

      {/* HTML重ねレイヤー (Server Componentのまま) */}
      <HtmlOverlay />
    </div>
  )
}
