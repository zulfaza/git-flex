import { colorConfig } from "../constants/colors";

export const getGridColor = (
  level: number,
  selectedTheme: keyof typeof colorConfig.themes,
) => {
  return (
    colorConfig.contributionColors[selectedTheme][level] ||
    colorConfig.contributionColors[selectedTheme][0]
  );
};
