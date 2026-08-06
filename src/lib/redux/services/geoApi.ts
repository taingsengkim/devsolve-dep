import { baseApi } from "./baseApi";

export interface CountryOption {
  name: string;
  code: string;
}

export interface IpGeoResult {
  country_name: string;
  country_code: string;
}

export const geoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCountries: builder.query<CountryOption[], void>({
      queryFn: async () => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000);
          const res = await fetch(
            "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/index.json",
            { signal: controller.signal }
          );
          clearTimeout(timeoutId);
          if (!res.ok) throw new Error("Failed to fetch countries");
          const data = await res.json();
          const formatted: CountryOption[] = data
            .map((item: { name: string; code: string }) => ({
              name: item.name || "",
              code: item.code ? item.code.toLowerCase() : "",
            }))
            .filter((c: CountryOption) => Boolean(c.name && c.code))
            .sort((a: CountryOption, b: CountryOption) =>
              a.name.localeCompare(b.name)
            );
          return { data: formatted };
        } catch {
          return { data: [] };
        }
      },
    }),
    detectCountry: builder.query<IpGeoResult | null, void>({
      queryFn: async () => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2500);
          const res = await fetch("https://ipapi.co/json/", {
            signal: controller.signal,
          });
          clearTimeout(timeoutId);
          if (!res.ok) return { data: null };
          const data = await res.json();
          if (!data.country_name) return { data: null };
          return { data };
        } catch {
          return { data: null };
        }
      },
    }),
  }),
});

export const { useGetCountriesQuery, useDetectCountryQuery } = geoApi;
