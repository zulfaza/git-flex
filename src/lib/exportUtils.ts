import html2canvas from "html2canvas-pro"
import { generateSVG } from "@/lib/generateSVG"
import type { ContributionGridCell } from "@/lib/githubApi"
import type {
  CustomThemeColors,
  ExportFormat,
  ExportScale,
  Layout,
} from "@/types/calendar"

interface ExportCalendarParams {
  calendarRef: React.RefObject<HTMLDivElement | null>
  exportFormat: ExportFormat
  exportScale: ExportScale
  layout: Layout
  squareSize: number
  gridData: (ContributionGridCell | null)[][]
  customColors: CustomThemeColors
  borderRadius: number
}

const getExportButton = () => {
  const exportBtn = document.querySelector("[data-export-btn]")

  if (exportBtn instanceof HTMLButtonElement) {
    return exportBtn
  }

  return null
}

const setExportButtonState = (
  isExporting: boolean,
  exportFormat: ExportFormat,
) => {
  const exportBtn = getExportButton()

  if (!exportBtn) {
    return
  }

  exportBtn.textContent = isExporting
    ? "Exporting..."
    : `Export ${exportFormat.toUpperCase()}`
  exportBtn.disabled = isExporting
}

export const exportCalendar = async ({
  calendarRef,
  exportFormat,
  exportScale,
  layout,
  squareSize,
  gridData,
  customColors,
  borderRadius,
}: ExportCalendarParams) => {
  if (!calendarRef.current) {
    return
  }

  setExportButtonState(true, exportFormat)

  try {
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
        scale: exportScale,
        useCORS: true,
        allowTaint: true,
      })

      const dataUrl = canvas.toDataURL("image/png", 1.0)
      const link = document.createElement("a")
      link.download = `contribution-calendar-${Date.now()}@${exportScale}x.png`
      link.href = dataUrl
      link.click()
    }
  } catch (error) {
    console.error("Export failed:", error)
    alert("Export failed. Please try again.")
  } finally {
    setExportButtonState(false, exportFormat)
  }
}
