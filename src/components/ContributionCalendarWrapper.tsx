"use client";

import { useMemo, useRef } from "react";
import ColorPicker from "@/components/ColorPicker";
import ContributionCalendar from "@/components/ContributionCalendar";
import ContributionSkeleton from "@/components/ContributionSkeleton";
import { Button } from "@/components/retroui/Button";
import { Accordion } from "@/components/retroui/Accordion";
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
import { Slider } from "./retroui/Slider";
import { Select } from "./retroui/Select";
import { Card } from "./retroui/Card";

const AccordionContent = Accordion.Content;
const AccordionItem = Accordion.Item;
const AccordionTrigger = Accordion.Header;

export default function ContributionCalendarWrapper({
  contributions,
  isLoading = false,
  squareSize = 12,
  dateRangeOption = "year-ago",
  onDateRangeChange,
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
  const last5Years = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 5 }, (_, i) =>
      (now.getFullYear() - i).toString(),
    );
  }, []);

  return (
    <div className="min-h-screen p-4">
      <div className="flex flex-col lg:flex-row gap-6 min-h-[500px]">
        <div className="h-full w-full lg:w-80 flex-shrink-0">
          <Accordion
            defaultValue={["appearance"]}
            type="multiple"
            className="space-y-2"
          >
            <AccordionItem value="appearance">
              <AccordionTrigger className="px-4 text-foreground hover:no-underline font-head">
                Appearance
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 ">
                      Theme
                    </label>
                    <Select
                      value={currentTheme}
                      onValueChange={(v) =>
                        handleThemeChange(v as keyof typeof colorConfig.themes)
                      }
                    >
                      <Select.Trigger className="w-full">
                        <Select.Value placeholder="Pick your date range" />
                      </Select.Trigger>
                      <Select.Content>
                        <Select.Group>
                          <Select.Item value="year-ago">
                            Past 365 Days
                          </Select.Item>
                          {Object.keys(colorConfig.themes).map((themeKey) => (
                            <Select.Item key={themeKey} value={themeKey}>
                              {themeKey.charAt(0).toUpperCase() +
                                themeKey.slice(1).replace("-", " ")}
                            </Select.Item>
                          ))}
                        </Select.Group>
                      </Select.Content>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 ">
                      Time Period
                    </label>
                    <Select
                      value={dateRangeOption}
                      onValueChange={(v) =>
                        onDateRangeChange
                          ? onDateRangeChange(v as DateRangeOption)
                          : null
                      }
                    >
                      <Select.Trigger className="w-full">
                        <Select.Value placeholder="Pick your date range" />
                      </Select.Trigger>
                      <Select.Content>
                        <Select.Group>
                          <Select.Item value="year-ago">
                            Past 365 Days
                          </Select.Item>
                          {last5Years.map((year) => (
                            <Select.Item key={year} value={year}>
                              {year}
                            </Select.Item>
                          ))}
                        </Select.Group>
                      </Select.Content>
                    </Select>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="layout">
              <AccordionTrigger className="px-4 text-foreground hover:no-underline font-head">
                Layout & Spacing
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 ">
                      Layout
                    </label>
                    <Select
                      value={layout}
                      onValueChange={(v) =>
                        setLayout(
                          v as "horizontal" | "vertical" | "3x4" | "4x3",
                        )
                      }
                    >
                      <Select.Trigger className="w-full">
                        <Select.Value placeholder="Pick your layout" />
                      </Select.Trigger>
                      <Select.Content>
                        <Select.Group>
                          <Select.Item value="horizontal">
                            Horizontal
                          </Select.Item>
                          <Select.Item value="vertical">Vertical</Select.Item>
                        </Select.Group>
                      </Select.Content>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 ">
                      Padding: {padding}px
                    </label>
                    <Slider
                      value={[padding]}
                      onValueChange={(value) => setPadding(value[0])}
                      min={16}
                      max={64}
                      step={1}
                      aria-label="Slider Control padding"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 ">
                      Border Radius: {borderRadius}px
                    </label>
                    <Slider
                      value={[borderRadius]}
                      onValueChange={(value) => setBorderRadius(value[0])}
                      min={0}
                      max={32}
                      step={1}
                      aria-label="Slider Control border radius"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 ">
                      Horizontal Padding: {wrapperPaddingX}px
                    </label>
                    <Slider
                      value={[wrapperPaddingX]}
                      onValueChange={(value) => setWrapperPaddingX(value[0])}
                      min={0}
                      max={100}
                      step={1}
                      aria-label="Slider Control horizontal padding"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 ">
                      Vertical Padding: {wrapperPaddingY}px
                    </label>
                    <Slider
                      value={[wrapperPaddingY]}
                      onValueChange={(value) => setWrapperPaddingY(value[0])}
                      min={0}
                      max={100}
                      step={1}
                      aria-label="Slider Control vertical padding"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="colors">
              <AccordionTrigger className="px-4  hover:no-underline">
                <div className="flex items-center justify-between w-full">
                  <span>Custom Colors</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-end">
                    <Button
                      onClick={resetColors}
                      size="sm"
                      variant="secondary"
                      className="mr-4"
                      title="Reset to theme defaults"
                    >
                      Reset
                    </Button>
                  </div>
                  <div className="space-y-1 pr-1  rounded p-2 bg-gray-750">
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
                            className="w-5 h-5 rounded "
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
                            className="w-5 h-5 rounded "
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
                        <div className="relative  rounded shadow-lg p-2 w-60">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[11px] font-mono px-1 py-0.5 rounded bg-gray-700 ">
                              {selectedColorId}
                            </span>
                            <button
                              className="text-[11px] px-2 py-0.5 rounded bg-gray-700  hover:bg-gray-600"
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

            <AccordionItem value="display">
              <AccordionTrigger className="px-4  hover:no-underline">
                Display Options
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center text-sm font-medium mb-2 ">
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
                        <label className="block text-sm font-medium mb-2 ">
                          Title Text
                        </label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full p-2 border-2 border-border bg-input text-foreground focus:border-primary focus:outline-none shadow-md font-sans"
                          placeholder="Enter title text"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium mb-2 ">
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

            <AccordionItem value="export">
              <AccordionTrigger className="px-4  hover:no-underline">
                Export
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <Button
                  onClick={handleExportCalendar}
                  data-export-btn
                  className="w-full"
                  size="md"
                >
                  Export {exportFormat.toUpperCase()}
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <Card className="overflow-x-auto h-full p-2 shadow-none hover:shadow-none">
          <Card.Content>
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
                minWidth: `${(layout === "horizontal" ? 800 : layout === "vertical" ? 320 : 600) + wrapperPaddingX * 2}px`,
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
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
