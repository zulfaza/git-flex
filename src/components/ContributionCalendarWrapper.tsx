"use client";

import { useMemo, useRef } from "react";
import ColorPicker from "@/components/ColorPicker";
import ContributionCalendar from "@/components/ContributionCalendar";
import ContributionSkeleton from "@/components/ContributionSkeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { colorConfig } from "@/constants/colors";
import { getGridData } from "@/lib/gridUtils";
import { exportCalendar } from "@/lib/exportUtils";
import { useColorManagement } from "@/hooks/useColorManagement";
import { useCalendarStore } from "@/stores/calendarStore";
import type {
  ContributionCalendarWrapperProps,
  CustomThemeColors,
  DateRangeOption,
} from "@/types/calendar";

export default function ContributionCalendarWrapper({
  contributions,
  isLoading = false,
  squareSize = 12,
  dateRangeOption = "year-ago",
  onDateRangeChange,
  showDateRangeSelector = false,
}: ContributionCalendarWrapperProps) {
  const {
    currentTheme,
    customColors,
    selectedColorId,
    openPopover,
    openerRef,
    handleThemeChange,
    resetColors,
    resolveSelectedHex,
    applySelectedHex,
    setSelectedColorId,
    setOpenPopover,
  } = useColorManagement();

  const {
    exportFormat,
    layout,
    padding,
    borderRadius,
    wrapperPaddingX,
    wrapperPaddingY,
    title,
    showTitle,
    showLegend,
    setLayout,
    setPadding,
    setBorderRadius,
    setWrapperPaddingX,
    setWrapperPaddingY,
    setTitle,
    setShowTitle,
    setShowLegend,
  } = useCalendarStore();

  const calendarRef = useRef<HTMLDivElement>(null);

  const handleExportCalendar = () => {
    exportCalendar({
      calendarRef,
      exportFormat,
      layout,
      squareSize,
      gridData,
      customColors,
      borderRadius,
    });
  };

  const gridData = useMemo(
    () => getGridData(layout, contributions),
    [layout, contributions],
  );
  const gridCols =
    layout === "horizontal"
      ? 53
      : layout === "vertical"
        ? 7
        : layout === "3x4"
          ? 13
          : 17;

  const baseColorEntries = Object.entries(customColors).filter(
    ([k]) => k !== "legendColors",
  ) as [keyof CustomThemeColors, string][];

  return (
    <div className="min-h-screen p-4">
      <div className="flex flex-col lg:flex-row gap-6 min-h-[500px]">
        <div className="h-full w-full lg:w-80 flex-shrink-0">
          <Accordion
            defaultValue={["appearance"]}
            type="multiple"
            className="space-y-2"
          >
            <AccordionItem
              value="appearance"
              className="border border-gray-600"
            >
              <AccordionTrigger className="px-4 text-white hover:no-underline">
                Appearance
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      Theme
                    </label>
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

                  {showDateRangeSelector && onDateRangeChange && (
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">
                        Time Period
                      </label>
                      <select
                        value={dateRangeOption}
                        onChange={(e) =>
                          onDateRangeChange(e.target.value as DateRangeOption)
                        }
                        className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="year-ago">Past 365 Days</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                      </select>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="layout" className="border border-gray-600">
              <AccordionTrigger className="px-4 text-white hover:no-underline">
                Layout & Spacing
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      Layout
                    </label>
                    <select
                      value={layout}
                      onChange={(e) =>
                        setLayout(
                          e.target.value as
                            | "horizontal"
                            | "vertical"
                            | "3x4"
                            | "4x3",
                        )
                      }
                      className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="horizontal">Horizontal</option>
                      <option value="vertical">Vertical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
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

                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
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

                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      Horizontal Padding: {wrapperPaddingX}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={wrapperPaddingX}
                      onChange={(e) =>
                        setWrapperPaddingX(Number(e.target.value))
                      }
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      Vertical Padding: {wrapperPaddingY}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={wrapperPaddingY}
                      onChange={(e) =>
                        setWrapperPaddingY(Number(e.target.value))
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="colors" className="border border-gray-600">
              <AccordionTrigger className="px-4 text-white hover:no-underline">
                <div className="flex items-center justify-between w-full">
                  <span>Custom Colors</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-end">
                    <button
                      onClick={resetColors}
                      className="px-2 py-1 text-xs rounded bg-gray-600 text-white hover:bg-gray-500 transition-colors mr-4"
                      title="Reset to theme defaults"
                    >
                      Reset
                    </button>
                  </div>
                  <div className="space-y-1 pr-1 border border-gray-600 rounded p-2 bg-gray-750">
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
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="display" className="border border-gray-600">
              <AccordionTrigger className="px-4 text-white hover:no-underline">
                Display Options
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center text-sm font-medium mb-2 text-white">
                      <input
                        type="checkbox"
                        checked={showTitle}
                        onChange={(e) => setShowTitle(e.target.checked)}
                        className="mr-2"
                      />
                      Show Title
                    </label>
                    {showTitle && (
                      <div className="mt-2">
                        <label className="block text-sm font-medium mb-2 text-white">
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

                  <div>
                    <label className="flex items-center text-sm font-medium mb-2 text-white">
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
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="export" className="border border-gray-600">
              <AccordionTrigger className="px-4 text-white hover:no-underline">
                Export
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <button
                  onClick={handleExportCalendar}
                  data-export-btn
                  className="w-full px-3 py-2 rounded text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Export {exportFormat.toUpperCase()}
                </button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="border border-gray-600 overflow-x-auto h-full p-2">
          <div
            id="contribution-wrapper"
            ref={calendarRef}
            style={{
              backgroundColor: customColors.wrapperBackground,
              paddingLeft: `${wrapperPaddingX}px`,
              paddingRight: `${wrapperPaddingX}px`,
              paddingTop: `${wrapperPaddingY}px`,
              paddingBottom: `${wrapperPaddingY}px`,
              width: "max-content",
              minWidth: `${(layout === "horizontal" ? 800 : layout === "vertical" ? 320 : 600) + (wrapperPaddingX * 2)}px`,
            }}
            className="flex justify-center items-center "
          >
            {isLoading ? (
              <ContributionSkeleton
                layout={layout}
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
                layout={layout}
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
      </div>
    </div>
  );
}
