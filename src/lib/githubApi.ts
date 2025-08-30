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

interface GitHubResponse {
  data: {
    user: GitHubUser;
  };
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
  // First, try to get basic user info without authentication
  const userResponse = await fetch(`https://api.github.com/users/${username}`);

  if (!userResponse.ok) {
    if (userResponse.status === 404) {
      throw new Error(`User ${username} not found`);
    }
    throw new Error(`Failed to fetch user data: ${userResponse.status}`);
  }

  // If no token provided, return empty grid with a message
  if (!token) {
    console.log(`No token provided for ${username}. Showing empty calendar.`);
    return Array.from({ length: 7 }, () =>
      Array(53)
        .fill(null)
        .map(() => ({ date: "", contributionCount: 0, level: 0 })),
    );
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

  const variables: Record<string, string> = { username };
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
    throw new Error(
      `GitHub API error: ${response.status} ${response.statusText}`,
    );
  }

  const data: GitHubResponse = await response.json();

  if (data.data.user === null) {
    throw new Error(`User ${username} not found`);
  }

  const calendar = data.data.user.contributionsCollection.contributionCalendar;
  // await writeLog(`${username}.json`, calendar);
  return transformContributionData(calendar);
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
