"use client";

import { useState, useRef, useMemo } from "react";
import html2canvas from "html2canvas-pro";
import { colorConfig } from "../constants/colors";
import { generateSVG } from "../lib/generateSVG";
import ContributionCalendar from "./ContributionCalendar";
import ColorPicker from './ColorPicker'; // will refactor to shared picker

interface CustomThemeColors {
  background: string;
  text: string;
  border: string;
  header: string;
  button: string;
  buttonHover: string;
  buttonText: string;
  input: string;
  inputBg: string;
  inputText: string;
  legendColors: string[];
}

const createCustomThemeColors = (theme: keyof typeof colorConfig.themes): CustomThemeColors => {
  return {
    ...colorConfig.themes[theme],
    legendColors: [...colorConfig.contributionColors[theme]]
  };
};

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
  const [customColors, setCustomColors] = useState<CustomThemeColors>(
    createCustomThemeColors("github-dark")
  );
  const [currentBackground, setCurrentBackground] =
    useState<keyof typeof colorConfig.backgrounds>("solid");
  const [exportFormat, setExportFormat] = useState<"png" | "svg">("png");
  const [orientation, setOrientation] =
    useState<Orientation>(initialOrientation);
  const [padding, setPadding] = useState(32);
  const [borderRadius, setBorderRadius] = useState(16);
  const [title, setTitle] = useState("Contribution Activity");
  const [showTitle, setShowTitle] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [generatedSVG, setGeneratedSVG] = useState<string>("");
  const calendarRef = useRef<HTMLDivElement>(null);
  const theme = customColors;
  const background = colorConfig.backgroundClasses[currentBackground];

  const handleThemeChange = (newTheme: keyof typeof colorConfig.themes) => {
    setCurrentTheme(newTheme);
    setCustomColors(createCustomThemeColors(newTheme));
  };

  const handleColorChange = (colorKey: keyof CustomThemeColors, value: string) => {
    setCustomColors(prev => ({
      ...prev,
      [colorKey]: value
    }));
  };

  const handleLegendColorChange = (index: number, value: string) => {
    setCustomColors(prev => ({
      ...prev,
      legendColors: prev.legendColors.map((color, i) => i === index ? value : color)
    }));
  };

  const gridData = useMemo(
    () => getGridData(orientation, contributions),
    [orientation, contributions],
  );
  const gridCols = orientation === "horizontal" ? 53 : 7;
  const gridRows = orientation === "horizontal" ? 7 : 53;

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
          currentBackground,
          currentTheme,
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

  // Generate and display SVG
  const handleGenerateSVG = () => {
    const svgContent = generateSVG({
      squareSize,
      orientation,
      gridData,
      currentBackground,
      currentTheme,
      customColors,
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

  // selection state id pattern: base:<key> or legend:<index>
  const [selectedColorId, setSelectedColorId] = useState<string>('base:background')
  const baseColorEntries = Object.entries(customColors).filter(([k]) => k !== 'legendColors') as [keyof CustomThemeColors, string][]
  const resolveSelectedHex = () => {
    if (selectedColorId.startsWith('base:')) {
      const key = selectedColorId.slice(5) as keyof CustomThemeColors
      return customColors[key] as string
    }
    if (selectedColorId.startsWith('legend:')) {
      const idx = parseInt(selectedColorId.slice(7), 10)
      return customColors.legendColors[idx]
    }
    return '#000000'
  }
  const applySelectedHex = (hex: string) => {
    if (selectedColorId.startsWith('base:')) {
      const key = selectedColorId.slice(5) as keyof CustomThemeColors
      handleColorChange(key, hex)
    } else if (selectedColorId.startsWith('legend:')) {
      const idx = parseInt(selectedColorId.slice(7), 10)
      handleLegendColorChange(idx, hex)
    }
  }
  return (
    <div className={`min-h-screen p-4 bg-gray-900`}>
      {/* Header */}
      <div className="bg-gray-900 text-white border border-gray-700 rounded-t-lg p-4 mb-6 print:hidden">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">GitHub Contribution Calendar</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateSVG}
              className="px-3 py-1 rounded text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Generate SVG
            </button>
            <button
              onClick={exportCalendar}
              data-export-btn
              className="px-3 py-1 rounded text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Export {exportFormat.toUpperCase()}
            </button>
            </div>
          </div>
        </div>

      {/* Main Layout */}
      <div className="flex gap-6">
        {/* Controls - Left Sidebar */}
        <div className="print:hidden h-full w-80 flex-shrink-0 p-4 border border-gray-700 rounded-lg bg-gray-800 text-white">
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

            {/* Custom Color Controls */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-white">Custom Colors</label>
                <button
                  onClick={() => {setCustomColors(createCustomThemeColors(currentTheme)); setSelectedColorId('base:background')}}
                  className="px-2 py-1 text-xs rounded bg-gray-600 text-white hover:bg-gray-500 transition-colors"
                  title="Reset to theme defaults"
                >
                  Reset
                </button>
              </div>
              <div className="flex flex-col gap-3">
                <div className="space-y-1 max-h-56 overflow-y-auto pr-1 border border-gray-600 rounded p-2 bg-gray-750">
                  {baseColorEntries.map(([colorKey, colorValue]) => {
                    const id = `base:${colorKey}`
                    const selected = selectedColorId === id
                    return (
                      <button
                        key={colorKey as string}
                        type="button"
                        onClick={() => setSelectedColorId(id)}
                        className={`w-full flex items-center gap-2 px-2 py-1 rounded border text-left text-xs transition-colors ${selected ? 'border-blue-500 bg-blue-500/20' : 'border-gray-600 hover:border-gray-500 bg-gray-700/40 hover:bg-gray-700/60'}`}
                        title={`Select ${colorKey} color`}
                      >
                        <span className="w-5 h-5 rounded border border-gray-600" style={{ background: colorValue }} />
                        <span className="capitalize flex-1">{(colorKey as string).replace(/([A-Z])/g,' $1').trim()}</span>
                        <span className="font-mono text-[10px]">{colorValue}</span>
                      </button>
                    )
                  })}
                  <div className="pt-2 mt-2 border-t border-gray-600/70 text-[10px] uppercase tracking-wide text-gray-400">Legend</div>
                  {customColors.legendColors.map((c, i) => {
                    const id = `legend:${i}`
                    const selected = selectedColorId === id
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setSelectedColorId(id)}
                        className={`w-full flex items-center gap-2 px-2 py-1 rounded border text-left text-xs transition-colors ${selected ? 'border-blue-500 bg-blue-500/20' : 'border-gray-600 hover:border-gray-500 bg-gray-700/40 hover:bg-gray-700/60'}`}
                        title={`Select legend level ${i}`}
                      >
                        <span className="w-5 h-5 rounded border border-gray-600" style={{ background: c }} />
                        <span className="flex-1">Level {i}</span>
                        <span className="font-mono text-[10px]">{c}</span>
                      </button>
                    )
                  })}
                </div>
                <div className="border border-gray-600 rounded p-2 bg-gray-750">
                  <div className="text-[11px] font-medium mb-2 text-gray-300 flex justify-between items-center">
                    <span>Edit Selected</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-gray-700 border border-gray-600 font-mono">{selectedColorId}</span>
                  </div>
                  <ColorPicker value={resolveSelectedHex()} onChange={applySelectedHex} />
                </div>
              </div>
            </div>

            {/* Background Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Background
              </label>
              <select
                value={currentBackground}
                onChange={(e) =>
                  setCurrentBackground(
                    e.target.value as keyof typeof colorConfig.backgrounds,
                  )
                }
                className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                onChange={(e) =>
                  setExportFormat(e.target.value as "png" | "svg")
                }
                className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="png">PNG</option>
                <option value="svg">SVG</option>
              </select>
            </div>
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
          </div>
        </div>

        <div
          ref={calendarRef}
          className={`${background} flex w-full h-full p-10`}
        >
          <ContributionCalendar
            squareSize={squareSize}
            orientation={orientation}
            customColors={customColors}
            padding={padding}
            borderRadius={borderRadius}
            gridData={gridData}
            gridCols={gridCols}
            gridRows={gridRows}
            getColSpanForTopLabel={getColSpanForTopLabel}
            title={title}
            showTitle={showTitle}
            showLegend={showLegend}
          />
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
