import { NextResponse, type NextRequest } from "next/server";
import * as z from "zod";
import {
  bearerTokenFor,
  relay,
  unreachable,
  upstreamFetch,
} from "@/lib/api/proxy";

const leaderboardEntrySchema = z
  .object({
    rank: z.number().int().nonnegative(),
    id: z.uuid(),
    fullName: z.string().nullish(),
    avatarUrl: z.string().nullish(),
    country: z.string().nullish(),
    reputation: z.number().int().nullish(),
    totalReports: z.number().int().nullish(),
    validReports: z.number().int().nullish(),
    criticalReports: z.number().int().nullish(),
    recognitionCount: z.number().int().nullish(),
  })
  .passthrough();

const leaderboardPageSchema = z
  .object({
    totalElements: z.number().int().nonnegative().optional(),
    totalPages: z.number().int().positive().optional(),
    size: z.number().int().positive().optional(),
    content: z.array(leaderboardEntrySchema).default([]),
    number: z.number().int().nonnegative().optional(),
    first: z.boolean().optional(),
    last: z.boolean().optional(),
    numberOfElements: z.number().int().nonnegative().optional(),
    pageable: z.unknown().optional(),
    sort: z.unknown().optional(),
    empty: z.boolean().optional(),
  })
  .passthrough();

type LeaderboardPage = z.infer<typeof leaderboardPageSchema>;

const PAGE_SIZE = 100;

async function fetchLeaderboardPage(page: number, token: string | null) {
  const response = await upstreamFetch(
    `/reputation/leaderboard?page=${page}&size=${PAGE_SIZE}`,
    token,
  );

  const raw = await response.text();
  let data: unknown = null;
  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = null;
    }
  }

  return { response, data };
}

export async function GET(request: NextRequest) {
  const token = await bearerTokenFor(request);

  try {
    const firstPage = await fetchLeaderboardPage(0, token);
    if (!firstPage.response.ok) {
      return relay(firstPage.response, "Unable to load the leaderboard.");
    }

    const firstParsed = leaderboardPageSchema.safeParse(firstPage.data);
    if (!firstParsed.success) {
      return NextResponse.json(
        { message: "The leaderboard service returned an unexpected response." },
        { status: 502 },
      );
    }

    const totalPages = Math.max(1, firstParsed.data.totalPages ?? 1);
    const remainingPages =
      totalPages > 1
        ? await Promise.all(
            Array.from({ length: totalPages - 1 }, (_, index) =>
              fetchLeaderboardPage(index + 1, token),
            ),
          )
        : [];

    for (const page of remainingPages) {
      if (!page.response.ok) {
        return relay(page.response, "Unable to load the leaderboard.");
      }
    }

    const parsedRemaining: LeaderboardPage[] = [];
    for (const page of remainingPages) {
      const parsed = leaderboardPageSchema.safeParse(page.data);
      if (!parsed.success) {
        return NextResponse.json(
          { message: "The leaderboard service returned an unexpected response." },
          { status: 502 },
        );
      }
      parsedRemaining.push(parsed.data);
    }

    const content = [
      ...firstParsed.data.content,
      ...parsedRemaining.flatMap((page) => page.content),
    ];

    return NextResponse.json(
      {
        ...firstParsed.data,
        totalElements: firstParsed.data.totalElements ?? content.length,
        totalPages: 1,
        size: content.length,
        content,
        number: 0,
        first: true,
        last: true,
        numberOfElements: content.length,
        empty: content.length === 0,
      },
      { status: 200 },
    );
  } catch {
    return unreachable("leaderboard");
  }
}
