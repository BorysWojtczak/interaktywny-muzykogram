import { useMemo, useState } from 'react'
import { BoardView } from './components/BoardView'
import { ThemePicker } from './components/ThemePicker'
import { catalog, getResolvedTheme } from './data/themes'
import './App.css'

export default function App() {
  const [themeId, setThemeId] = useState<string | null>(null)
  const resolved = useMemo(
    () => (themeId ? getResolvedTheme(themeId) : null),
    [themeId],
  )

  if (resolved) {
    return (
      <BoardView
        theme={resolved.theme}
        paths={resolved.paths}
        onBack={() => setThemeId(null)}
      />
    )
  }

  return <ThemePicker themes={catalog} onSelect={setThemeId} />
}
