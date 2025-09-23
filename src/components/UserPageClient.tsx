"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ContributionCalendarWrapper from "@/components/ContributionCalendarWrapper";
import { useGitHubContributions } from "@/hooks/useGitHubContributions";
import { getDateRangeFromToday } from "@/constants/months";
import type { UserPageClientProps, DateRangeOption } from "@/types/calendar";
import Link from "next/link";

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

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-[1440px] mx-auto p-6">
        <div className="mb-8 px-4">
          <h1 className="text-3xl font-head font-bold text-foreground mb-3 border-b-4 border-primary pb-2 inline-block">
            {username}&apos;s GitHub Contributions
          </h1>
          <div className="flex justify-start items-center mt-4 gap-2">
            <Link
              className="border-2 py-1 px-2 shadow-md hover:shadow-none transition-all hover:translate-y-0.5"
              href={"/"}
            >
              Back
            </Link>
            <p className="text-muted-foreground font-sans">
              {isLoading ? (
                <span className="animate-pulse bg-muted px-3 py-1 border-2 border-border shadow-sm">
                  Loading contributions...
                </span>
              ) : error || !data?.success ? (
                <span className="text-destructive-foreground bg-destructive px-3 py-2 border-2 border-black shadow-md">
                  {data?.error ||
                    error?.message ||
                    "Failed to fetch contributions"}
                </span>
              ) : from && to ? (
                `Contribution calendar from ${new Date(from).toLocaleDateString()} to ${new Date(to).toLocaleDateString()}`
              ) : from ? (
                `Contributions from ${new Date(from).toLocaleDateString()}`
              ) : to ? (
                `Contributions up to ${new Date(to).toLocaleDateString()}`
              ) : dateRangeOption === "year-ago" ? (
                "Contribution calendar for the past 365 days"
              ) : (
                `Contribution calendar for ${dateRangeOption}`
              )}
            </p>
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
