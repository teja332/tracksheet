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
    // Using LeetCode's GraphQL API (unofficial but public)
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            ranking
            reputation
          }
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
      }
    `;

    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch from LeetCode");
    }

    const data = await response.json();

    if (!data.data || !data.data.matchedUser) {
      return NextResponse.json({
        error: "User not found",
        username,
        problemsSolved: 0,
        rating: 0,
        rank: 0,
      });
    }

    const user = data.data.matchedUser;
    const totalSolved = user.submitStats.acSubmissionNum.find(
      (item: any) => item.difficulty === "All"
    )?.count || 0;

    const easy = user.submitStats.acSubmissionNum.find(
      (item: any) => item.difficulty === "Easy"
    )?.count || 0;

    const medium = user.submitStats.acSubmissionNum.find(
      (item: any) => item.difficulty === "Medium"
    )?.count || 0;

    const hard = user.submitStats.acSubmissionNum.find(
      (item: any) => item.difficulty === "Hard"
    )?.count || 0;

    return NextResponse.json({
      username: user.username,
      problemsSolved: totalSolved,
      easy,
      medium,
      hard,
      rating: user.profile.reputation || 0,
      rank: user.profile.ranking || 0,
    });
  } catch (error) {
    console.error("LeetCode API error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch LeetCode data",
        username,
        problemsSolved: 0,
        rating: 0,
        rank: 0,
      },
      { status: 500 }
    );
  }
}
