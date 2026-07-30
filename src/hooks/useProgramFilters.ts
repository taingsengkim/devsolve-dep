import { useState } from "react";
import { ProgramType, AssetCategory, ProgramStatus } from "@/lib/types/programs/types";

export function useProgramFilters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [querySearch, setQuerySearch] = useState("");
  const [quickFilter, setQuickFilter] = useState<"all" | "bounty" | "response" | "new" | "private">("all");
  const [selectedType, setSelectedType] = useState<"All" | ProgramType>("All");
  const [selectedCategory, setSelectedCategory] = useState<"All" | AssetCategory>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuerySearch(searchTerm);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setQuerySearch("");
    setCurrentPage(1);
  };

  const handleQuickFilterClick = (filter: "all" | "bounty" | "response" | "new" | "private") => {
    setQuickFilter(filter);
    setCurrentPage(1);
    if (filter === "bounty") setSelectedType("Bounty");
    else if (filter === "response") setSelectedType("Response");
    else if (filter === "all") setSelectedType("All");
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setQuerySearch("");
    setQuickFilter("all");
    setSelectedType("All");
    setSelectedCategory("All");
    setSelectedStatus("All");
    setCurrentPage(1);
  };

  const isFilterActive =
    Boolean(querySearch) ||
    quickFilter !== "all" ||
    selectedType !== "All" ||
    selectedCategory !== "All" ||
    selectedStatus !== "All";

  return {
    searchTerm,
    setSearchTerm,
    querySearch,
    quickFilter,
    selectedType,
    setSelectedType,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
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
    queryProps: {
      search: querySearch,
      quickFilter,
      type: selectedType,
      category: selectedCategory,
      status: selectedStatus === "All" ? undefined : (selectedStatus as ProgramStatus),
      page: currentPage,
      limit: rowsPerPage,
    },
  };
}
