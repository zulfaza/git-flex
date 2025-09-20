import { useEffect, useRef, useState } from "react"
import { colorConfig } from "@/constants/colors"
import { createCustomThemeColors } from "@/lib/themeUtils"
import type { CustomThemeColors } from "@/types/calendar"

export const useColorManagement = () => {
  const [currentTheme, setCurrentTheme] =
    useState<keyof typeof colorConfig.themes>("github-dark")
  const [customColors, setCustomColors] = useState<CustomThemeColors>(
    createCustomThemeColors("github-dark"),
  )
  const [selectedColorId, setSelectedColorId] =
    useState<string>("base:background")
  const [openPopover, setOpenPopover] = useState<{
    id: string
    x: number
    y: number
  } | null>(null)
  const openerRef = useRef<HTMLButtonElement | null>(null)

  const handleThemeChange = (newTheme: keyof typeof colorConfig.themes) => {
    setCurrentTheme(newTheme)
    setCustomColors(createCustomThemeColors(newTheme))
  }

  const handleColorChange = (
    colorKey: keyof CustomThemeColors,
    value: string,
  ) => {
    setCustomColors((prev) => ({
      ...prev,
      [colorKey]: value,
    }))
  }

  const handleLegendColorChange = (index: number, value: string) => {
    setCustomColors((prev) => ({
      ...prev,
      legendColors: prev.legendColors.map((color, i) =>
        i === index ? value : color,
      ),
    }))
  }

  const resetColors = () => {
    setCustomColors(createCustomThemeColors(currentTheme))
    setSelectedColorId("base:background")
  }

  const resolveSelectedHex = () => {
    if (selectedColorId.startsWith("base:")) {
      const key = selectedColorId.slice(5) as keyof CustomThemeColors
      return customColors[key] as string
    }
    if (selectedColorId.startsWith("legend:")) {
      const idx = parseInt(selectedColorId.slice(7), 10)
      return customColors.legendColors[idx]
    }
    return "#000000"
  }

  const applySelectedHex = (hex: string) => {
    if (selectedColorId.startsWith("base:")) {
      const key = selectedColorId.slice(5) as keyof CustomThemeColors
      handleColorChange(key, hex)
    } else if (selectedColorId.startsWith("legend:")) {
      const idx = parseInt(selectedColorId.slice(7), 10)
      handleLegendColorChange(idx, hex)
    }
  }

  useEffect(() => {
    if (!openPopover) return
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenPopover(null)
    }
    const close = () => setOpenPopover(null)
    window.addEventListener("keydown", handle)
    window.addEventListener("scroll", close, true)
    window.addEventListener("resize", close)
    return () => {
      window.removeEventListener("keydown", handle)
      window.removeEventListener("scroll", close, true)
      window.removeEventListener("resize", close)
    }
  }, [openPopover])

  useEffect(() => {
    if (!openPopover && openerRef.current) {
      openerRef.current.focus()
    }
  }, [openPopover])

  return {
    currentTheme,
    customColors,
    selectedColorId,
    openPopover,
    openerRef,
    handleThemeChange,
    handleColorChange,
    handleLegendColorChange,
    resetColors,
    resolveSelectedHex,
    applySelectedHex,
    setSelectedColorId,
    setOpenPopover,
  }
}