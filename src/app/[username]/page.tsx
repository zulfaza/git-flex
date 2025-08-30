import ContributionCalendarWrapper from "@/components/ContributionCalendarWrapper";
import { fetchGitHubContributions } from "@/lib/githubApi";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ token?: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `${username} - GitFlex`,
    description: `GitHub contribution calendar for ${username}`,
  };
}

export default async function UserPage({ params }: PageProps) {
  const { username } = await params;

  let contributions: number[][] = [];
  let error: string | null = null;

  try {
    contributions = await fetchGitHubContributions(username);
  } catch (err) {
    error =
      err instanceof Error ? err.message : "Failed to fetch contributions";
    // Fallback to empty grid
    contributions = Array.from({ length: 7 }, () => Array(53).fill(0));
  }

  if (error) {
    return (
      <div className="bg-gray-900 min-h-screen">
        <div className="max-w-[1440px] mx-auto p-4">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-white mb-4">
              Error Loading Contributions
            </h1>
            <p className="text-gray-400 mb-6">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900">
      <div className="max-w-[1440px] mx-auto p-4">
        <div className="mb-6 px-4">
          <h1 className="text-2xl font-bold text-white mb-2">
            {username}&apos;s GitHub Contributions
          </h1>
          <p className="text-gray-400">
            Contribution calendar for the past year
          </p>
        </div>
        <ContributionCalendarWrapper
          contributions={contributions}
          squareSize={12}
          orientation="horizontal"
        />
      </div>
    </div>
  );
}
