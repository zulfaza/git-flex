import type { ContributionGridCell } from "@/lib/githubApi"
import type { Layout } from "@/types/calendar"

export const getGridData = (
  layout: Layout,
  contributions: (ContributionGridCell | null)[][],
) => {
  if (layout === "horizontal") {
    return contributions
  }

  if (layout === "vertical") {
    const maxCols = Math.max(...contributions.map((row) => row.length))
    return Array.from({ length: maxCols }, (_, colIndex) =>
      contributions.map((row) => row[colIndex] || null),
    )
  }

  if (layout === "3x4" || layout === "4x3") {
    // For 3x4: 13 weeks per row (roughly 3 months), 4 rows  
    // For 4x3: 17-18 weeks per row (roughly 4 months), 3 rows
    const weeksPerRow = layout === "3x4" ? 13 : 17
    const totalRows = layout === "3x4" ? 4 : 3
    
    // We need to create a grid where each "super-row" contains 7 days worth of data
    // but spread across multiple actual rows in the visual grid
    const result = []
    
    // Create the combined grid: (7 days * totalRows) rows, weeksPerRow columns
    for (let superRowIndex = 0; superRowIndex < totalRows; superRowIndex++) {
      const startWeek = superRowIndex * weeksPerRow
      
      // Add 7 rows (one for each day of the week) for this super-row
      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const dayRow = []
        for (let weekOffset = 0; weekOffset < weeksPerRow; weekOffset++) {
          const weekIndex = startWeek + weekOffset
          if (weekIndex < (contributions[0]?.length || 0)) {
            dayRow.push(contributions[dayIndex]?.[weekIndex] || null)
          } else {
            dayRow.push(null)
          }
        }
        result.push(dayRow)
      }
    }
    
    return result
  }

  return contributions
}