import { fetchGitHubContributions } from "@/lib/githubApi";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get("username");
    const fromParam = searchParams.get("from") || undefined;
    const toParam = searchParams.get("to") || undefined;

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 },
      );
    }

    // Convert date strings to proper ISO DateTime format
    const from = fromParam ? new Date(fromParam).toISOString() : undefined;
    const to = toParam ? new Date(toParam).toISOString() : undefined;

    const contributions = await fetchGitHubContributions(username, from, to);

    return NextResponse.json({
      success: true,
      data: contributions,
      username,
      from,
      to,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch contributions";
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        data: Array.from({ length: 7 }, () =>
          Array(53)
            .fill(null)
            .map(() => ({ date: "", contributionCount: 0, level: 0 })),
        ),
      },
      { status: 500 },
    );
  }
}
