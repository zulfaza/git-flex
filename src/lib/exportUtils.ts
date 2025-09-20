import html2canvas from "html2canvas-pro"
import { generateSVG } from "@/lib/generateSVG"
import type { ContributionGridCell } from "@/lib/githubApi"
import type { CustomThemeColors, Layout } from "@/types/calendar"

interface ExportCalendarParams {
  calendarRef: React.RefObject<HTMLDivElement | null>
  exportFormat: "png" | "svg"
  layout: Layout
  squareSize: number
  gridData: (ContributionGridCell | null)[][]
  customColors: CustomThemeColors
  borderRadius: number
}

export const exportCalendar = async ({
  calendarRef,
  exportFormat,
  layout,
  squareSize,
  gridData,
  customColors,
  borderRadius,
}: ExportCalendarParams) => {
  if (!calendarRef.current) {
    return
  }

  try {
    const exportBtn = document.querySelector(
      "[data-export-btn]",
    ) as HTMLButtonElement
    {
      exportBtn.textContent = "Exporting..."
      exportBtn.disabled = true
    }

    if (exportFormat === "svg") {
      const svgContent = generateSVG({
        layout,
        squareSize,
        gridData,
        customColors,
        borderRadius,
      })
      const blob = new Blob([svgContent], { type: "image/svg+xml" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.download = `contribution-calendar-${Date.now()}.svg`
      link.href = url
      link.click()
      URL.revokeObjectURL(url)
    } else {
      const canvas = await html2canvas(calendarRef.current, {
        backgroundColor: "#1f2937",
        scale: 2,
        useCORS: true,
        allowTaint: true,
      })

      const dataUrl = canvas.toDataURL("image/png", 1.0)
      const link = document.createElement("a")
      link.download = `contribution-calendar-${Date.now()}.png`
      link.href = dataUrl
      link.click()
    }

    if (exportBtn) {
      exportBtn.textContent = `Export ${exportFormat.toUpperCase()}`
      exportBtn.disabled = false
    }
  } catch (error) {
    console.error("Export failed:", error)
    alert("Export failed. Please try again.")

    const exportBtn = document.querySelector(
      "[data-export-btn]",
    ) as HTMLButtonElement
    if (exportBtn) {
      exportBtn.textContent = `Export ${exportFormat.toUpperCase()}`
      exportBtn.disabled = false
    }
  }
}