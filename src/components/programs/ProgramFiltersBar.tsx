"use client";

import { motion } from "motion/react";
import { RotateCcw, SlidersHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  ProgramAssetFilter,
  ProgramIndustryFilter,
  ProgramSeverityFilter,
} from "@/hooks/useProgramFilters";
import { cn } from "@/lib/utils";

interface ProgramFiltersBarProps {
  selectedAsset: ProgramAssetFilter;
  onAssetChange: (asset: ProgramAssetFilter) => void;
  selectedSeverity: ProgramSeverityFilter;
  onSeverityChange: (severity: ProgramSeverityFilter) => void;
  selectedIndustry: ProgramIndustryFilter;
  onIndustryChange: (industry: ProgramIndustryFilter) => void;
  country: string;
  onCountryChange: (country: string) => void;
  countryOptions: CountryFilterOption[];
  isLoadingCountries?: boolean;
  minReward: string;
  maxReward: string;
  onMinRewardChange: (value: string) => void;
  onMaxRewardChange: (value: string) => void;
  activeCount: number;
  onResetFilters: () => void;
  className?: string;
  showHeader?: boolean;
  idPrefix?: string;
}

export interface CountryFilterOption {
  value: string;
  label: string;
  code?: string;
}

const ASSET_OPTIONS: Array<{
  value: ProgramAssetFilter;
  label: string;
}> = [
  { value: "All", label: "All asset types" },
  { value: "URL", label: "Websites" },
  { value: "WILDCARD", label: "Wildcard domains" },
  { value: "API", label: "APIs" },
  { value: "MOBILE_APP", label: "Mobile apps" },
  { value: "SOURCE_CODE", label: "Source code" },
  { value: "IP_RANGE", label: "IP ranges" },
  { value: "HARDWARE", label: "Hardware" },
  { value: "OTHER", label: "Other" },
];

const SEVERITY_OPTIONS: Array<{
  value: ProgramSeverityFilter;
  label: string;
}> = [
  { value: "All", label: "Any severity" },
  { value: "CRITICAL", label: "Critical" },
  { value: "HIGH", label: "High" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LOW", label: "Low" },
  { value: "NONE", label: "None" },
];

const INDUSTRY_OPTIONS: Array<{
  value: ProgramIndustryFilter;
  label: string;
}> = [
  { value: "All", label: "All industries" },
  { value: "TECHNOLOGY", label: "Technology" },
  { value: "FINANCE", label: "Finance" },
  { value: "HEALTHCARE", label: "Healthcare" },
  { value: "ECOMMERCE", label: "E-commerce" },
  { value: "GOVERNMENT", label: "Government" },
  { value: "EDUCATION", label: "Education" },
  { value: "OTHER", label: "Other" },
];

export function ProgramFiltersBar({
  selectedAsset,
  onAssetChange,
  selectedSeverity,
  onSeverityChange,
  selectedIndustry,
  onIndustryChange,
  country,
  onCountryChange,
  countryOptions,
  isLoadingCountries,
  minReward,
  maxReward,
  onMinRewardChange,
  onMaxRewardChange,
  activeCount,
  onResetFilters,
  className,
  showHeader = true,
  idPrefix = "desktop-program",
}: ProgramFiltersBarProps) {
  const minimum = minReward === "" ? null : Number(minReward);
  const maximum = maxReward === "" ? null : Number(maxReward);
  const rangeInvalid =
    minimum !== null && maximum !== null && minimum > maximum;
  const assetId = `${idPrefix}-asset`;
  const severityId = `${idPrefix}-severity`;
  const industryId = `${idPrefix}-industry`;
  const countryId = `${idPrefix}-country`;
  const minimumId = `${idPrefix}-minimum`;
  const maximumId = `${idPrefix}-maximum`;

  return (
    <motion.aside
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut", delay: 0.08 }}
      aria-label="Program filters"
      className={cn(
        "lg:sticky lg:top-6 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start",
        className,
      )}
    >
      <Card className="gap-0 rounded-2xl py-0 shadow-xs ring-1 ring-foreground/5">
        {showHeader ? (
          <CardHeader className="px-5 pt-5 pb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <SlidersHorizontal aria-hidden="true" className="size-4" />
                </span>
                <CardTitle className="text-base font-bold">Explore</CardTitle>
              </div>
              {activeCount > 0 ? (
                <Badge variant="secondary" className="tabular-nums">
                  {activeCount} active
                </Badge>
              ) : null}
            </div>
            <CardDescription className="mt-1 text-sm">
              Narrow programs by scope, organization, and reward.
            </CardDescription>
          </CardHeader>
        ) : (
          <CardHeader className="sr-only">
            <CardTitle>Explore programs</CardTitle>
            <CardDescription>
              Narrow programs by scope, organization, and reward.
            </CardDescription>
          </CardHeader>
        )}

        <CardContent className={cn("px-5 pb-5", !showHeader && "pt-5")}>
          <FieldGroup className="gap-4">
            <FilterSelect
              id={assetId}
              label="Asset type"
              value={selectedAsset}
              options={ASSET_OPTIONS}
              onChange={(value) => onAssetChange(value as ProgramAssetFilter)}
            />
            <FilterSelect
              id={severityId}
              label="Maximum severity"
              value={selectedSeverity}
              options={SEVERITY_OPTIONS}
              onChange={(value) =>
                onSeverityChange(value as ProgramSeverityFilter)
              }
            />
            <FilterSelect
              id={industryId}
              label="Organization industry"
              value={selectedIndustry}
              options={INDUSTRY_OPTIONS}
              onChange={(value) =>
                onIndustryChange(value as ProgramIndustryFilter)
              }
            />

            <Field>
              <FieldLabel htmlFor={countryId}>Country</FieldLabel>
              <Select
                value={country || "All"}
                onValueChange={(value) =>
                  value && onCountryChange(value === "All" ? "" : value)
                }
                disabled={isLoadingCountries}
              >
                <SelectTrigger
                  id={countryId}
                  className="h-10 w-full rounded-xl border-border bg-background text-base"
                >
                  <SelectValue>
                    {(value: string) => {
                      if (isLoadingCountries) return "Loading countries...";
                      if (value === "All") return "All countries";
                      return (
                        countryOptions.find((option) => option.value === value)
                          ?.label ?? value
                      );
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  <SelectGroup>
                    <SelectItem value="All" className="text-base">
                      All countries
                    </SelectItem>
                    {countryOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="text-base"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field data-invalid={rangeInvalid}>
                <FieldLabel htmlFor={minimumId}>Min reward</FieldLabel>
                <Input
                  id={minimumId}
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={minReward}
                  onChange={(event) => onMinRewardChange(event.target.value)}
                  placeholder="Any"
                  aria-invalid={rangeInvalid}
                  className="h-10 rounded-xl border-border bg-background text-base"
                />
              </Field>
              <Field data-invalid={rangeInvalid}>
                <FieldLabel htmlFor={maximumId}>Max reward</FieldLabel>
                <Input
                  id={maximumId}
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={maxReward}
                  onChange={(event) => onMaxRewardChange(event.target.value)}
                  placeholder="Any"
                  aria-invalid={rangeInvalid}
                  className="h-10 rounded-xl border-border bg-background text-base"
                />
              </Field>
            </div>
            {rangeInvalid ? (
              <FieldError>Maximum must be at least the minimum.</FieldError>
            ) : null}
          </FieldGroup>
        </CardContent>

        {activeCount > 0 ? (
          <CardFooter className="border-t border-border px-5 py-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onResetFilters}
              className="w-full rounded-xl"
            >
              <RotateCcw data-icon="inline-start" aria-hidden="true" />
              Clear explore filters
            </Button>
          </CardFooter>
        ) : null}
      </Card>
    </motion.aside>
  );
}

function FilterSelect({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Select
        value={value}
        onValueChange={(nextValue) => nextValue && onChange(nextValue)}
      >
        <SelectTrigger
          id={id}
          className="h-10 w-full rounded-xl border-border bg-background text-base"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-base"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}
