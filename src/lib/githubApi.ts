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

const token = process.env.GITHUB_TOKEN;

export async function fetchGitHubContributions(
  username: string,
): Promise<number[][]> {
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
    return Array.from({ length: 7 }, () => Array(53).fill(0));
  }

  // If token is provided, fetch actual contribution data
  const query = `
    query($username: String!) {
      user(login: $username) {
        login
        name
        contributionsCollection {
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

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers,
    body: JSON.stringify({
      query,
      variables: { username },
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

  return transformContributionData(calendar);
}

function transformContributionData(calendar: ContributionCalendar): number[][] {
  const weeks = calendar.weeks;
  const contributionGrid: number[][] = [];
  for (let i = 0; i < 7; i++) {
    contributionGrid[i] = [];
  }
  weeks.forEach((week) => {
    week.contributionDays.forEach((day, dayIndex) => {
      let level = 0;
      if (day.contributionCount > 0) {
        if (day.contributionCount <= 3) level = 1;
        else if (day.contributionCount <= 6) level = 2;
        else if (day.contributionCount <= 9) level = 3;
        else level = 4;
      }

      contributionGrid[dayIndex].push(level);
    });
  });

  return contributionGrid;
}
