import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username || username === "username_here") {
    return NextResponse.json({
      error: "No username configured",
      username: null,
      problemsSolved: 0,
      rating: 0,
      rank: 0,
    });
  }

  try {
    // HackerRank API endpoint
    const response = await fetch(
      `https://www.hackerrank.com/rest/hackers/${username}/profile`
    );

    if (!response.ok) {
      // User not found or API error
      return NextResponse.json({
        error: "User not found",
        username,
        problemsSolved: 0,
        rating: 0,
        rank: 0,
      });
    }

    const data = await response.json();

    if (!data || !data.model) {
      return NextResponse.json({
        error: "Invalid response",
        username,
        problemsSolved: 0,
        rating: 0,
        rank: 0,
      });
    }

    const profile = data.model;
    const stats = data.model.hacker_badges || {};

    // Extract badge counts for solved problems
    const problemsSolved =
      profile.solve_count || profile.solved || profile.problems_solved || 0;

    return NextResponse.json({
      username: profile.username || username,
      problemsSolved,
      rating: profile.rating || 0,
      rank: profile.rank || 0,
      country: profile.country || null,
      avatar: profile.avatar || null,
      badges: stats,
    });
  } catch (error) {
    console.error("HackerRank API error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch HackerRank data",
        username,
        problemsSolved: 0,
        rating: 0,
        rank: 0,
      },
      { status: 500 }
    );
  }
}
