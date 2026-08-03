import { useState } from "react";
import {
  GetProgramsParams,
  ProgramState,
  ProgramType,
} from "@/lib/types/programs/types";

export function useProgramFilters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [quickFilter, setQuickFilter] = useState("all");

  // Typed with ProgramType ("All" | "Bounty" | "Response") to fix TS overlap error
  const [selectedType, setSelectedType] = useState<ProgramType>("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState<"All" | ProgramState>("All");

  // Reward / Points Range State
  const [minReward, setMinReward] = useState("");
  const [maxReward, setMaxReward] = useState("");

  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setActiveSearch(searchTerm.trim());
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setActiveSearch("");
    setCurrentPage(1);
  };

  const handleQuickFilterClick = (filterKey: string) => {
    setQuickFilter(filterKey);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setActiveSearch("");
    setQuickFilter("all");
    setSelectedType("All");
    setSelectedCategory("All");
    setSelectedStatus("All");
    setMinReward("");
    setMaxReward("");
    setCurrentPage(1);
  };

  const isFilterActive =
    activeSearch !== "" ||
    quickFilter !== "all" ||
    selectedType !== "All" ||
    selectedCategory !== "All" ||
    selectedStatus !== "All" ||
    minReward !== "" ||
    maxReward !== "";

  // Map UI filter selections ("Bounty", "Response") to backend API params ("MANAGED", "RESPONSE")
  const getBackendEngagementType = (type: ProgramType): string | undefined => {
    if (type === "Bounty") return "MANAGED";
    if (type === "Response") return "RESPONSE";
    return undefined;
  };

  // Build params matching GetProgramsParams interface
  const queryProps: GetProgramsParams = {
    page: currentPage,
    size: rowsPerPage,
    search: activeSearch || undefined,
    engagementType: getBackendEngagementType(selectedType),
    state: selectedStatus !== "All" ? selectedStatus : undefined,
  };

  return {
    searchTerm,
    setSearchTerm,
    quickFilter,
    selectedType,
    setSelectedType,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    minReward,
    setMinReward,
    maxReward,
    setMaxReward,
    showMoreFilters,
    setShowMoreFilters,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    handleSearchSubmit,
    handleClearSearch,
    handleQuickFilterClick,
    handleResetFilters,
    isFilterActive,
    queryProps,
  };
}