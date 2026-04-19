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
    name: "loadingSumple",
    type: "asteroid",
    description: "ローディングの基礎をとりあえず触ってみた。",
    color: "#3a86ff",
    href: '/examples/loading'
  },
  {
    id: 4,
    name: "Shader1",
    type: "asteroid",
    description: "シェーダーの基礎をとりあえず触ってみた。万華鏡",
    color: "#3a86ff",
    href: '/examples/shader1'
  },
  {
    id: 5,
    name: "Shader2",
    type: "asteroid",
    description: "シェーダーの基礎をとりあえず触ってみた。",
    color: "#3a86ff",
    href: '/examples/shader2'
  },
  {
    id: 6,
    name: "PuzzleGame",
    type: "asteroid",
    description: "",
    color: "#9b5de5",
    href: '/examples/PuzzleGame'
  },
  {
    id: 7,
    name: "Spilling-text",
    type: "moon",
    description: "R3Fの独特のテキストの表現を実践してみた。",
    color:"#aaff00" ,
    href: "/examples/Spilling-text"
  },
  {
    id: 8,
    name: "Scroll-animation",
    type: "asteroid",
    description: "R3Fのスクロールアニメーションを実践してみた。",
    color:"#3a86ff" ,
    href: "/examples/scroll-animation"
  },
  {
    id: 9,
    name: "Scroll-animation2",
    type: "asteroid",
    description: "R3Fのスクロールアニメーションを実践してみた。",
    color:"#3a86ff" ,
    href: "/examples/scroll-animation2"
  },
  {
    id: 10,
    name: "Scroll-animation3",
    type: "moon",
    description: "R3Fのスクロールアニメーションを実践してみた。",
    color:"#3a86ff" ,
    href: "/examples/scroll-animation3"
  },
  {
    id: 10,
    name: "cyberpunk",
    type: "moon",
    description: "R3Fでいろいろ組み合わせてみた。。",
    color:"#3a86ff" ,
    href: "/examples/cyberpunk"
  },
  // ... 追加したいだけ増やしてください
]
