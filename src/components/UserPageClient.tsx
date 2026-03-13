"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ContributionCalendarWrapper from "@/components/ContributionCalendarWrapper";
import { useGitHubContributions } from "@/hooks/useGitHubContributions";
import { getDateRangeFromToday } from "@/constants/months";
import type { UserPageClientProps, DateRangeOption } from "@/types/calendar";

export default function UserPageClient({ username }: UserPageClientProps) {
  const searchParams = useSearchParams();
  const [dateRangeOption, setDateRangeOption] =
    useState<DateRangeOption>("year-ago");

  const urlFrom = searchParams.get("from");
  const urlTo = searchParams.get("to");

  const getDateRange = () => {
    if (urlFrom || urlTo) {
      return {
        from: urlFrom || undefined,
        to: urlTo || undefined,
      };
    }

    if (dateRangeOption === "year-ago") {
      return getDateRangeFromToday(365);
    }

    // For specific years
    const year = parseInt(dateRangeOption);
    return {
      from: `${year}-01-01T00:00:00.000Z`,
      to: `${year}-12-31T23:59:59.999Z`,
    };
  };

  const { from, to } = getDateRange();

  useEffect(() => {
    if (urlFrom && !urlTo) {
      const yearFromUrl = new Date(urlFrom).getFullYear();
      const yearOption = yearFromUrl.toString() as DateRangeOption;
      if (["2021", "2022", "2023", "2024", "2025"].includes(yearOption)) {
        setDateRangeOption(yearOption);
      }
    }
  }, [urlFrom, urlTo]);

  const { data, isLoading, error } = useGitHubContributions(username, from, to);

  const defaultContributions = Array.from({ length: 7 }, () =>
    Array(53)
      .fill(null)
      .map(() => ({ date: "", contributionCount: 0, level: 0 })),
  );

  const contributions = data?.success ? data.data : defaultContributions;
  const statusContent = (() => {
    if (isLoading) {
      return (
        <span className="inline-flex max-w-full animate-pulse border-2 border-border bg-muted px-3 py-1 shadow-sm">
          Loading contributions...
        </span>
      );
    }

    if (error || !data?.success) {
      return (
        <span className="inline-flex max-w-full border-2 border-black bg-destructive px-3 py-2 text-destructive-foreground shadow-md">
          {data?.error || error?.message || "Failed to fetch contributions"}
        </span>
      );
    }

    if (from && to) {
      return `Contribution calendar from ${new Date(from).toLocaleDateString()} to ${new Date(to).toLocaleDateString()}`;
    }

    if (from) {
      return `Contributions from ${new Date(from).toLocaleDateString()}`;
    }

    if (to) {
      return `Contributions up to ${new Date(to).toLocaleDateString()}`;
    }

    if (dateRangeOption === "year-ago") {
      return "Contribution calendar for the past 365 days";
    }

    return `Contribution calendar for ${dateRangeOption}`;
  })();

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto flex max-w-[1800px] flex-col gap-6 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <div className="grid gap-4 border-2 border-border bg-card px-4 py-4 shadow-md sm:px-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-6">
          <div className="min-w-0">
            <h1 className="inline-block border-b-4 border-primary pb-2 text-3xl font-head font-bold text-foreground sm:text-4xl">
              {username}&apos;s GitHub Contributions
            </h1>
            <p className="mt-3 max-w-4xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {statusContent}
            </p>
          </div>
          <div className="flex lg:justify-end">
            <Link
              className="inline-flex items-center border-2 border-border bg-background px-3 py-2 font-head text-sm shadow-md transition-colors hover:bg-muted focus:outline-hidden focus:ring-2 focus:ring-ring"
              href={"/"}
            >
              Back
            </Link>
          </div>
        </div>
        <ContributionCalendarWrapper
          contributions={contributions}
          isLoading={isLoading}
          squareSize={12}
          dateRangeOption={dateRangeOption}
          onDateRangeChange={setDateRangeOption}
          showDateRangeSelector={!urlFrom && !urlTo}
        />
      </div>
    </div>
  );
}
