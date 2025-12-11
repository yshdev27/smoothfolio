"use client";

import { githubConfig } from "@/config/Github";
import Image from "next/image";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";

import Container from "../common/Container";
import GithubIcon from "../svgs/Github";
import { Button } from "../ui/button";

const ActivityCalendar = dynamic(() =>
  import("react-activity-calendar").then((mod) => mod.ActivityCalendar),
);

type ContributionItem = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

type GitHubContributionResponse = {
  date: string;
  contributionCount: number;
  contributionLevel:
    | "NONE"
    | "FIRST_QUARTILE"
    | "SECOND_QUARTILE"
    | "THIRD_QUARTILE"
    | "FOURTH_QUARTILE";
};

// Helper function to filter contributions to past 10 months
function filterLastTenMonths(
  contributions: ContributionItem[],
): ContributionItem[] {
  const nineMonthsAgo = new Date();
  nineMonthsAgo.setMonth(nineMonthsAgo.getMonth() - 9);

  return contributions.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= nineMonthsAgo;
  });
}

export default function Github() {
  const [contributions, setContributions] = useState<ContributionItem[]>([]);
  const [totalContributions, setTotalContributions] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [yesterdayWork, setYesterdayWork] = useState("—");
  const [isOnline, setIsOnline] = useState(false);
  const { theme } = useTheme();

  const formatDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m`;
    return "0 mins";
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${githubConfig.apiUrl}/${githubConfig.username}.json`,
        );
        const data: { contributions?: unknown[] } = await response.json();

        if (data?.contributions && Array.isArray(data.contributions)) {
          // Flatten the nested array structure
          const flattenedContributions = data.contributions.flat();

          // Convert contribution levels to numbers
          const contributionLevelMap = {
            NONE: 0,
            FIRST_QUARTILE: 1,
            SECOND_QUARTILE: 2,
            THIRD_QUARTILE: 3,
            FOURTH_QUARTILE: 4,
          };

          // Transform to the expected format
          const validContributions = flattenedContributions
            .filter(
              (item: unknown): item is GitHubContributionResponse =>
                typeof item === "object" &&
                item !== null &&
                "date" in item &&
                "contributionCount" in item &&
                "contributionLevel" in item,
            )
            .map((item: GitHubContributionResponse) => ({
              date: String(item.date),
              count: Number(item.contributionCount || 0),
              level: (contributionLevelMap[
                item.contributionLevel as keyof typeof contributionLevelMap
              ] || 0) as ContributionItem["level"],
            }));

          if (validContributions.length > 0) {
            // Calculate total contributions
            const total = validContributions.reduce(
              (sum, item) => sum + item.count,
              0,
            );
            setTotalContributions(total);

            // Filter to show only the past 10 months
            const filteredContributions =
              filterLastTenMonths(validContributions);
            setContributions(filteredContributions);
          } else {
            setHasError(true);
          }
        } else {
          setHasError(true);
        }
      } catch (err) {
        console.error("Failed to fetch GitHub contributions:", err);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchYesterdayWork() {
      try {
        const response = await fetch("/api/wakatime/stats");
        if (!response.ok) return;
        const data = await response.json();
        const seconds = Number(data.yesterdaySeconds ?? 0);
        setYesterdayWork(formatDuration(seconds));
        setIsOnline(Boolean(data.isOnline));
      } catch (error) {
        console.error("Failed to fetch yesterday work:", error);
      }
    }

    fetchYesterdayWork();
  }, []);

  return (
    <Container className="mt-20">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-2xl font-bold text-foreground">
              {githubConfig.title}
            </h2>
            {!isLoading && !hasError && totalContributions > 0 && (
              <div className="mt-1 flex w-full items-center gap-1 flex-wrap text-sm text-primary font-medium">
                <span className="flex-shrink-0">
                  Total:{" "}
                  <span className="font-black">
                    {totalContributions.toLocaleString()}
                  </span>{" "}
                  contributions
                </span>
                {/* Desktop / tablet right-aligned */}
                <span className="hidden sm:inline md:flex items-center gap-1 ml-auto text-foreground whitespace-nowrap">
                  <Image
                    src="/assets/cursor.png"
                    alt="Cursor"
                    width={16}
                    height={16}
                    className="h-4 w-4 shrink-0"
                  />
                  <span className="text-muted-foreground">Yesterday worked</span>
                  <b>{yesterdayWork}</b>
                </span>
                {/* Mobile fallback (stacks if space is tight) */}
                <div className="sm:hidden flex items-center gap-1 ml-auto text-foreground">
                  <Image
                    src="/assets/cursor.png"
                    alt="Cursor"
                    width={16}
                    height={16}
                    className="h-4 w-4 shrink-0"
                  />
                  <span className="text-muted-foreground">Yesterday worked</span>
                  <b>{yesterdayWork}</b>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm text-muted-foreground">
                {githubConfig.loadingState.description}
              </p>
            </div>
          </div>
        ) : hasError || contributions.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground border-2 border-dashed border-border rounded-xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <GithubIcon className="w-8 h-8" />
            </div>
            <p className="font-medium mb-2">{githubConfig.errorState.title}</p>
            <p className="text-sm mb-4">
              {githubConfig.errorState.description}
            </p>
            <Button variant="outline" asChild>
              <Link
                href={`https://github.com/${githubConfig.username}`}
                className="inline-flex items-center gap-2"
              >
                <GithubIcon className="w-4 h-4" />
                {githubConfig.errorState.buttonText}
              </Link>
            </Button>
          </div>
        ) : (
          <div className="relative overflow-hidden">
            <div className="relative bg-muted/30 rounded-lg border border-border/50 shadow-inner p-3 sm:p-4 md:p-5">
              <div className="w-full overflow-x-auto">
                <ActivityCalendar
                  data={contributions}
                  blockSize={12}
                  blockMargin={4}
                  fontSize={githubConfig.fontSize}
                  colorScheme={theme === "dark" ? "dark" : "light"}
                  maxLevel={githubConfig.maxLevel}
                  showTotalCount={false}
                  showColorLegend={true}
                  showMonthLabels={true}
                  theme={githubConfig.theme}
                  labels={{
                    months: githubConfig.months,
                    weekdays: githubConfig.weekdays,
                    totalCount: githubConfig.totalCountLabel,
                  }}
                  style={{
                    color: "rgb(139, 148, 158)",
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
