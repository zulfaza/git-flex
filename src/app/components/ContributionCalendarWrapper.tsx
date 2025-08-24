"use client";

import { useState, useRef, useMemo } from "react";
import html2canvas from "html2canvas-pro";
import { WEEKDAYS_SHORT_STRING } from "../constants/weekdays";
import { MONTHS_SHORT_STRING } from "../constants/months";
import { colorConfig } from "../constants/colors";
import { getGridColor } from "../lib/getGridColor";
import { generateSVG } from "../lib/generateSVG";

type Orientation = "horizontal" | "vertical";

interface ContributionCalendarWrapperProps {
  contributions: number[][];
  squareSize?: number;
  orientation?: Orientation;
}

// Transpose data for vertical orientation
const getGridData = (orientation: Orientation, contributions: number[][]) => {
  if (orientation === "horizontal") {
    return contributions;
  }
  return contributions[0].map((_, colIndex) =>
    contributions.map((row) => row[colIndex]),
  );
};

export default function ContributionCalendarWrapper({
  contributions,
  squareSize = 12,
  orientation: initialOrientation = "horizontal",
}: ContributionCalendarWrapperProps) {
  const [currentTheme, setCurrentTheme] =
    useState<keyof typeof colorConfig.themes>("github-dark");
  const [currentBackground, setCurrentBackground] =
    useState<keyof typeof colorConfig.backgrounds>("solid");
  const [exportFormat, setExportFormat] = useState<"png" | "svg">("png");
  const [orientation, setOrientation] =
    useState<Orientation>(initialOrientation);
  const [padding, setPadding] = useState(32);
  const [borderRadius, setBorderRadius] = useState(16);
  const [showWindowControls, setShowWindowControls] = useState(true);
  const [generatedSVG, setGeneratedSVG] = useState<string>("");
  const calendarRef = useRef<HTMLDivElement>(null);
  const theme = colorConfig.themes[currentTheme];
  const background = colorConfig.backgroundClasses[currentBackground];

  const gridData = useMemo(
    () => getGridData(orientation, contributions),
    [orientation, contributions],
  );
  const gridCols = orientation === "horizontal" ? 53 : 7;
  const gridRows = orientation === "horizontal" ? 7 : 53;

  const getBackgroundColor = () => {
    return theme.background;
  };

  const exportCalendar = async () => {
    if (!calendarRef.current) {
      return;
    }

    try {
      // Show loading state
      const exportBtn = document.querySelector(
        "[data-export-btn]",
      ) as HTMLButtonElement;
      if (exportBtn) {
        exportBtn.textContent = "Exporting...";
        exportBtn.disabled = true;
      }

      if (exportFormat === "svg") {
        // Generate and download SVG
        const svgContent = generateSVG({
          orientation,
          squareSize,
          gridData,
          currentBackground,
          currentTheme,
          borderRadius,
        });
        const blob = new Blob([svgContent], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `contribution-calendar-${Date.now()}.svg`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        // Use html2canvas with safer settings to create the canvas
        const canvas = await html2canvas(calendarRef.current, {
          backgroundColor: getBackgroundColor(),
          scale: 2, // Higher quality
          useCORS: true,
          allowTaint: true,
        });

        // Create download link
        const dataUrl = canvas.toDataURL("image/png", 1.0);
        const link = document.createElement("a");
        link.download = `contribution-calendar-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      }

      // Reset button state
      if (exportBtn) {
        exportBtn.textContent = `Export ${exportFormat.toUpperCase()}`;
        exportBtn.disabled = false;
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");

      // Reset button state on error
      const exportBtn = document.querySelector(
        "[data-export-btn]",
      ) as HTMLButtonElement;
      if (exportBtn) {
        exportBtn.textContent = `Export ${exportFormat.toUpperCase()}`;
        exportBtn.disabled = false;
      }
    }
  };

  // Generate and display SVG
  const handleGenerateSVG = () => {
    const svgContent = generateSVG({
      squareSize,
      orientation,
      gridData,
      currentBackground,
      currentTheme,
      borderRadius,
    });
    setGeneratedSVG(svgContent);
  };

  const getColSpanForTopLabel = (index: number, arrayLength: number) => {
    if (orientation === "horizontal") {
      return 2;
    }
    if (orientation === "vertical" && index !== arrayLength - 1) {
      return 3;
    }
    return 1;
  };

  return (
    <div className={`min-h-screen p-4 ${background}`}>
      {/* Header */}
      <div
        className="p-4 print:hidden rounded-t-lg border"
        style={{
          backgroundColor: theme.header,
          color: theme.text,
          borderColor: theme.border,
        }}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">GitHub Contribution Calendar</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateSVG}
              className="px-3 py-1 rounded text-sm"
              style={{
                backgroundColor: theme.button,
                color: theme.buttonText,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.buttonHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.button;
              }}
            >
              Generate SVG
            </button>
            <button
              onClick={exportCalendar}
              data-export-btn
              className="px-3 py-1 rounded text-sm"
              style={{
                backgroundColor: theme.button,
                color: theme.buttonText,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.buttonHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.button;
              }}
            >
              Export {exportFormat.toUpperCase()}
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div
        className="print:hidden p-4 border-l border-r border-b rounded-b-lg mb-6"
        style={{
          backgroundColor: theme.background,
          color: theme.text,
          borderColor: theme.border,
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Theme Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Theme</label>
            <select
              value={currentTheme}
              onChange={(e) =>
                setCurrentTheme(
                  e.target.value as keyof typeof colorConfig.themes,
                )
              }
              className="w-full p-2 rounded border"
              style={{
                backgroundColor: theme.inputBg,
                color: theme.inputText,
                borderColor: theme.input,
              }}
            >
              {Object.keys(colorConfig.themes).map((themeKey) => (
                <option key={themeKey} value={themeKey}>
                  {themeKey.charAt(0).toUpperCase() +
                    themeKey.slice(1).replace("-", " ")}
                </option>
              ))}
            </select>
          </div>

          {/* Background Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Background</label>
            <select
              value={currentBackground}
              onChange={(e) =>
                setCurrentBackground(
                  e.target.value as keyof typeof colorConfig.backgrounds,
                )
              }
              className="w-full p-2 rounded border"
              style={{
                backgroundColor: theme.inputBg,
                color: theme.inputText,
                borderColor: theme.input,
              }}
            >
              {Object.keys(colorConfig.backgrounds).map((bgKey) => (
                <option key={bgKey} value={bgKey}>
                  {bgKey.charAt(0).toUpperCase() +
                    bgKey.slice(1).replace("-", " ")}
                </option>
              ))}
            </select>
          </div>

          {/* Orientation Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Orientation
            </label>
            <select
              value={orientation}
              onChange={(e) =>
                setOrientation(e.target.value as "horizontal" | "vertical")
              }
              className="w-full p-2 rounded border"
              style={{
                backgroundColor: theme.inputBg,
                color: theme.inputText,
                borderColor: theme.input,
              }}
            >
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
            </select>
          </div>

          {/* Export Format */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Export Format
            </label>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as "png" | "svg")}
              className="w-full p-2 rounded border"
              style={{
                backgroundColor: theme.inputBg,
                color: theme.inputText,
                borderColor: theme.input,
              }}
            >
              <option value="png">PNG</option>
              <option value="svg">SVG</option>
            </select>
          </div>
        </div>

        {/* Advanced Controls */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t"
          style={{ borderColor: theme.border }}
        >
          {/* Padding Control */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Padding: {padding}px
            </label>
            <input
              type="range"
              min="16"
              max="64"
              value={padding}
              onChange={(e) => setPadding(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Border Radius Control */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Border Radius: {borderRadius}px
            </label>
            <input
              type="range"
              min="0"
              max="32"
              value={borderRadius}
              onChange={(e) => setBorderRadius(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Window Controls Toggle */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showWindowControls}
                onChange={(e) => setShowWindowControls(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium">Show Window Controls</span>
            </label>
          </div>
        </div>
      </div>

      {/* Calendar Container */}
      <div className="flex justify-center">
        <div
          ref={calendarRef}
          className="relative overflow-hidden shadow-2xl"
          style={{
            backgroundColor: theme.background,
            color: theme.text,
            padding: `${padding}px`,
            borderRadius: `${borderRadius}px`,
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
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
            <h2 className="text-lg font-semibold">Contribution Activity</h2>
          </div>

          {/* Calendar Grid */}
          <div className="flex items-center justify-center">
            <div className="flex flex-col w-fit rounded-lg p-4">
              <div className="flex min-w-fit w-full">
                {/* Side labels */}
                <div
                  className="flex flex-col justify-between mr-3 text-xs opacity-70 font-mono"
                  style={{ color: theme.text }}
                >
                  {(orientation === "horizontal"
                    ? WEEKDAYS_SHORT_STRING
                    : MONTHS_SHORT_STRING
                  ).map((label, index) => (
                    <div
                      key={label}
                      className="flex items-center justify-end pr-2"
                      style={{
                        marginBottom: "2px",
                        height: `${squareSize}px`,
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
                      className="grid mb-2 text-xs opacity-70"
                      style={{
                        color: theme.text,
                        gridTemplateColumns:
                          orientation === "horizontal"
                            ? "repeat(12, minmax(0, 1fr))"
                            : "repeat(8, minmax(0, 1fr))",
                      }}
                    >
                      {(orientation === "horizontal"
                        ? MONTHS_SHORT_STRING
                        : WEEKDAYS_SHORT_STRING
                      ).map((label, index, array) =>
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
            <span className="mr-3 opacity-60 text-xs">Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className="w-4 h-4 rounded-sm mr-2 border border-white/30 dark:border-gray-600/50 transition-transform hover:scale-110"
                style={{
                  backgroundColor: getGridColor(level, currentTheme),
                }}
              />
            ))}
            <span className="ml-1 opacity-60 text-xs">More</span>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 text-xs opacity-40 font-mono">
            Generated with GitFlex
          </div>
        </div>
      </div>

      {/* SVG Display Section */}
      {generatedSVG && (
        <div className="mt-8">
          <div
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: theme.background,
              color: theme.text,
              borderColor: theme.border,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Generated SVG</h3>
              <button
                onClick={() => {
                  const blob = new Blob([generatedSVG], {
                    type: "image/svg+xml",
                  });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.download = `contribution-calendar-${Date.now()}.svg`;
                  link.href = url;
                  link.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-3 py-1 rounded text-sm"
                style={{
                  backgroundColor: theme.button,
                  color: theme.buttonText,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.buttonHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.button;
                }}
              >
                Download SVG
              </button>
            </div>
            <div
              className="border rounded-lg overflow-auto max-h-96"
              style={{ borderColor: theme.border }}
            >
              <pre
                className="p-4 text-xs font-mono overflow-x-auto"
                style={{ color: theme.text }}
              >
                <code>{generatedSVG}</code>
              </pre>
            </div>
            <div
              className="mt-4 p-4 border rounded-lg"
              style={{ borderColor: theme.border }}
            >
              <h4 className="text-sm font-semibold mb-2">SVG Preview:</h4>
              <div className="flex justify-center">
                <div
                  dangerouslySetInnerHTML={{ __html: generatedSVG }}
                  className="border rounded"
                  style={{ borderColor: theme.border }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
