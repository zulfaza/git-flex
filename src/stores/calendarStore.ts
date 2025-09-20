import { create } from 'zustand'

interface CalendarState {
  exportFormat: "png" | "svg"
  layout: "horizontal" | "vertical" | "3x4" | "4x3"
  padding: number
  borderRadius: number
  wrapperPaddingX: number
  wrapperPaddingY: number
  title: string
  showTitle: boolean
  showLegend: boolean
  setExportFormat: (format: "png" | "svg") => void
  setLayout: (layout: "horizontal" | "vertical" | "3x4" | "4x3") => void
  setPadding: (padding: number) => void
  setBorderRadius: (borderRadius: number) => void
  setWrapperPaddingX: (paddingX: number) => void
  setWrapperPaddingY: (paddingY: number) => void
  setTitle: (title: string) => void
  setShowTitle: (show: boolean) => void
  setShowLegend: (show: boolean) => void
  resetCalendarSettings: () => void
  initializeLayout: (layout: "horizontal" | "vertical" | "3x4" | "4x3") => void
}

const initialState = {
  exportFormat: "png" as const,
  layout: "horizontal" as const,
  padding: 16,
  borderRadius: 0,
  wrapperPaddingX: 0,
  wrapperPaddingY: 0,
  title: "Contribution Activity",
  showTitle: true,
  showLegend: true,
}

export const useCalendarStore = create<CalendarState>((set) => ({
  ...initialState,
  setExportFormat: (exportFormat) => set({ exportFormat }),
  setLayout: (layout) => set({ layout }),
  setPadding: (padding) => set({ padding }),
  setBorderRadius: (borderRadius) => set({ borderRadius }),
  setWrapperPaddingX: (wrapperPaddingX) => set({ wrapperPaddingX }),
  setWrapperPaddingY: (wrapperPaddingY) => set({ wrapperPaddingY }),
  setTitle: (title) => set({ title }),
  setShowTitle: (showTitle) => set({ showTitle }),
  setShowLegend: (showLegend) => set({ showLegend }),
  resetCalendarSettings: () => set(initialState),
  initializeLayout: (layout: "horizontal" | "vertical" | "3x4" | "4x3") => set({ layout }),
}))