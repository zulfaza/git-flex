"use client";

import { WEEKDAYS_SHORT_STRING } from "../constants/weekdays";
import { MONTHS_SHORT_STRING } from "../constants/months";

type Orientation = "horizontal" | "vertical";

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

interface ContributionCalendarProps {
  squareSize: number;
  orientation: Orientation;
  customColors: CustomThemeColors;
  padding: number;
  borderRadius: number;
  gridData: number[][];
  gridCols: number;
  gridRows: number;
  getColSpanForTopLabel: (index: number, arrayLength: number) => number;
  title?: string;
  showTitle?: boolean;
  showLegend?: boolean;
}

const ContributionCalendar = ({
  squareSize,
  orientation,
  customColors,
  padding,
  borderRadius,
  gridData,
  gridCols,
  gridRows,
  getColSpanForTopLabel,
  title = "Contribution Activity",
  showTitle = true,
  showLegend = true,
}: ContributionCalendarProps) => {
  const theme = customColors;

  const getCustomGridColor = (level: number) => {
    return customColors.legendColors[level] || customColors.legendColors[0];
  };
  const sideLabels =
    orientation === "horizontal" ? WEEKDAYS_SHORT_STRING : MONTHS_SHORT_STRING;
  const topLabels =
    orientation === "horizontal" ? MONTHS_SHORT_STRING : WEEKDAYS_SHORT_STRING;
  return (
    <div className="flex-1">
      <div className="flex justify-center">
        <div
          className="relative overflow-hidden shadow-2xl text-white"
          style={{
            padding: `${padding}px`,
            borderRadius: `${borderRadius}px`,
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
            backgroundColor: theme.background,
          }}
        >
          {/* Calendar Title */}
          {showTitle && (
            <div className="text-center mb-6 mt-6 min-h-[28px] flex items-center justify-center">
              <h2
                className="text-lg font-semibold"
                style={{ color: theme.text }}
              >
                {title}
              </h2>
            </div>
          )}
          {!showTitle && <div className="min-h-[20px]"></div>}

          {/* Calendar Grid */}
          <div className="flex items-center justify-center">
            <div className="flex flex-col w-fit rounded-lg p-4">
              <div className="flex min-w-fit w-full">
                {/* Side labels */}
                <div className="flex flex-col justify-between mr-3 text-xs opacity-70 font-mono text-gray-300">
                  {sideLabels.map((label, index) => (
                    <div
                      key={label}
                      className="flex items-center justify-end pr-2"
                      style={{
                        marginBottom: "2px",
                        height: `${squareSize}px`,
                        color: theme.text,
                      }}
                    >
                      {index % (orientation === "horizontal" ? 2 : 1) === 0 &&
                        label}
                    </div>
                  ))}
                </div>

                {/* Contribution grid */}
                <div
                  className="grid gap-1 relative"
                  style={{
                    gridTemplateColumns: `repeat(${gridCols}, ${squareSize}px)`,
                    gridTemplateRows: `repeat(${gridRows}, ${squareSize}px)`,
                    borderRadius: "8px",
                  }}
                >
                  {/* Top labels */}
                  <div className="absolute -top-6 w-full">
                    <div
                      className="grid mb-2 text-xs opacity-70 text-gray-300"
                      style={{
                        gridTemplateColumns:
                          orientation === "horizontal"
                            ? "repeat(12, minmax(0, 1fr))"
                            : "repeat(8, minmax(0, 1fr))",
                      }}
                    >
                      {topLabels.map((label, index, array) =>
                        (orientation === "horizontal" && index % 2 === 0) ||
                        (orientation === "vertical" && index % 3 === 0) ? (
                          <div
                            key={label}
                            className="text-left"
                            style={{
                              gridColumn: `span ${getColSpanForTopLabel(
                                index,
                                array.length,
                              )} / span ${getColSpanForTopLabel(
                                index,
                                array.length,
                              )}`,
                              color: theme.text,
                            }}
                          >
                            {label}
                          </div>
                        ) : null,
                      )}
                    </div>
                  </div>
                  {gridData.map((row, rowIndex) =>
                    row.map((level, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className="transition-all duration-300 hover:scale-125 w-full"
                        title={`${level} contributions`}
                        style={{
                          backgroundColor: getCustomGridColor(level),
                          borderRadius: "4px",
                          WebkitPrintColorAdjust: "exact",
                          printColorAdjust: "exact",
                        }}
                      />
                    )),
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center px-4 mt-6">
            {/* Footer */}
            <div className="text-center text-xs opacity-40 font-mono">
              Generated with GitFlex
            </div>
            {/* Legend */}
            {showLegend && (
              <div className="flex items-center justify-center text-sm font-mono min-h-[32px]">
                <span
                  className="mr-3 opacity-60 text-xs"
                  style={{ color: theme.text }}
                >
                  Less
                </span>
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className="w-4 h-4 rounded-sm mr-2 transition-transform hover:scale-110"
                    style={{
                      border: `1px solid ${theme.border}`,
                      backgroundColor: getCustomGridColor(level),
                    }}
                  />
                ))}
                <span
                  className="ml-1 opacity-60 text-xs"
                  style={{ color: theme.text }}
                >
                  More
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ContributionCalendar.displayName = "ContributionCalendar";

export default ContributionCalendar;
