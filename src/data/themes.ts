import { catalog, getThemeMeta } from './catalog'
import { generatePaths } from './pathGenerator'
import type { PathDef, Theme } from './types'

export type { PathDef, Theme }
export { catalog, getThemeMeta }

const pathCache = new Map<string, PathDef[]>()

export function getThemePaths(themeId: string): PathDef[] {
  const cached = pathCache.get(themeId)
  if (cached) return cached
  const theme = getThemeMeta(themeId)
  if (!theme) return []
  const paths = generatePaths(theme)
  pathCache.set(themeId, paths)
  return paths
}

export function getResolvedTheme(id: string) {
  const theme = getThemeMeta(id)
  if (!theme) return null
  return { theme, paths: getThemePaths(id) }
}
