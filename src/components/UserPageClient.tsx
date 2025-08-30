"use client";

import { useState, useEffect } from "react";
import ContributionCalendarWrapper from "@/components/ContributionCalendarWrapper";
import { useGitHubContributions } from "@/hooks/useGitHubContributions";
import { useSearchParams } from "next/navigation";

interface UserPageClientProps {
  username: string;
}

const years = [2021, 2022, 2023, 2024, 2025];

function UserPageClient({ username }: UserPageClientProps) {
  const searchParams = useSearchParams();
  const [selectedYear, setSelectedYear] = useState(2025);

  // Use year-based dates if no URL params, otherwise use URL params
  const urlFrom = searchParams.get("from");
  const urlTo = searchParams.get("to");

  const from = urlFrom || `${selectedYear}-01-01T00:00:00.000Z`;
  const to = urlTo || `${selectedYear}-12-31T23:59:59.999Z`;

  // Set initial year from URL params if available
  useEffect(() => {
    if (urlFrom && !urlTo) {
      const yearFromUrl = new Date(urlFrom).getFullYear();
      if (years.includes(yearFromUrl)) {
        setSelectedYear(yearFromUrl);
      }
    }
  }, [urlFrom, urlTo]);

  const { data, isLoading, error } = useGitHubContributions(username, from, to);

  // Default empty contribution grid for skeleton/error states
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

export default UserPageClient;
