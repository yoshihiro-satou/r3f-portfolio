// src/lib/items.ts
export type SpaceItem = {
  id: number
  name: string
  type: 'planet' | 'moon' | 'asteroid'
  description: string
  color: string
  href?: string
}

export const spaceItems: SpaceItem[] = [
  {
    id: 1,
    name: "Pinball",
    type: "planet",
    description: "rapierのRigidBodyなど物理エンジンを使ってみた。",
    color: "#9b5de5",
    href: "/examples/pinball"
  },
  {
    id: 2,
    name: "metalText",
    type: "moon",
    description: "R3Fの独特のテキストの表現を実践してみた。",
    color:"#aaff00" ,
    href: "/examples/metalText"
  },
  {
    id: 3,
    name: "loadindSumple",
    type: "asteroid",
    description: "Dark rocky fragment with faint blue veins",
    color: "#3a86ff",
    href: '/examples/loading'
  },
  // ... 追加したいだけ増やしてください
]
