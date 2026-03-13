import { create } from 'zustand'
import type { ExportFormat, ExportScale, Layout } from '@/types/calendar'

interface CalendarState {
  exportFormat: ExportFormat
  exportScale: ExportScale
  layout: Layout
  padding: number
  borderRadius: number
  wrapperPaddingX: number
  wrapperPaddingY: number
  title: string
  showTitle: boolean
  showLegend: boolean
  setExportFormat: (format: ExportFormat) => void
  setExportScale: (scale: ExportScale) => void
  setLayout: (layout: Layout) => void
  setPadding: (padding: number) => void
  setBorderRadius: (borderRadius: number) => void
  setWrapperPaddingX: (paddingX: number) => void
  setWrapperPaddingY: (paddingY: number) => void
  setTitle: (title: string) => void
  setShowTitle: (show: boolean) => void
  setShowLegend: (show: boolean) => void
  resetCalendarSettings: () => void
  initializeLayout: (layout: Layout) => void
}

type CalendarStateDefaults = Pick<
  CalendarState,
  | 'exportFormat'
  | 'exportScale'
  | 'layout'
  | 'padding'
  | 'borderRadius'
  | 'wrapperPaddingX'
  | 'wrapperPaddingY'
  | 'title'
  | 'showTitle'
  | 'showLegend'
>

const initialState: CalendarStateDefaults = {
  exportFormat: 'png',
  exportScale: 2,
  layout: 'horizontal',
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
  setExportScale: (exportScale) => set({ exportScale }),
  setLayout: (layout) => set({ layout }),
  setPadding: (padding) => set({ padding }),
  setBorderRadius: (borderRadius) => set({ borderRadius }),
  setWrapperPaddingX: (wrapperPaddingX) => set({ wrapperPaddingX }),
  setWrapperPaddingY: (wrapperPaddingY) => set({ wrapperPaddingY }),
  setTitle: (title) => set({ title }),
  setShowTitle: (showTitle) => set({ showTitle }),
  setShowLegend: (showLegend) => set({ showLegend }),
  resetCalendarSettings: () => set(initialState),
  initializeLayout: (layout) => set({ layout }),
}))
