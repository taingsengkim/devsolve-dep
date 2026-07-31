"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  useGetCountriesQuery,
  useDetectCountryQuery,
  type CountryOption,
} from "@/lib/redux/services/geoApi";
import { DEFAULT_COUNTRIES } from "@/lib/constants/auth";

export function useAutoDetectCountry(
  onDetect?: (countryName: string, countryCode: string) => void
) {
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [selectedCountryName, setSelectedCountryName] = useState<string>("");
  const hasDetectedRef = useRef(false);

  // Keep a ref to the latest onDetect callback to avoid re-triggering effects on inline functions
  const onDetectRef = useRef(onDetect);
  useEffect(() => {
    onDetectRef.current = onDetect;
  }, [onDetect]);

  // RTK Query hooks
  const { data: fetchedCountries } = useGetCountriesQuery();
  const { data: ipGeoData, isLoading: isDetectingIp } = useDetectCountryQuery();

  const countriesList: CountryOption[] =
    fetchedCountries && fetchedCountries.length > 0
      ? fetchedCountries
      : DEFAULT_COUNTRIES;

  const handleSetCountry = useCallback((name: string, code: string) => {
    setSelectedCountryName(name);
    setCountryCode(code.toLowerCase());
    if (onDetectRef.current) {
      onDetectRef.current(name, code.toLowerCase());
    }
  }, []);

  useEffect(() => {
    if (hasDetectedRef.current) return;

    if (ipGeoData?.country_name && ipGeoData?.country_code) {
      hasDetectedRef.current = true;
      handleSetCountry(ipGeoData.country_name, ipGeoData.country_code);
      return;
    }

    if (!isDetectingIp) {
      hasDetectedRef.current = true;
      try {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        let detectedName = "";
        let detectedCode = "";

        if (timeZone.includes("Phnom_Penh") || timeZone.includes("Bangkok")) {
          detectedName = "Cambodia";
          detectedCode = "kh";
        } else if (timeZone.includes("Ho_Chi_Minh")) {
          detectedName = "Vietnam";
          detectedCode = "vn";
        } else if (timeZone.includes("Singapore")) {
          detectedName = "Singapore";
          detectedCode = "sg";
        } else if (timeZone.includes("Tokyo")) {
          detectedName = "Japan";
          detectedCode = "jp";
        } else if (
          timeZone.includes("New_York") ||
          timeZone.includes("Los_Angeles") ||
          timeZone.includes("Chicago")
        ) {
          detectedName = "United States";
          detectedCode = "us";
        } else if (timeZone.includes("London")) {
          detectedName = "United Kingdom";
          detectedCode = "gb";
        } else {
          const userLanguage =
            typeof navigator !== "undefined" ? navigator.language : "en-US";
          const cCode = userLanguage.split("-")[1];
          if (cCode) {
            detectedCode = cCode.toLowerCase();
            if (typeof Intl.DisplayNames !== "undefined") {
              const regionNames = new Intl.DisplayNames(["en"], {
                type: "region",
              });
              detectedName = regionNames.of(cCode) || "";
            }
          }
        }

        if (detectedName || detectedCode) {
          handleSetCountry(detectedName || "Cambodia", detectedCode || "kh");
        } else {
          handleSetCountry("Cambodia", "kh");
        }
      } catch {
        handleSetCountry("Cambodia", "kh");
      }
    }
  }, [ipGeoData, isDetectingIp, handleSetCountry]);

  return {
    countriesList,
    countryCode,
    selectedCountryName,
    isDetecting: isDetectingIp,
    handleSetCountry,
  };
}
