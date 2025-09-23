import { useState } from "react";
import { colorConfig } from "@/constants/colors";
import { createCustomThemeColors } from "@/lib/themeUtils";
import type { CustomThemeColors } from "@/types/calendar";

export const useColorManagement = () => {
  const [currentTheme, setCurrentTheme] =
    useState<keyof typeof colorConfig.themes>("github-dark");
  const [customColors, setCustomColors] = useState<CustomThemeColors>(
    createCustomThemeColors("github-dark"),
  );
  const handleThemeChange = (newTheme: keyof typeof colorConfig.themes) => {
    setCurrentTheme(newTheme);
    setCustomColors(createCustomThemeColors(newTheme));
  };

  const handleColorChange = (
    colorKey: keyof CustomThemeColors,
    value: string,
  ) => {
    setCustomColors((prev) => ({
      ...prev,
      [colorKey]: value,
    }));
  };

  const handleLegendColorChange = (index: number, value: string) => {
    setCustomColors((prev) => ({
      ...prev,
      legendColors: prev.legendColors.map((color, i) =>
        i === index ? value : color,
      ),
    }));
  };

  const resetColors = () => {
    setCustomColors(createCustomThemeColors(currentTheme));
  };

  return {
    currentTheme,
    customColors,
    handleThemeChange,
    handleColorChange,
    handleLegendColorChange,
    resetColors,
  };
};
