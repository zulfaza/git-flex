import { MONTHS_SHORT_STRING } from "../constants/months";
import { WEEKDAYS_SHORT_STRING } from "../constants/weekdays";

interface CustomThemeColors {
  background: string;
  wrapperBackground: string;
  text: string;
  border: string;
  button: string;
  buttonHover: string;
  buttonText: string;
  legendColors: string[];
}

type Params = {
  gridData: number[][];
  squareSize: number;
  customColors: CustomThemeColors;
  borderRadius: number;
  orientation: "horizontal" | "vertical";
};
export const generateSVG = ({
  squareSize,
  customColors,
  borderRadius,
  orientation,
  gridData,
}: Params) => {
  const theme = customColors;
  const gridCols = orientation === "horizontal" ? 53 : 7;
  const gridRows = orientation === "horizontal" ? 7 : 53;
  const totalWidth = gridCols * squareSize + 60; // Extra space for labels
  const totalHeight = gridRows * squareSize + 120; // Extra space for title and legend

  let svg = `<svg width="${totalWidth}" height="${totalHeight}" xmlns="http://www.w3.org/2000/svg">`;

  // Background
  const backgroundFill = theme.background;

  svg += `<rect width="100%" height="100%" fill="${backgroundFill}" rx="${borderRadius}" ry="${borderRadius}"/>`;

  // Title
  svg += `<text x="${
    totalWidth / 2
  }" y="30" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="${
    theme.text
  }">Contribution Activity</text>`;

  // Side labels
  const sideLabels =
    orientation === "horizontal" ? WEEKDAYS_SHORT_STRING : MONTHS_SHORT_STRING;

  sideLabels.forEach((label, index) => {
    if (index % (orientation === "horizontal" ? 2 : 1) === 0) {
      const y = 60 + index * squareSize + squareSize / 2;
      svg += `<text x="25" y="${
        y + 4
      }" text-anchor="end" font-family="monospace" font-size="10" fill="${
        theme.text
      }" opacity="0.7">${label}</text>`;
    }
  });

  // Top labels
  const topLabels =
    orientation === "horizontal" ? MONTHS_SHORT_STRING : WEEKDAYS_SHORT_STRING;
  topLabels.forEach((label, index) => {
    if (
      (orientation === "horizontal" && index % 2 === 0) ||
      (orientation === "vertical" && index % 3 === 0)
    ) {
      const x =
        40 +
        (index * (orientation === "horizontal" ? 4.4 : 7.5) * squareSize) /
          (orientation === "horizontal" ? 1 : 1);
      svg += `<text x="${x}" y="55" text-anchor="start" font-family="monospace" font-size="10" fill="${theme.text}" opacity="0.7">${label}</text>`;
    }
  });

  // Contribution squares
  gridData.forEach((row, rowIndex) => {
    row.forEach((level, colIndex) => {
      const x = 40 + colIndex * squareSize;
      const y = 60 + rowIndex * squareSize;
      const color = customColors.legendColors[level] || customColors.legendColors[0];
      svg += `<rect x="${x}" y="${y}" width="${squareSize - 1}" height="${
        squareSize - 1
      }" fill="${color}" rx="2" ry="2"/>`;
    });
  });

  // Legend
  const legendY = totalHeight - 50;
  svg += `<text x="25" y="${
    legendY + 12
  }" text-anchor="start" font-family="monospace" font-size="10" fill="${
    theme.text
  }" opacity="0.6">Less</text>`;

  [0, 1, 2, 3, 4].forEach((level, index) => {
    const x = 60 + index * 20;
    const color = customColors.legendColors[level] || customColors.legendColors[0];
    svg += `<rect x="${x}" y="${legendY}" width="16" height="16" fill="${color}" rx="2" ry="2"/>`;
  });

  svg += `<text x="${60 + 5 * 20 + 10}" y="${
    legendY + 12
  }" text-anchor="start" font-family="monospace" font-size="10" fill="${
    theme.text
  }" opacity="0.6">More</text>`;

  // Footer
  svg += `<text x="${totalWidth / 2}" y="${
    totalHeight - 15
  }" text-anchor="middle" font-family="monospace" font-size="10" fill="${
    theme.text
  }" opacity="0.4">Generated with GitFlex</text>`;

  svg += "</svg>";
  return svg;
};
