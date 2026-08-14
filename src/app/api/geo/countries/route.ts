import { NextResponse } from "next/server";
import * as z from "zod";

const upstreamCountrySchema = z.object({
  name: z.string().min(1),
  code: z.string().length(2),
});

/** GET /api/geo/countries — normalized country names and ISO alpha-2 codes. */
export async function GET() {
  try {
    const upstream = await fetch(
      "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/index.json",
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 86_400 },
        signal: AbortSignal.timeout(5_000),
      },
    );

    if (!upstream.ok) {
      return NextResponse.json(
        { message: "Unable to load countries." },
        { status: 502 },
      );
    }

    const parsed = z.array(upstreamCountrySchema).safeParse(await upstream.json());
    if (!parsed.success) {
      return NextResponse.json(
        { message: "The countries service returned an invalid response." },
        { status: 502 },
      );
    }

    const countries = parsed.data
      .map((country) => ({
        name: country.name,
        code: country.code.toLowerCase(),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json(countries);
  } catch {
    return NextResponse.json(
      { message: "Unable to reach the countries service." },
      { status: 502 },
    );
  }
}
