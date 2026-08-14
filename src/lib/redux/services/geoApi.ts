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
      query: () => "/geo/countries",
    }),
    detectCountry: builder.query<IpGeoResult | null, void>({
      query: () => "/geo/detect-country",
    }),
  }),
});

export const { useGetCountriesQuery, useDetectCountryQuery } = geoApi;
