"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OnlinePlatformsSectionProps {
  studentId: string;
  profile?: {
    leetcode?: string;
    codeforces?: string;
    hackerrank?: string;
    codechef?: string;
  };
}

interface PlatformData {
  name: string;
  username: string;
  problemsSolved: number;
  rating: number | string;
  rank?: number | string;
  status: "loading" | "active" | "error" | "not-configured";
  error?: string;
}

export default function OnlinePlatformsSection({
  studentId,
  profile,
}: OnlinePlatformsSectionProps) {
  const [platforms, setPlatforms] = useState<PlatformData[]>([
    {
      name: "LeetCode",
      username: profile?.leetcode || "",
      problemsSolved: 0,
      rating: 0,
      status: "loading",
    },
    {
      name: "CodeForces",
      username: profile?.codeforces || "",
      problemsSolved: 0,
      rating: 0,
      status: "loading",
    },
    {
      name: "HackerRank",
      username: profile?.hackerrank || "",
      problemsSolved: 0,
      rating: 0,
      status: "not-configured",
    },
    {
      name: "CodeChef",
      username: profile?.codechef || "",
      problemsSolved: 0,
      rating: 0,
      status: "not-configured",
    },
  ]);

  useEffect(() => {
    const fetchPlatformData = async () => {
      // Fetch LeetCode data
      if (profile?.leetcode && profile.leetcode !== "username_here") {
        try {
          const res = await fetch(
            `/api/platforms/leetcode?username=${profile.leetcode}`,
            { credentials: "include" }
          );
          const data = await res.json();
          setPlatforms((prev) =>
            prev.map((p) =>
              p.name === "LeetCode"
                ? {
                    ...p,
                    problemsSolved: data.problemsSolved || 0,
                    rating: data.rating || 0,
                    rank: data.rank || 0,
                    status: data.error ? "error" : "active",
                    error: data.error,
                  }
                : p
            )
          );
        } catch (err) {
          setPlatforms((prev) =>
            prev.map((p) =>
              p.name === "LeetCode"
                ? { ...p, status: "error", error: "Failed to fetch" }
                : p
            )
          );
        }
      } else {
        setPlatforms((prev) =>
          prev.map((p) =>
            p.name === "LeetCode" ? { ...p, status: "not-configured" } : p
          )
        );
      }

      // Fetch CodeForces data
      if (profile?.codeforces && profile.codeforces !== "username_here") {
        try {
          const res = await fetch(
            `/api/platforms/codeforces?username=${profile.codeforces}`,
            { credentials: "include" }
          );
          const data = await res.json();
          setPlatforms((prev) =>
            prev.map((p) =>
              p.name === "CodeForces"
                ? {
                    ...p,
                    problemsSolved: data.problemsSolved || 0,
                    rating: data.rating || 0,
                    rank: data.rank || "Unrated",
                    status: data.error ? "error" : "active",
                    error: data.error,
                  }
                : p
            )
          );
        } catch (err) {
          setPlatforms((prev) =>
            prev.map((p) =>
              p.name === "CodeForces"
                ? { ...p, status: "error", error: "Failed to fetch" }
                : p
            )
          );
        }
      } else {
        setPlatforms((prev) =>
          prev.map((p) =>
            p.name === "CodeForces" ? { ...p, status: "not-configured" } : p
          )
        );
      }

      // Fetch HackerRank data
      if (profile?.hackerrank && profile.hackerrank !== "username_here") {
        try {
          const res = await fetch(
            `/api/platforms/hackerrank?username=${profile.hackerrank}`,
            { credentials: "include" }
          );
          const data = await res.json();
          setPlatforms((prev) =>
            prev.map((p) =>
              p.name === "HackerRank"
                ? {
                    ...p,
                    problemsSolved: data.problemsSolved || 0,
                    rating: data.rating || 0,
                    rank: data.rank || 0,
                    status: data.error ? "error" : "active",
                    error: data.error,
                  }
                : p
            )
          );
        } catch (err) {
          setPlatforms((prev) =>
            prev.map((p) =>
              p.name === "HackerRank"
                ? { ...p, status: "error", error: "Failed to fetch" }
                : p
            )
          );
        }
      } else {
        setPlatforms((prev) =>
          prev.map((p) =>
            p.name === "HackerRank" ? { ...p, status: "not-configured" } : p
          )
        );
      }

      // Fetch CodeChef data
      if (profile?.codechef && profile.codechef !== "username_here") {
        try {
          const res = await fetch(
            `/api/platforms/codechef?username=${profile.codechef}`,
            { credentials: "include" }
          );
          const data = await res.json();
          setPlatforms((prev) =>
            prev.map((p) =>
              p.name === "CodeChef"
                ? {
                    ...p,
                    problemsSolved: data.problemsSolved || 0,
                    rating: data.rating || 0,
                    rank: data.rank || 0,
                    status: data.error ? "error" : "active",
                    error: data.error,
                  }
                : p
            )
          );
        } catch (err) {
          setPlatforms((prev) =>
            prev.map((p) =>
              p.name === "CodeChef"
                ? { ...p, status: "error", error: "Failed to fetch" }
                : p
            )
          );
        }
      } else {
        setPlatforms((prev) =>
          prev.map((p) =>
            p.name === "CodeChef" ? { ...p, status: "not-configured" } : p
          )
        );
      }
    };

    if (profile) {
      fetchPlatformData();
    }
  }, [profile]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
        );
      case "loading":
        return <Badge className="bg-gray-400">Loading...</Badge>;
      case "error":
        return <Badge className="bg-red-500 hover:bg-red-600">Error</Badge>;
      case "not-configured":
        return (
          <Badge className="bg-orange-400 hover:bg-orange-500">
            Not Configured
          </Badge>
        );
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-slate-900 gradient-text">
        Online Coding Platforms
      </h2>

      {!profile ? (
        <Card className="glass-sm border border-slate-200/80">
          <CardContent className="py-6 text-sm text-slate-500">
            Loading platform data...
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {platforms.map((platform, idx) => (
            <Card key={idx} className="glass-sm border border-slate-200/80">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-slate-900 text-lg">
                    {platform.name}
                  </CardTitle>
                  {getStatusBadge(platform.status)}
                </div>
                {platform.username && platform.username !== "username_here" ? (
                  <p className="text-sm text-slate-500">@{platform.username}</p>
                ) : (
                  <p className="text-sm text-slate-400">No username set</p>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                {platform.status === "active" ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                        <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                          Problems Solved
                        </p>
                        <p className="text-2xl font-bold text-slate-900">
                          {platform.problemsSolved}
                        </p>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                        <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                          Rating
                        </p>
                        <p className="text-2xl font-bold text-slate-900">
                          {typeof platform.rating === "number"
                            ? platform.rating
                            : platform.rating}
                        </p>
                      </div>
                    </div>
                    {platform.rank && (
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                        <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                          Rank
                        </p>
                        <p className="text-lg font-semibold text-slate-900">
                          {platform.rank}
                        </p>
                      </div>
                    )}
                  </>
                ) : platform.status === "loading" ? (
                  <p className="text-sm text-slate-500">
                    Fetching data from {platform.name}...
                  </p>
                ) : platform.status === "error" ? (
                  <p className="text-sm text-red-500">
                    {platform.error || "Failed to load data"}
                  </p>
                ) : (
                  <p className="text-sm text-slate-500">
                    Username not configured for this platform
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="glass-sm border border-slate-200/80">
        <CardHeader>
          <CardTitle className="text-slate-900">Platform Integration</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600 space-y-2">
          <p>
            <strong>Real-time data fetching:</strong> Platform statistics are
            fetched live from LeetCode, CodeForces, HackerRank, and CodeChef APIs.
          </p>
          <p className="text-slate-500">
            <strong>Note:</strong> Data is updated whenever you view this section.
            If a platform shows an error, the username might be incorrect or the
            platform API might be temporarily unavailable.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
