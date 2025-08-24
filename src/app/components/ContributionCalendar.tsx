"use client";

import { WEEKDAYS_SHORT_STRING } from "../constants/weekdays";
import { MONTHS_SHORT_STRING } from "../constants/months";
import { getGridColor } from "../lib/getGridColor";
import { colorConfig } from "../constants/colors";

type Orientation = "horizontal" | "vertical";

interface ContributionCalendarProps {
  squareSize: number;
  orientation: Orientation;
  currentTheme: keyof typeof colorConfig.themes;
  padding: number;
  borderRadius: number;
  showWindowControls: boolean;
  gridData: number[][];
  gridCols: number;
  gridRows: number;
  getColSpanForTopLabel: (index: number, arrayLength: number) => number;
}

const ContributionCalendar = ({
  squareSize,
  orientation,
  currentTheme,
  padding,
  borderRadius,
  showWindowControls,
  gridData,
  gridCols,
  gridRows,
  getColSpanForTopLabel,
}: ContributionCalendarProps) => {
  const theme = colorConfig.themes[currentTheme];
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
          {/* Window Controls */}
          {showWindowControls && (
            <div className="absolute top-4 left-4 flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
          )}

          {/* Calendar Title */}
          <div className="text-center mb-6 mt-6">
            <h2 className="text-lg font-semibold" style={{ color: theme.text }}>
              Contribution Activity
            </h2>
          </div>

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
                          backgroundColor: getGridColor(level, currentTheme),
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

          {/* Legend */}
          <div className="flex items-center justify-center mt-8 text-sm font-mono">
            <span
              className="mr-3 opacity-60 text-xs"
              style={{ color: theme.text }}
            >
              Less
            </span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className="w-4 h-4 rounded-sm mr-2 border border-white/30 dark:border-gray-600/50 transition-transform hover:scale-110"
                style={{
                  backgroundColor: getGridColor(level, currentTheme),
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

          {/* Footer */}
          <div className="text-center mt-6 text-xs opacity-40 font-mono">
            Generated with GitFlex
          </div>
        </div>
      </div>
    </div>
  );
};

ContributionCalendar.displayName = "ContributionCalendar";

export default ContributionCalendar;
