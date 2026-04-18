import dynamic from "next/dynamic"

// Canvasを含むコンポーネントをSSR無効で動的インポート
const UnderwaterScene = dynamic(
  () => import('./components/UndderwaterScene'),
  { ssr : false, loading: () => <p>ダイビング中...</p> }
)
export default function page() {
  return (
    <main>
      <UnderwaterScene />
    </main>
  )
}
