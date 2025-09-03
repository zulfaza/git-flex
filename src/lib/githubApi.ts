// import { writeLog } from "./log";

interface ContributionDay {
  date: string;
  contributionCount: number;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

interface GitHubUser {
  login: string;
  name: string;
  contributionsCollection: {
    contributionCalendar: ContributionCalendar;
  };
}

interface GitHubError {
  message: string;
  type?: string;
  path?: string[];
  locations?: Array<{
    line: number;
    column: number;
  }>;
}

interface GitHubResponse {
  data: {
    user: GitHubUser;
  };
  errors?: GitHubError[];
}

export interface ContributionGridCell {
  date: string;
  contributionCount: number;
  level: number;
}

const token = process.env.GITHUB_TOKEN;

export async function fetchGitHubContributions(
  username: string,
  fromDate?: string,
  toDate?: string,
): Promise<(ContributionGridCell | null)[][]> {
  try {
    // If no token provided, return empty grid with a message
    if (!token) {
      console.log(`No token provided for ${username}. Showing empty calendar.`);
      return Array.from({ length: 7 }, () =>
        Array(53)
          .fill(null)
          .map(() => ({ date: "", contributionCount: 0, level: 0 })),
      );
    }

    // Validate username
    if (!username || username.trim() === "") {
      throw new Error("Username is required and cannot be empty");
    }

    // If token is provided, fetch actual contribution data
    const query = `
      query($username: String!, $from: DateTime, $to: DateTime) {
        user(login: $username) {
          login
          name
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
        }
      }
    `;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const variables: Record<string, string> = { username: username.trim() };
    if (fromDate) {
      variables.from = fromDate;
    }
    if (toDate) {
      variables.to = toDate;
    }

    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers,
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("GitHub API authentication failed. Please check your token.");
      } else if (response.status === 403) {
        throw new Error("GitHub API rate limit exceeded. Please try again later.");
      } else if (response.status >= 500) {
        throw new Error("GitHub API is currently unavailable. Please try again later.");
      } else {
        throw new Error(
          `GitHub API error: ${response.status} ${response.statusText}`,
        );
      }
    }

    const data: GitHubResponse = await response.json();

    // Handle GraphQL errors
    if (data.errors) {
      const errorMessage = data.errors.map((e: GitHubError) => e.message).join(", ");
      throw new Error(`GitHub GraphQL error: ${errorMessage}`);
    }

    if (!data.data) {
      throw new Error("No data received from GitHub API");
    }

    if (data.data.user === null) {
      throw new Error(`User '${username}' not found on GitHub`);
    }

    if (!data.data.user.contributionsCollection) {
      throw new Error("Unable to fetch contribution data for this user");
    }

    const calendar = data.data.user.contributionsCollection.contributionCalendar;
    if (!calendar || !calendar.weeks) {
      throw new Error("Invalid contribution data received from GitHub");
    }

    // await writeLog(`${username}.json`, calendar);
    return transformContributionData(calendar);
  } catch (error) {
    console.error("Error fetching GitHub contributions:", error);
    
    // Re-throw the error to be handled by the calling function
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("An unexpected error occurred while fetching GitHub contributions");
    }
  }
}

function transformContributionData(
  calendar: ContributionCalendar,
): (ContributionGridCell | null)[][] {
  const weeks = calendar.weeks;

  // Initialize grid: 7 rows (days of week) by number of weeks columns
  const contributionGrid: (ContributionGridCell | null)[][] = [];
  for (let i = 0; i < 7; i++) {
    contributionGrid[i] = [];
  }

  // Fill grid column by column (week by week)
  weeks.forEach((week, weekIndex) => {
    // Initialize this week's column with null values
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      contributionGrid[dayIndex][weekIndex] = null;
    }

    // Fill in the actual contribution days
    week.contributionDays.forEach((day) => {
      let level = 0;
      const date = new Date(day.date);
      const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday, etc.

      if (day.contributionCount > 0) {
        if (day.contributionCount <= 3) level = 1;
        else if (day.contributionCount <= 6) level = 2;
        else if (day.contributionCount <= 9) level = 3;
        else level = 4;
      }

      contributionGrid[dayIndex][weekIndex] = {
        date: day.date,
        contributionCount: day.contributionCount,
        level: level,
      };
    });
  });

  return contributionGrid;
}
