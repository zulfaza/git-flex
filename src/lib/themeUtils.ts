import { colorConfig } from "@/constants/colors"
import type { CustomThemeColors } from "@/types/calendar"

export const createCustomThemeColors = (
  theme: keyof typeof colorConfig.themes,
): CustomThemeColors => {
  return {
    ...colorConfig.themes[theme],
    legendColors: [...colorConfig.contributionColors[theme]],
  }
}