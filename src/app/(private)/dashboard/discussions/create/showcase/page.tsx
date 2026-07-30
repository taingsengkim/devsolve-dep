"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Code2,
  Image as ImageIcon,
  Network,
  Globe,
  Video,
  X,
  Sparkles,
  Save,
  Send,
  HelpCircle,
  FileText,
  Search,
} from "lucide-react";

interface StepItem {
  id: string;
  title: string;
  description: string;
  codeSnippet: string;
  imagePreviewUrl: string | null;
  diagramMode: "text" | "file";
  diagramText: string;
  diagramFileUrl: string | null;
  activeMediaType: "none" | "code" | "image" | "diagram";
}

// Master list of searchable technologies
const ALL_TECH_STACKS = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Tailwind CSS",
  "Java",
  "Spring Boot",
  "PostgreSQL",
  "DBeaver",
  "Docker",
  "Node.js",
  "Express.js",
  "Python",
  "FastAPI",
  "Firebase",
  "MongoDB",
  "Prisma",
  "GraphQL",
  "Redis",
  "AWS",
  "Vercel",
  "Flutter",
  "React Native",
  "Vue.js",
  "Svelte",
];

export default function CreateShowcasePage() {
  // --- Form State ---
  const [projectTitle, setProjectTitle] = useState("");
  const [category, setCategory] = useState("Web Development");
  const [overview, setOverview] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);

  // Tech Stack Tags
  const [tags, setTags] = useState<string[]>(["React", "TypeScript", "Tailwind CSS"]);
  const [tagInput, setTagInput] = useState("");
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);

  // Links
  const [liveDemoUrl, setLiveDemoUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  // Build Steps State
  const [steps, setSteps] = useState<StepItem[]>([
    {
      id: "step-1",
      title: "Project Setup & Environment Initialization",
      description: "Initialize project repository and install required dependencies.",
      codeSnippet: "npx create-next-app@latest my-project --typescript --tailwind",
      imagePreviewUrl: null,
      diagramMode: "text",
      diagramText: "",
      diagramFileUrl: null,
      activeMediaType: "code",
    },
    {
      id: "step-2",
      title: "Designing the UI & Dashboard Screens",
      description: "Created high-fidelity wireframes and built responsive dashboard components.",
      codeSnippet: "",
      imagePreviewUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
      diagramMode: "text",
      diagramText: "",
      diagramFileUrl: null,
      activeMediaType: "image",
    },
  ]);

  // --- Searchable Tech Stack Filtering ---
  const filteredTechs = useMemo(() => {
    if (!tagInput.trim()) return ALL_TECH_STACKS.filter((t) => !tags.includes(t));
    const query = tagInput.toLowerCase().trim();
    return ALL_TECH_STACKS.filter(
      (tech) => tech.toLowerCase().includes(query) && !tags.includes(tech)
    );
  }, [tagInput, tags]);

  const addSingleTag = (tagToAdd: string) => {
    const cleaned = tagToAdd.trim().replace(/^#/, "");
    if (cleaned && !tags.includes(cleaned)) {
      setTags([...tags, cleaned]);
    }
    setTagInput("");
    setIsTagDropdownOpen(false);
  };

  const handleKeyDownTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      addSingleTag(tagInput);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // --- Real File Upload Handlers ---
  const handleCoverFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCoverImage(imageUrl);
    }
  };

  const handleStepImageUpload = (
    stepId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      handleUpdateStep(stepId, "imagePreviewUrl", imageUrl);
    }
  };

  const handleDiagramFileUpload = (
    stepId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      handleUpdateStep(stepId, "diagramFileUrl", fileUrl);
    }
  };

  // --- Step Handlers ---
  const handleAddStep = () => {
    setSteps([
      ...steps,
      {
        id: `step-${Date.now()}`,
        title: "",
        description: "",
        codeSnippet: "",
        imagePreviewUrl: null,
        diagramMode: "text",
        diagramText: "",
        diagramFileUrl: null,
        activeMediaType: "none",
      },
    ]);
  };

  const handleRemoveStep = (id: string) => {
    if (steps.length <= 1) return;
    setSteps(steps.filter((s) => s.id !== id));
  };

  const handleUpdateStep = (id: string, field: keyof StepItem, value: any) => {
    setSteps(
      steps.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/discussions/create"
            className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Link>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex items-center space-x-2">
            <div className="h-7 w-7 rounded-lg bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold text-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-slate-900 leading-tight">
                Create Showcase
              </h1>
              <p className="text-[10px] text-slate-400">
                Share your project, tech stack, and build guide
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-1.5 rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
            <Save className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Save Draft</span>
          </button>
          <button className="flex items-center space-x-1.5 rounded-xl bg-[#2563EB] px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-xs">
            <Send className="h-3.5 w-3.5" />
            <span>Publish Showcase</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="mx-auto max-w-6xl w-full px-6 pt-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Overview & Steps */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Project Overview */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                1. Project Overview
              </h2>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Project Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. Mobile Expense Tracker & Analytics App"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Real Cover Image Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Cover Banner Image
                </label>
                {coverImage ? (
                  <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-slate-200">
                    <img
                      src={coverImage}
                      alt="Cover banner"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setCoverImage(null)}
                      className="absolute top-2 right-2 rounded-full bg-slate-900/80 p-1.5 text-white hover:bg-rose-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverFileUpload}
                      className="hidden"
                    />
                    <div className="mb-2 rounded-full bg-blue-50 p-3 text-[#2563EB] group-hover:scale-110 transition-transform">
                      <Upload className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-700">
                      Click or drag to upload cover image
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      PNG, JPG, or WebP (Recommended ratio 16:9)
                    </p>
                  </label>
                )}
              </div>

              {/* Overview */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Overview & Motivation
                </label>
                <textarea
                  rows={4}
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                  placeholder="Tell the community what inspired this project, key features, and problems it solves..."
                  className="w-full rounded-xl border border-slate-200 p-3.5 text-xs text-slate-700 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all placeholder:text-slate-400 leading-relaxed"
                />
              </div>
            </div>

            {/* 2. Step-by-Step Implementation */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Step-by-Step Implementation
                  </h2>
                  <p className="text-xs text-slate-400">
                    Break down your architecture, code logic, or UI designs step by step.
                  </p>
                </div>
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-[#2563EB]">
                  {steps.length} Steps
                </span>
              </div>

              {/* Dynamic Steps List */}
              <div className="space-y-6">
                {steps.map((step, idx) => (
                  <div
                    key={step.id}
                    className="relative rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-4 transition-all hover:border-slate-300"
                  >
                    {/* Step Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center space-x-2.5 flex-1">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-xs font-bold text-white shadow-xs">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) =>
                            handleUpdateStep(step.id, "title", e.target.value)
                          }
                          placeholder={`Step ${idx + 1} Title (e.g., Setting up Auth)`}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 focus:border-[#2563EB] focus:outline-none"
                        />
                      </div>

                      {steps.length > 1 && (
                        <button
                          onClick={() => handleRemoveStep(step.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Remove Step"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {/* Step Description */}
                    <div>
                      <textarea
                        rows={2}
                        value={step.description}
                        onChange={(e) =>
                          handleUpdateStep(step.id, "description", e.target.value)
                        }
                        placeholder="Explain what was done in this step..."
                        className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700 focus:border-[#2563EB] focus:outline-none placeholder:text-slate-400"
                      />
                    </div>

                    {/* Media Selector */}
                    <div className="pt-1">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-[11px] font-bold text-slate-500">
                          Attach Media:
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateStep(
                              step.id,
                              "activeMediaType",
                              step.activeMediaType === "code" ? "none" : "code"
                            )
                          }
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                            step.activeMediaType === "code"
                              ? "bg-slate-900 text-blue-300 shadow-xs"
                              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <Code2 className="h-3.5 w-3.5" />
                          <span>Code Snippet</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateStep(
                              step.id,
                              "activeMediaType",
                              step.activeMediaType === "image" ? "none" : "image"
                            )
                          }
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                            step.activeMediaType === "image"
                              ? "bg-[#2563EB] text-white shadow-xs"
                              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <ImageIcon className="h-3.5 w-3.5" />
                          <span>Screenshot</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateStep(
                              step.id,
                              "activeMediaType",
                              step.activeMediaType === "diagram" ? "none" : "diagram"
                            )
                          }
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                            step.activeMediaType === "diagram"
                              ? "bg-emerald-600 text-white shadow-xs"
                              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <Network className="h-3.5 w-3.5" />
                          <span>Diagram</span>
                        </button>
                      </div>

                      {/* 1. Code Snippet Payload */}
                      {step.activeMediaType === "code" && (
                        <div className="rounded-xl bg-[#0d1117] p-3 border border-slate-800 space-y-2">
                          <span className="text-[10px] text-slate-400 font-mono block">
                            Code Terminal / Commands
                          </span>
                          <textarea
                            rows={3}
                            value={step.codeSnippet}
                            onChange={(e) =>
                              handleUpdateStep(step.id, "codeSnippet", e.target.value)
                            }
                            placeholder="// Enter terminal command or code block here..."
                            className="w-full bg-transparent text-xs font-mono text-blue-300 focus:outline-none leading-relaxed"
                          />
                        </div>
                      )}

                      {/* 2. Real Screenshot File Upload */}
                      {step.activeMediaType === "image" && (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-center">
                          {step.imagePreviewUrl ? (
                            <div className="relative rounded-lg overflow-hidden h-36">
                              <img
                                src={step.imagePreviewUrl}
                                alt="Step preview"
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateStep(step.id, "imagePreviewUrl", null)
                                }
                                className="absolute top-2 right-2 rounded-full bg-slate-900/80 p-1 text-white hover:bg-rose-600"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ) : (
                            <label className="cursor-pointer flex flex-col items-center">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleStepImageUpload(step.id, e)}
                                className="hidden"
                              />
                              <ImageIcon className="h-6 w-6 text-slate-400 mb-1" />
                              <span className="text-xs font-semibold text-slate-600">
                                Click to upload Screenshot / UI Wireframe
                              </span>
                              <span className="text-[10px] text-slate-400">
                                PNG, JPG or WebP
                              </span>
                            </label>
                          )}
                        </div>
                      )}

                      {/* 3. Flexible Architecture Diagram Mode (Text vs Upload File) */}
                      {step.activeMediaType === "diagram" && (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-3">
                          <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                              Architecture Diagram
                            </span>
                            
                            {/* Toggle mode: Mermaid Code vs File Upload */}
                            <div className="flex rounded-lg bg-emerald-100/80 p-0.5 text-[10px] font-bold text-emerald-800">
                              <button
                                type="button"
                                onClick={() => handleUpdateStep(step.id, "diagramMode", "text")}
                                className={`px-2 py-0.5 rounded-md transition-colors ${
                                  step.diagramMode === "text"
                                    ? "bg-white text-emerald-900 shadow-xs"
                                    : "hover:text-emerald-900"
                                }`}
                              >
                                Mermaid Text
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateStep(step.id, "diagramMode", "file")}
                                className={`px-2 py-0.5 rounded-md transition-colors ${
                                  step.diagramMode === "file"
                                    ? "bg-white text-emerald-900 shadow-xs"
                                    : "hover:text-emerald-900"
                                }`}
                              >
                                Upload Image/PDF
                              </button>
                            </div>
                          </div>

                          {step.diagramMode === "text" ? (
                            <textarea
                              rows={3}
                              value={step.diagramText}
                              onChange={(e) =>
                                handleUpdateStep(step.id, "diagramText", e.target.value)
                              }
                              placeholder="Client -> API Gateway: Request Auth Token..."
                              className="w-full bg-white border border-emerald-200 rounded-lg p-2.5 text-xs font-mono text-slate-700 focus:outline-none"
                            />
                          ) : (
                            <div>
                              {step.diagramFileUrl ? (
                                <div className="relative rounded-lg overflow-hidden h-32 border border-emerald-200 bg-white p-2 flex items-center justify-center">
                                  <img
                                    src={step.diagramFileUrl}
                                    alt="Diagram"
                                    className="h-full object-contain"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleUpdateStep(step.id, "diagramFileUrl", null)
                                    }
                                    className="absolute top-2 right-2 rounded-full bg-slate-900/80 p-1 text-white hover:bg-rose-600"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ) : (
                                <label className="cursor-pointer flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-emerald-300 bg-white p-4 text-center hover:bg-emerald-50/50">
                                  <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={(e) => handleDiagramFileUpload(step.id, e)}
                                    className="hidden"
                                  />
                                  <Network className="h-5 w-5 text-emerald-600 mb-1" />
                                  <span className="text-xs font-bold text-emerald-900">
                                    Click to upload diagram file
                                  </span>
                                  <span className="text-[10px] text-emerald-600">
                                    Supports PNG, SVG, JPG, or PDF
                                  </span>
                                </label>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Step Button */}
              <button
                type="button"
                onClick={handleAddStep}
                className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-xs font-bold text-slate-600 hover:border-blue-400 hover:bg-blue-50 hover:text-[#2563EB] transition-all flex items-center justify-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Another Step</span>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar (Searchable Stack & Links) */}
          <div className="space-y-6">
            
            {/* Category & Searchable Tech Stack */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                Project Classification
              </h3>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-[#2563EB] focus:outline-none"
                >
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Security Architecture">Security Architecture</option>
                  <option value="AI / Machine Learning">AI / Machine Learning</option>
                  <option value="DevOps & Infrastructure">DevOps & Infrastructure</option>
                </select>
              </div>

              {/* Searchable Tech Stack Input */}
              <div className="relative">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Search & Add Tech Stack
                </label>

                {/* Selected Tag Pills Container */}
                <div className="rounded-xl border border-slate-200 p-2.5 bg-slate-50/50 space-y-2 focus-within:border-[#2563EB] focus-within:bg-white transition-all">
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center space-x-1 rounded-md bg-blue-100 px-2.5 py-0.5 text-[11px] font-bold text-[#2563EB]"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-rose-600 ml-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Input box */}
                  <div className="flex items-center space-x-2">
                    <Search className="h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => {
                        setTagInput(e.target.value);
                        setIsTagDropdownOpen(true);
                      }}
                      onFocus={() => setIsTagDropdownOpen(true)}
                      onKeyDown={handleKeyDownTag}
                      placeholder="Search or type custom tech (e.g., Spring Boot)..."
                      className="w-full bg-transparent text-xs text-slate-700 focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Search Dropdown Results */}
                {isTagDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 z-20 max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg space-y-0.5">
                    {filteredTechs.length > 0 ? (
                      filteredTechs.map((tech) => (
                        <button
                          key={tech}
                          type="button"
                          onClick={() => addSingleTag(tech)}
                          className="w-full flex items-center justify-between rounded-lg px-3 py-1.5 text-xs text-left text-slate-700 hover:bg-blue-50 hover:text-[#2563EB] transition-colors"
                        >
                          <span>{tech}</span>
                          <Plus className="h-3 w-3" />
                        </button>
                      ))
                    ) : (
                      <button
                        type="button"
                        onClick={() => addSingleTag(tagInput)}
                        className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs text-left font-bold text-[#2563EB] hover:bg-blue-50 transition-colors"
                      >
                        <span>Add custom "{tagInput}"</span>
                        <Plus className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Links & External Assets */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                Links & Repository
              </h3>

              {/* Live Demo */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                  <Globe className="h-3.5 w-3.5 text-slate-400" />
                  <span>Live Demo URL</span>
                </label>
                <input
                  type="url"
                  value={liveDemoUrl}
                  onChange={(e) => setLiveDemoUrl(e.target.value)}
                  placeholder="https://myapp.com"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-[#2563EB] focus:outline-none"
                />
              </div>

              {/* GitHub Link */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                  {/* <Github className="h-3.5 w-3.5 text-slate-400" /> */}
                  <span>GitHub Repository</span>
                </label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/user/repo"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-[#2563EB] focus:outline-none"
                />
              </div>

              {/* Video Demo */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                  <Video className="h-3.5 w-3.5 text-slate-400" />
                  <span>Video Walkthrough (YouTube)</span>
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-[#2563EB] focus:outline-none"
                />
              </div>
            </div>

            {/* Showcase Tip */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 text-xs space-y-1.5">
              <div className="flex items-center space-x-1.5 font-bold text-blue-900">
                <HelpCircle className="h-4 w-4 text-[#2563EB]" />
                <span>Showcase Tip</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Posts with uploaded architecture diagrams and code snippets get 3x more community feedback!
              </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}