"use client";

import type { ContributionGridCell } from "@/lib/githubApi";

import { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import { useSearchParams } from "next/navigation";
import ColorPicker from "@/components/ColorPicker";
import ContributionCalendar from "@/components/ContributionCalendar";
import ContributionSkeleton from "@/components/ContributionSkeleton";
import { colorConfig } from "@/constants/colors";
import { useGitHubContributions } from "@/hooks/useGitHubContributions";
import { generateSVG } from "@/lib/generateSVG";

interface CustomThemeColors {
  background: string;
  wrapperBackground: string;
  text: string;
  border: string;
  legendColors: string[];
}

const createCustomThemeColors = (
  theme: keyof typeof colorConfig.themes,
): CustomThemeColors => {
  return {
    ...colorConfig.themes[theme],
    legendColors: [...colorConfig.contributionColors[theme]],
  };
};

type Orientation = "horizontal" | "vertical";

interface ContributionCalendarWrapperProps {
  contributions: (ContributionGridCell | null)[][];
  isLoading?: boolean;
  squareSize?: number;
  orientation?: Orientation;
  selectedYear?: number;
  onYearChange?: (year: number) => void;
  showYearSelector?: boolean;
}

// Transpose data for vertical orientation
const getGridData = (
  orientation: Orientation,
  contributions: (ContributionGridCell | null)[][],
) => {
  if (orientation === "horizontal") {
    return contributions;
  }

  // For vertical orientation, transpose the matrix
  // Find the maximum column length to handle incomplete rows
  const maxCols = Math.max(...contributions.map((row) => row.length));

  return Array.from({ length: maxCols }, (_, colIndex) =>
    contributions.map((row) => row[colIndex] || null),
  );
};

function ContributionCalendarWrapper({
  contributions,
  isLoading = false,
  squareSize = 12,
  orientation: initialOrientation = "horizontal",
  selectedYear = 2025,
  onYearChange,
  showYearSelector = false,
}: ContributionCalendarWrapperProps) {
  const [currentTheme, setCurrentTheme] =
    useState<keyof typeof colorConfig.themes>("github-dark");
  const [customColors, setCustomColors] = useState<CustomThemeColors>(
    createCustomThemeColors("github-dark"),
  );
  const [
    exportFormat,
    // setExportFormat
  ] = useState<"png" | "svg">("png");
  const [orientation, setOrientation] =
    useState<Orientation>(initialOrientation);
  const [padding, setPadding] = useState(16);
  const [borderRadius, setBorderRadius] = useState(0);
  const [wrapperPaddingX, setWrapperPaddingX] = useState(0);
  const [wrapperPaddingY, setWrapperPaddingY] = useState(0);
  const [title, setTitle] = useState("Contribution Activity");
  const [showTitle, setShowTitle] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  // const [
  //   generatedSVG,
  //   setGeneratedSVG
  // ] = useState<string>("");
  const calendarRef = useRef<HTMLDivElement>(null);
  const theme = customColors;

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

  const gridData = useMemo(
    () => getGridData(orientation, contributions),
    [orientation, contributions],
  );
  const gridCols = orientation === "horizontal" ? 53 : 7;

  const exportCalendar = async () => {
    if (!calendarRef.current) {
      return;
    }

    try {
      // Show loading state
      const exportBtn = document.querySelector(
        "[data-export-btn]",
      ) as HTMLButtonElement;
      {
        exportBtn.textContent = "Exporting...";
        exportBtn.disabled = true;
      }

      if (exportFormat === "svg") {
        // Generate and download SVG
        const svgContent = generateSVG({
          orientation,
          squareSize,
          gridData,
          customColors,
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
          backgroundColor: "#1f2937", // gray-800
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

  // // Generate and display SVG
  // const handleGenerateSVG = () => {
  //   const svgContent = generateSVG({
  //     squareSize,
  //     orientation,
  //     gridData,
  //     customColors,
  //     borderRadius,
  //   });
  //   setGeneratedSVG(svgContent);
  // };

  // selection state id pattern: base:<key> or legend:<index>
  const [selectedColorId, setSelectedColorId] =
    useState<string>("base:background");
  const [openPopover, setOpenPopover] = useState<{
    id: string;
    x: number;
    y: number;
  } | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  // close on escape / resize / scroll
  useEffect(() => {
    if (!openPopover) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenPopover(null);
    };
    const close = () => setOpenPopover(null);
    window.addEventListener("keydown", handle);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("keydown", handle);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [openPopover]);

  useEffect(() => {
    if (!openPopover && openerRef.current) {
      openerRef.current.focus();
    }
  }, [openPopover]);
  const baseColorEntries = Object.entries(customColors).filter(
    ([k]) => k !== "legendColors",
  ) as [keyof CustomThemeColors, string][];
  const resolveSelectedHex = () => {
    if (selectedColorId.startsWith("base:")) {
      const key = selectedColorId.slice(5) as keyof CustomThemeColors;
      return customColors[key] as string;
    }
    if (selectedColorId.startsWith("legend:")) {
      const idx = parseInt(selectedColorId.slice(7), 10);
      return customColors.legendColors[idx];
    }
    return "#000000";
  };
  const applySelectedHex = (hex: string) => {
    if (selectedColorId.startsWith("base:")) {
      const key = selectedColorId.slice(5) as keyof CustomThemeColors;
      handleColorChange(key, hex);
    } else if (selectedColorId.startsWith("legend:")) {
      const idx = parseInt(selectedColorId.slice(7), 10);
      handleLegendColorChange(idx, hex);
    }
  };
  return (
    <div className="min-h-screen p-4">
      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-6 min-h-[500px]">
        {/* Controls - Left Sidebar */}
        <div className="print:hidden bg-gray-900 border-gray-700 h-full w-full lg:w-80 flex-shrink-0 p-4 border rounded-lg">
          <div className="grid grid-cols-1 gap-4">
            {/* Theme Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Theme</label>
              <select
                value={currentTheme}
                onChange={(e) =>
                  handleThemeChange(
                    e.target.value as keyof typeof colorConfig.themes,
                  )
                }
                className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                {Object.keys(colorConfig.themes).map((themeKey) => (
                  <option key={themeKey} value={themeKey}>
                    {themeKey.charAt(0).toUpperCase() +
                      themeKey.slice(1).replace("-", " ")}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Selection */}
            {showYearSelector && onYearChange && (
              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => onYearChange(parseInt(e.target.value))}
                  className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  {[2021, 2022, 2023, 2024, 2025].map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            )}

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
                className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
              </select>
            </div>

            {/* Custom Color Controls */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-white">
                  Custom Colors
                </label>
                <button
                  onClick={() => {
                    setCustomColors(createCustomThemeColors(currentTheme));
                    setSelectedColorId("base:background");
                  }}
                  className="px-2 py-1 text-xs rounded bg-gray-600 text-white hover:bg-gray-500 transition-colors"
                  title="Reset to theme defaults"
                >
                  Reset
                </button>
              </div>
              <div className="flex flex-col gap-3">
                <div className="space-y-1  pr-1 border border-gray-600 rounded p-2 bg-gray-750">
                  {baseColorEntries.map(([colorKey, colorValue]) => {
                    const id = `base:${colorKey}`;
                    const selected = selectedColorId === id;
                    return (
                      <button
                        key={colorKey as string}
                        type="button"
                        onClick={(e) => {
                          setSelectedColorId(id);
                          const rect = (
                            e.currentTarget as HTMLButtonElement
                          ).getBoundingClientRect();
                          openerRef.current = e.currentTarget;
                          setOpenPopover({
                            id,
                            x: rect.right + 8,
                            y: rect.top + window.scrollY,
                          });
                        }}
                        className={`w-full flex items-center gap-2 px-2 py-1 rounded border text-left text-xs transition-colors ${selected ? "border-blue-500 bg-blue-500/20" : "border-gray-600 hover:border-gray-500 bg-gray-700/40 hover:bg-gray-700/60"}`}
                        title={`Select ${colorKey} color`}
                      >
                        <span
                          className="w-5 h-5 rounded border border-gray-600"
                          style={{ background: colorValue }}
                        />
                        <span className="capitalize flex-1">
                          {(colorKey as string)
                            .replace(/([A-Z])/g, " $1")
                            .trim()}
                        </span>
                        <span className="font-mono text-[10px]">
                          {colorValue}
                        </span>
                      </button>
                    );
                  })}
                  <div className="pt-2 mt-2 border-t border-gray-600/70 text-[10px] uppercase tracking-wide text-gray-400">
                    Legend
                  </div>
                  {customColors.legendColors.map((c, i) => {
                    const id = `legend:${i}`;
                    const selected = selectedColorId === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={(e) => {
                          setSelectedColorId(id);
                          const rect = (
                            e.currentTarget as HTMLButtonElement
                          ).getBoundingClientRect();
                          openerRef.current = e.currentTarget;
                          setOpenPopover({
                            id,
                            x: rect.right + 8,
                            y: rect.top + window.scrollY,
                          });
                        }}
                        className={`w-full flex items-center gap-2 px-2 py-1 rounded border text-left text-xs transition-colors ${selected ? "border-blue-500 bg-blue-500/20" : "border-gray-600 hover:border-gray-500 bg-gray-700/40 hover:bg-gray-700/60"}`}
                        title={`Select legend level ${i}`}
                      >
                        <span
                          className="w-5 h-5 rounded border border-gray-600"
                          style={{ background: c }}
                        />
                        <span className="flex-1">Level {i}</span>
                        <span className="font-mono text-[10px]">{c}</span>
                      </button>
                    );
                  })}
                </div>
                {openPopover && openPopover.id === selectedColorId && (
                  <>
                    {/* click outside catcher */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setOpenPopover(null)}
                    />
                    <div
                      className="fixed z-50"
                      style={{ top: openPopover.y, left: openPopover.x }}
                      role="dialog"
                      aria-label="Color picker"
                    >
                      <div className="relative bg-gray-800 border border-gray-600 rounded shadow-lg p-2 w-60">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[11px] font-mono px-1 py-0.5 rounded bg-gray-700 border border-gray-600">
                            {selectedColorId}
                          </span>
                          <button
                            className="text-[11px] px-2 py-0.5 rounded bg-gray-700 border border-gray-600 hover:bg-gray-600"
                            onClick={() => setOpenPopover(null)}
                          >
                            Close
                          </button>
                        </div>
                        <ColorPicker
                          value={resolveSelectedHex()}
                          onChange={applySelectedHex}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Export Format */}
            {/*<div>
              <label className="block text-sm font-medium mb-2">
                Export Format
              </label>
              <select
                value={exportFormat}
                onChange={(e) =>
                  setExportFormat(e.target.value as "png" | "svg")
                }
                className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="png">PNG</option>
                <option value="svg">SVG</option>
              </select>
            </div>*/}
          </div>

          {/* Advanced Controls */}
          <div className="grid grid-cols-1 gap-4 mt-4 pt-4 border-t border-gray-600">
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

            {/* Wrapper Horizontal Padding Control */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Horizontal Padding: {wrapperPaddingX}px
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={wrapperPaddingX}
                onChange={(e) => setWrapperPaddingX(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Wrapper Vertical Padding Control */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Vertical Padding: {wrapperPaddingY}px
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={wrapperPaddingY}
                onChange={(e) => setWrapperPaddingY(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Title Controls */}
            <div className="pt-4 border-t border-gray-600">
              <div className="mb-4">
                <label className="flex items-center text-sm font-medium mb-2">
                  <input
                    type="checkbox"
                    checked={showTitle}
                    onChange={(e) => setShowTitle(e.target.checked)}
                    className="mr-2"
                  />
                  Show Title
                </label>
              </div>
              {showTitle && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Title Text
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter title text"
                  />
                </div>
              )}
            </div>

            {/* Legend Controls */}
            <div>
              <label className="flex items-center text-sm font-medium mb-2">
                <input
                  type="checkbox"
                  checked={showLegend}
                  onChange={(e) => setShowLegend(e.target.checked)}
                  className="mr-2"
                />
                Show Legend
              </label>
            </div>

            <div>
              <div className="flex flex-col gap-2">
                {/*<button
                  onClick={handleGenerateSVG}
                  className="px-3 py-2 block w-full rounded text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Generate SVG
                </button>*/}
                <button
                  onClick={exportCalendar}
                  data-export-btn
                  className="px-3 py-2 rounded text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Export {exportFormat.toUpperCase()}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          id="contribution-wrapper"
          ref={calendarRef}
          style={{
            backgroundColor: theme.wrapperBackground,
            paddingLeft: `${wrapperPaddingX}px`,
            paddingRight: `${wrapperPaddingX}px`,
            paddingTop: `${wrapperPaddingY}px`,
            paddingBottom: `${wrapperPaddingY}px`,
          }}
          className="flex justify-center items-center h-full"
        >
          {isLoading ? (
            <ContributionSkeleton
              orientation={orientation}
              padding={padding}
              borderRadius={borderRadius}
              gridData={gridData}
              gridCols={gridCols}
              showTitle={showTitle}
              showLegend={showLegend}
              title={title}
            />
          ) : (
            <ContributionCalendar
              orientation={orientation}
              customColors={customColors}
              padding={padding}
              borderRadius={borderRadius}
              gridData={gridData}
              gridCols={gridCols}
              title={title}
              showTitle={showTitle}
              showLegend={showLegend}
            />
          )}
        </div>
      </div>

      {/* SVG Display Section */}
      {/*{generatedSVG && (
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
              >
                Download SVG
              </button>
            </div>
            <div className="border rounded-lg overflow-auto max-h-96">
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
      )}*/}
    </div>
  );
}

interface UserPageClientProps {
  username: string;
}

const years = [2021, 2022, 2023, 2024, 2025];

export default function UserPageClient({ username }: UserPageClientProps) {
  const searchParams = useSearchParams();
  const [selectedYear, setSelectedYear] = useState(2025);

  const urlFrom = searchParams.get("from");
  const urlTo = searchParams.get("to");

  const from = urlFrom || `${selectedYear}-01-01T00:00:00.000Z`;
  const to = urlTo || `${selectedYear}-12-31T23:59:59.999Z`;

  useEffect(() => {
    if (urlFrom && !urlTo) {
      const yearFromUrl = new Date(urlFrom).getFullYear();
      if (years.includes(yearFromUrl)) {
        setSelectedYear(yearFromUrl);
      }
    }
  }, [urlFrom, urlTo]);

  const { data, isLoading, error } = useGitHubContributions(
    username,
    from,
    to,
  );

  const defaultContributions = Array.from({ length: 7 }, () =>
    Array(53)
      .fill(null)
      .map(() => ({ date: "", contributionCount: 0, level: 0 })),
  );

  const contributions = data?.success ? data.data : defaultContributions;

  return (
    <div className="bg-gray-900">
      <div className="max-w-[1440px] mx-auto p-4">
        <div className="mb-6 px-4">
          <h1 className="text-2xl font-bold text-white mb-2">
            {username}&apos;s GitHub Contributions
          </h1>

          <p className="text-gray-400">
            {isLoading ? (
              <span className="animate-pulse">Loading contributions...</span>
            ) : error || !data?.success ? (
              <span className="text-red-400">
                {data?.error ||
                  error?.message ||
                  "Failed to fetch contributions"}
              </span>
            ) : from && to ? (
              `Contribution calendar from ${from} to ${to}`
            ) : from ? (
              `Contributions from ${from}`
            ) : to ? (
              `Contributions up to ${to}`
            ) : (
              "Contribution calendar for the past year"
            )}
          </p>
        </div>
        <ContributionCalendarWrapper
          contributions={contributions}
          isLoading={isLoading}
          squareSize={12}
          orientation="horizontal"
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          showYearSelector={!urlFrom && !urlTo}
        />
      </div>
    </div>
  );
}
