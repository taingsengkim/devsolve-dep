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
            "https://restcountries.com/v3.1/all?fields=name,cca2",
            { signal: controller.signal }
          );
          clearTimeout(timeoutId);
          if (!res.ok) throw new Error("Failed to fetch countries");
          const data = await res.json();
          const formatted: CountryOption[] = data
            .map((item: { name: { common: string }; cca2: string }) => ({
              name: item.name?.common || "",
              code: item.cca2 ? item.cca2.toLowerCase() : "",
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
