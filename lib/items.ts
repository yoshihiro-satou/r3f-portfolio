// src/lib/items.ts
export type SpaceItem = {
  id: number
  name: string
  type: 'planet' | 'moon' | 'asteroid'
  description: string
  color: string
}

export const spaceItems: SpaceItem[] = [
  {
    id: 1,
    name: "Nebula Core",
    type: "planet",
    description: "A glowing gas giant with swirling purple storms",
    color: "#9b5de5",
  },
  {
    id: 2,
    name: "Crystal Moon",
    type: "moon",
    description: "Iridescent satellite reflecting distant stars",
    color: "#00f5d4",
  },
  {
    id: 3,
    name: "Void Asteroid",
    type: "asteroid",
    description: "Dark rocky fragment with faint blue veins",
    color: "#3a86ff",
  },
  // ... 追加したいだけ増やしてください
]
