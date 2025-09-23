"use client";

import { WEEKDAYS_SHORT_STRING } from "../constants/weekdays";
import {
  MONTHS_SHORT_STRING,
  getMonthLabelsFromData,
} from "../constants/months";
import type { ContributionGridCell } from "../lib/githubApi";
import type { Layout } from "../types/calendar";

interface CustomThemeColors {
  background: string;
  wrapperBackground: string;
  text: string;
  border: string;
  legendColors: string[];
}

interface ContributionCalendarProps {
  layout: Layout;
  customColors: CustomThemeColors;
  padding: number;
  borderRadius: number;
  gridData: (ContributionGridCell | null)[][];
  gridCols: number;
  title?: string;
  showTitle?: boolean;
  showLegend?: boolean;
}

const ContributionCalendar = ({
  layout,
  customColors,
  padding,
  borderRadius,
  gridData,
  gridCols,
  title = "Contribution Activity",
  showTitle = true,
  showLegend = true,
}: ContributionCalendarProps) => {
  const theme = customColors;

  const getCustomGridColor = (level: number) => {
    return customColors.legendColors[level] || customColors.legendColors[0];
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getMonthLabelsWithColspan = (): Array<{
    label: string;
    colspan: number;
  }> => {
    if (layout === "horizontal") {
      // For horizontal layout, use dynamic month labels based on actual data
      return getMonthLabelsFromData(gridData);
    } else if (layout === "vertical") {
      // For vertical layout, show months down the side
      // Each month spans approximately 4-5 weeks (vertically)
      const weeksPerMonth = [5, 4, 5, 4, 4, 5, 4, 4, 5, 4, 4, 5];

      const monthLabels: Array<{ label: string; colspan: number }> = [];
      MONTHS_SHORT_STRING.forEach((month, index) => {
        monthLabels.push({
          label: month,
          colspan: weeksPerMonth[index] || 4,
        });
      });
      return monthLabels;
    } else {
      // For 3x4 and 4x3 layouts, no column headers needed
      return [];
    }
  };

  const sideLabels = WEEKDAYS_SHORT_STRING;

  return (
    <div className="flex-1">
      <div className="flex justify-center">
        <div
          className="relative overflow-hidden text-white"
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
            <table
              role="grid"
              aria-readonly="true"
              className="border-separate overflow-hidden"
              style={{
                borderSpacing: "3px",
                position: "relative",
              }}
            >
              <caption className="sr-only">Contribution Graph</caption>

              {/* Header row with month labels for horizontal */}
              {layout === "horizontal" && (
                <thead>
                  <tr style={{ height: "13px" }}>
                    {/* Empty cell for weekday column */}
                    <td style={{ width: "28px" }}>
                      <span className="sr-only">Day of Week</span>
                    </td>

                    {/* Month labels */}
                    {getMonthLabelsWithColspan().map((month, index) => (
                      <td
                        key={`${month.label}-${index}`}
                        className="text-xs relative"
                        colSpan={month.colspan}
                        style={{
                          position: "relative",
                          color: theme.text,
                          opacity: 0.7,
                        }}
                      >
                        <span className="sr-only">
                          {MONTHS_SHORT_STRING[index]}
                        </span>
                        <span
                          aria-hidden="true"
                          style={{
                            position: "absolute",
                            top: 0,
                          }}
                        >
                          {month.label}
                        </span>
                      </td>
                    ))}
                  </tr>
                </thead>
              )}

              {/* Header row with weekday labels for vertical */}
              {layout === "vertical" && (
                <thead>
                  <tr style={{ height: "13px" }}>
                    {/* Empty cell for weekday row */}
                    <td style={{ width: "28px" }}>
                      <span className="sr-only">Day of Week</span>
                    </td>

                    {/* Weekday labels for vertical orientation */}
                    {WEEKDAYS_SHORT_STRING.map((day) => (
                      <td
                        key={day}
                        className="text-xs relative"
                        style={{
                          position: "relative",
                          color: theme.text,
                          opacity: 0.7,
                        }}
                      >
                        <span className="sr-only">{day}</span>
                        <span
                          aria-hidden="true"
                          style={{
                            position: "absolute",
                            top: 0,
                          }}
                        >
                          {day}
                        </span>
                      </td>
                    ))}
                  </tr>
                </thead>
              )}

              {/* No header for grid layouts - they use inline labels */}

              <tbody>
                {layout === "horizontal" &&
                  sideLabels.map((dayLabel, dayIndex) => (
                    <tr key={dayLabel} style={{ height: "15px" }}>
                      {/* Weekday label */}
                      <td
                        className="text-xs relative"
                        style={{
                          position: "relative",
                          color: theme.text,
                          opacity: 0.7,
                        }}
                      >
                        <span className="sr-only">{dayLabel}</span>
                        <span
                          className="absolute"
                          aria-hidden="true"
                          style={{
                            clipPath: dayIndex % 2 === 0 ? "none" : "circle(0)",
                            bottom: "-3px",
                          }}
                        >
                          {dayIndex % 2 === 0 ? dayLabel : ""}
                        </span>
                      </td>

                      {/* Contribution cells */}
                      {gridData[dayIndex]?.map((cell, colIndex) =>
                        cell ? (
                          <td
                            key={`${dayIndex}-${colIndex}`}
                            tabIndex={colIndex === 1 && dayIndex === 0 ? 0 : -1}
                            aria-selected="false"
                            aria-describedby={`contribution-graph-legend-level-${cell.level}`}
                            style={{
                              width: "15px",
                              backgroundColor: getCustomGridColor(cell.level),
                              borderRadius: "2px",
                              WebkitPrintColorAdjust: "exact",
                              printColorAdjust: "exact",
                            }}
                            data-date={cell.date}
                            data-level={cell.level}
                            role="gridcell"
                            className="transition-all duration-300 hover:scale-125"
                            title={
                              cell.date
                                ? `${cell.contributionCount} contributions on ${formatDate(cell.date)}`
                                : `${cell.contributionCount} contributions`
                            }
                          />
                        ) : (
                          <td key={`${dayIndex}-${colIndex}`} />
                        ),
                      )}

                      {/* Fill empty cells if needed */}
                      {Array.from({
                        length: Math.max(
                          0,
                          gridCols - (gridData[dayIndex]?.length || 0),
                        ),
                      }).map((_, emptyIndex) => (
                        <td key={`empty-${dayIndex}-${emptyIndex}`} />
                      ))}
                    </tr>
                  ))}

                {layout === "vertical" &&
                  gridData.map((weekData, weekIndex) => (
                    <tr key={weekIndex} style={{ height: "30px" }}>
                      {/* Month label for vertical orientation */}
                      <td
                        className="text-xs relative"
                        style={{
                          position: "relative",
                          color: theme.text,
                          opacity: 0.7,
                        }}
                      >
                        <span className="sr-only">Week {weekIndex + 1}</span>
                        <span
                          aria-hidden="true"
                          style={{
                            position: "absolute",
                            bottom: "10px",
                          }}
                        >
                          {(() => {
                            // Get first valid date from this week to determine month
                            const firstValidCell = weekData?.find(
                              (cell) => cell?.date,
                            );

                            if (!firstValidCell?.date) {
                              return "";
                            }

                            const weekDate = new Date(firstValidCell.date);
                            const monthName =
                              MONTHS_SHORT_STRING[weekDate.getMonth()];

                            // Show month label only at start of new month or every 4 weeks
                            if (weekIndex === 0) {
                              return monthName;
                            }

                            // Check if this is the start of a new month
                            const prevWeekData = gridData[weekIndex - 1];
                            const prevFirstValidCell = prevWeekData?.find(
                              (cell) => cell?.date,
                            );
                            if (prevFirstValidCell?.date) {
                              const prevWeekDate = new Date(
                                prevFirstValidCell.date,
                              );
                              const prevMonthName =
                                MONTHS_SHORT_STRING[prevWeekDate.getMonth()];
                              if (prevMonthName !== monthName) {
                                return monthName;
                              }
                            }
                            return "";
                          })()}
                        </span>
                      </td>

                      {/* Contribution cells for vertical orientation */}
                      {weekData?.map((cell, dayIndex) =>
                        cell ? (
                          <td
                            key={`${weekIndex}-${dayIndex}`}
                            tabIndex={
                              dayIndex === 1 && weekIndex === 0 ? 0 : -1
                            }
                            aria-selected="false"
                            aria-describedby={`contribution-graph-legend-level-${cell.level}`}
                            style={{
                              width: "30px",
                              backgroundColor: getCustomGridColor(cell.level),
                              WebkitPrintColorAdjust: "exact",
                              printColorAdjust: "exact",
                            }}
                            data-date={cell.date}
                            data-level={cell.level}
                            role="gridcell"
                            className="transition-all duration-300 hover:scale-125 rounded-xs"
                            title={
                              cell.date
                                ? `${cell.contributionCount} contributions on ${formatDate(cell.date)}`
                                : `${cell.contributionCount} contributions`
                            }
                          />
                        ) : (
                          <td key={`${weekIndex}-${dayIndex}`} />
                        ),
                      )}

                      {/* Fill empty cells if needed for vertical */}
                      {Array.from({
                        length: Math.max(0, 7 - (weekData?.length || 0)),
                      }).map((_, emptyIndex) => (
                        <td key={`empty-${weekIndex}-${emptyIndex}`} />
                      ))}
                    </tr>
                  ))}

                {(layout === "3x4" || layout === "4x3") &&
                  gridData.map((dayRow, dayIndex) => (
                    <tr
                      key={dayIndex}
                      style={{
                        height: "15px",
                        ...(dayIndex % 7 === 0 && dayIndex > 0
                          ? {
                              borderTop: `2px solid ${theme.border}`,
                              paddingTop: "4px",
                            }
                          : {}),
                      }}
                    >
                      {/* Weekday label */}
                      <td
                        className="text-xs relative"
                        style={{
                          position: "relative",
                          color: theme.text,
                          opacity: 0.7,
                        }}
                      >
                        <span className="sr-only">
                          {dayIndex % 7 === 0
                            ? sideLabels[0]
                            : dayIndex % 7 === 1
                              ? sideLabels[1]
                              : dayIndex % 7 === 2
                                ? sideLabels[2]
                                : dayIndex % 7 === 3
                                  ? sideLabels[3]
                                  : dayIndex % 7 === 4
                                    ? sideLabels[4]
                                    : dayIndex % 7 === 5
                                      ? sideLabels[5]
                                      : sideLabels[6]}
                        </span>
                        <span
                          className="absolute"
                          aria-hidden="true"
                          style={{
                            clipPath:
                              dayIndex % 14 === 0 ? "none" : "circle(0)",
                            bottom: "-3px",
                          }}
                        >
                          {dayIndex % 14 === 0 ? sideLabels[dayIndex % 7] : ""}
                        </span>
                      </td>

                      {/* Contribution cells */}
                      {dayRow?.map((cell, colIndex) =>
                        cell ? (
                          <td
                            key={`${dayIndex}-${colIndex}`}
                            tabIndex={colIndex === 1 && dayIndex === 0 ? 0 : -1}
                            aria-selected="false"
                            aria-describedby={`contribution-graph-legend-level-${cell.level}`}
                            style={{
                              width: "15px",
                              backgroundColor: getCustomGridColor(cell.level),
                              borderRadius: "2px",
                              WebkitPrintColorAdjust: "exact",
                              printColorAdjust: "exact",
                            }}
                            data-date={cell.date}
                            data-level={cell.level}
                            role="gridcell"
                            className="transition-all duration-300 hover:scale-125"
                            title={
                              cell.date
                                ? `${cell.contributionCount} contributions on ${formatDate(cell.date)}`
                                : `${cell.contributionCount} contributions`
                            }
                          />
                        ) : (
                          <td key={`${dayIndex}-${colIndex}`} />
                        ),
                      )}

                      {/* Fill empty cells if needed */}
                      {Array.from({
                        length: Math.max(0, gridCols - (dayRow?.length || 0)),
                      }).map((_, emptyIndex) => (
                        <td key={`empty-${dayIndex}-${emptyIndex}`} />
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
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
