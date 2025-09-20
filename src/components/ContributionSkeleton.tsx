import { useMemo } from "react";

import ContributionCalendar from "@/components/ContributionCalendar";
import type { ContributionGridCell } from "@/lib/githubApi";

type Orientation = "horizontal" | "vertical";

interface ContributionSkeletonProps {
  orientation: Orientation;
  padding: number;
  borderRadius: number;
  gridData: (ContributionGridCell | null)[][];
  gridCols: number;
  showTitle: boolean;
  showLegend: boolean;
  title: string;
}

const skeletonTheme = {
  background: "#111827",
  wrapperBackground: "#0f172a",
  text: "#9ca3af",
  border: "#1f2937",
  legendColors: ["#111827", "#1f2937", "#27303d", "#374151", "#4b5563"],
};

const buildSkeletonGrid = (
  gridData: (ContributionGridCell | null)[][],
): (ContributionGridCell | null)[][] => {
  return gridData.map((row) => {
    if (!row) {
      return [];
    }

    return row.map((cell) => {
      if (!cell) {
        return null;
      }

      return {
        date: "",
        contributionCount: 0,
        level: 2,
      };
    });
  });
};

export default function ContributionSkeleton({
  orientation,
  padding,
  borderRadius,
  gridData,
  gridCols,
  showLegend,
  showTitle,
  title,
}: ContributionSkeletonProps) {
  const placeholderGrid = useMemo(
    () => buildSkeletonGrid(gridData),
    [gridData],
  );

  return (
    <ContributionCalendar
      orientation={orientation}
      customColors={skeletonTheme}
      padding={padding}
      borderRadius={borderRadius}
      gridData={placeholderGrid}
      gridCols={gridCols}
      title={title}
      showTitle={showTitle}
      showLegend={showLegend}
    />
  );
}
