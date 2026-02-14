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
    // CodeChef API endpoint - fetches user profile
    const response = await fetch(
      `https://codechef.com/api/users/${username}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json({
        error: "User not found",
        username,
        problemsSolved: 0,
        rating: 0,
        rank: 0,
      });
    }

    const data = await response.json();

    if (!data || !data.user) {
      return NextResponse.json({
        error: "Invalid response",
        username,
        problemsSolved: 0,
        rating: 0,
        rank: 0,
      });
    }

    const user = data.user;

    // Extract stats from CodeChef profile
    const problemsSolved = user.fully_solved || 0;
    const rating = user.rating || 0;
    const rank = user.global_rank || 0;

    return NextResponse.json({
      username: user.username || username,
      problemsSolved,
      rating,
      rank,
      countryCode: user.country || null,
      state: user.state || null,
      city: user.city || null,
      highestRating: user.highest_rating || rating,
    });
  } catch (error) {
    console.error("CodeChef API error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch CodeChef data",
        username,
        problemsSolved: 0,
        rating: 0,
        rank: 0,
      },
      { status: 500 }
    );
  }
}
