import { create } from 'zustand'

interface CalendarState {
  exportFormat: "png" | "svg"
  orientation: "horizontal" | "vertical"
  padding: number
  borderRadius: number
  wrapperPaddingX: number
  wrapperPaddingY: number
  title: string
  showTitle: boolean
  showLegend: boolean
  setExportFormat: (format: "png" | "svg") => void
  setOrientation: (orientation: "horizontal" | "vertical") => void
  setPadding: (padding: number) => void
  setBorderRadius: (borderRadius: number) => void
  setWrapperPaddingX: (paddingX: number) => void
  setWrapperPaddingY: (paddingY: number) => void
  setTitle: (title: string) => void
  setShowTitle: (show: boolean) => void
  setShowLegend: (show: boolean) => void
  resetCalendarSettings: () => void
  initializeOrientation: (orientation: "horizontal" | "vertical") => void
}

const initialState = {
  exportFormat: "png" as const,
  orientation: "horizontal" as const,
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
  setOrientation: (orientation) => set({ orientation }),
  setPadding: (padding) => set({ padding }),
  setBorderRadius: (borderRadius) => set({ borderRadius }),
  setWrapperPaddingX: (wrapperPaddingX) => set({ wrapperPaddingX }),
  setWrapperPaddingY: (wrapperPaddingY) => set({ wrapperPaddingY }),
  setTitle: (title) => set({ title }),
  setShowTitle: (showTitle) => set({ showTitle }),
  setShowLegend: (showLegend) => set({ showLegend }),
  resetCalendarSettings: () => set(initialState),
  initializeOrientation: (orientation: "horizontal" | "vertical") => set({ orientation }),
}))