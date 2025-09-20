import type { ContributionGridCell } from "@/lib/githubApi"
import type { Orientation } from "@/types/calendar"

export const getGridData = (
  orientation: Orientation,
  contributions: (ContributionGridCell | null)[][],
) => {
  if (orientation === "horizontal") {
    return contributions
  }

  const maxCols = Math.max(...contributions.map((row) => row.length))

  return Array.from({ length: maxCols }, (_, colIndex) =>
    contributions.map((row) => row[colIndex] || null),
  )
}