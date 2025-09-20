"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ContributionCalendarWrapper from "@/components/ContributionCalendarWrapper";
import { useGitHubContributions } from "@/hooks/useGitHubContributions";
import { getDateRangeFromToday } from "@/constants/months";
import type { UserPageClientProps, DateRangeOption } from "@/types/calendar";

export default function UserPageClient({ username }: UserPageClientProps) {
  const searchParams = useSearchParams();
  const [dateRangeOption, setDateRangeOption] = useState<DateRangeOption>('year-ago');

  const urlFrom = searchParams.get("from");
  const urlTo = searchParams.get("to");

  const getDateRange = () => {
    if (urlFrom || urlTo) {
      return {
        from: urlFrom || undefined,
        to: urlTo || undefined
      };
    }

    if (dateRangeOption === 'year-ago') {
      return getDateRangeFromToday(365);
    }

    // For specific years
    const year = parseInt(dateRangeOption);
    return {
      from: `${year}-01-01T00:00:00.000Z`,
      to: `${year}-12-31T23:59:59.999Z`
    };
  };

  const { from, to } = getDateRange();

  useEffect(() => {
    if (urlFrom && !urlTo) {
      const yearFromUrl = new Date(urlFrom).getFullYear();
      const yearOption = yearFromUrl.toString() as DateRangeOption;
      if (['2021', '2022', '2023', '2024', '2025'].includes(yearOption)) {
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
              `Contribution calendar from ${new Date(from).toLocaleDateString()} to ${new Date(to).toLocaleDateString()}`
            ) : from ? (
              `Contributions from ${new Date(from).toLocaleDateString()}`
            ) : to ? (
              `Contributions up to ${new Date(to).toLocaleDateString()}`
            ) : dateRangeOption === 'year-ago' ? (
              "Contribution calendar for the past 365 days"
            ) : (
              `Contribution calendar for ${dateRangeOption}`
            )}
          </p>
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
