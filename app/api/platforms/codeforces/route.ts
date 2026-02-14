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
      rank: "Unrated",
    });
  }

  try {
    // Fetch user info from CodeForces API
    const response = await fetch(
      `https://codeforces.com/api/user.info?handles=${username}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch from CodeForces");
    }

    const data = await response.json();

    if (data.status !== "OK" || !data.result || data.result.length === 0) {
      return NextResponse.json({
        error: "User not found",
        username,
        problemsSolved: 0,
        rating: 0,
        rank: "Not found",
      });
    }

    const user = data.result[0];

    // Fetch problem statistics
    let problemsSolved = 0;
    try {
      const statusResponse = await fetch(
        `https://codeforces.com/api/user.status?handle=${username}&from=1&count=10000`
      );
      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        if (statusData.status === "OK") {
          const solvedProblems = new Set();
          statusData.result.forEach((submission: any) => {
            if (submission.verdict === "OK") {
              solvedProblems.add(
                `${submission.problem.contestId}-${submission.problem.index}`
              );
            }
          });
          problemsSolved = solvedProblems.size;
        }
      }
    } catch (err) {
      console.error("Failed to fetch CodeForces submissions:", err);
    }

    return NextResponse.json({
      username,
      problemsSolved,
      rating: user.rating || 0,
      maxRating: user.maxRating || 0,
      rank: user.rank || "Unrated",
      maxRank: user.maxRank || "Unrated",
      avatar: user.titlePhoto || null,
    });
  } catch (error) {
    console.error("CodeForces API error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch CodeForces data",
        username,
        problemsSolved: 0,
        rating: 0,
        rank: "Error",
      },
      { status: 500 }
    );
  }
}
