import type { ContributionGridCell } from "@/lib/githubApi";

export interface CustomThemeColors {
  background: string;
  wrapperBackground: string;
  text: string;
  border: string;
  legendColors: string[];
}

export type Orientation = "horizontal" | "vertical";

export interface ContributionCalendarWrapperProps {
  contributions: (ContributionGridCell | null)[][];
  isLoading?: boolean;
  squareSize?: number;
  selectedYear?: number;
  onYearChange?: (year: number) => void;
  showYearSelector?: boolean;
}

export interface UserPageClientProps {
  username: string;
}
