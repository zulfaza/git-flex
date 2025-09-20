import type { ContributionGridCell } from "@/lib/githubApi";

export interface CustomThemeColors {
  background: string;
  wrapperBackground: string;
  text: string;
  border: string;
  legendColors: string[];
}

export type Layout = "horizontal" | "vertical" | "3x4" | "4x3";

export type DateRangeOption = 'year-ago' | '2021' | '2022' | '2023' | '2024' | '2025';

export interface ContributionCalendarWrapperProps {
  contributions: (ContributionGridCell | null)[][];
  isLoading?: boolean;
  squareSize?: number;
  dateRangeOption?: DateRangeOption;
  onDateRangeChange?: (option: DateRangeOption) => void;
  showDateRangeSelector?: boolean;
}

export interface UserPageClientProps {
  username: string;
}
